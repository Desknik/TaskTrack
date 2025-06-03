import { registerSW } from 'virtual:pwa-register';

// Estado da atualização
interface UpdateState {
  updateAvailable: boolean;
  offlineReady: boolean;
  needRefresh: boolean;
  updateFunction: ((reloadPage?: boolean) => Promise<void>) | null;
}

export const updateState: UpdateState = {
  updateAvailable: false,
  offlineReady: false,
  needRefresh: false,
  updateFunction: null,
};

// Callbacks para componentes React
const updateCallbacks = new Set<(state: UpdateState) => void>();

export const subscribeToUpdates = (callback: (state: UpdateState) => void) => {
  updateCallbacks.add(callback);
  return () => updateCallbacks.delete(callback);
};

const notifyUpdateCallbacks = () => {
  updateCallbacks.forEach(callback => callback({ ...updateState }));
};

// Registrar Service Worker com sistema de atualizações aprimorado
const updateSW = registerSW({
  onNeedRefresh() {
    console.log('Nova versão disponível para instalação');
    updateState.needRefresh = true;
    updateState.updateAvailable = true;
    updateState.updateFunction = updateSW;
    
    notifyUpdateCallbacks();
    
    // Mostrar notificação se permitida
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification('TaskTrack - Atualização Disponível', {
        body: 'Uma nova versão está pronta. Clique para atualizar.',
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        tag: 'tasktrack-update',
        requireInteraction: true,
        actions: [
          { action: 'update', title: 'Atualizar Agora' },
          { action: 'later', title: 'Mais Tarde' }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
        PWAUtils.applyUpdate();
      };
    }
  },
  
  onOfflineReady() {
    console.log('App pronto para uso offline');
    updateState.offlineReady = true;
    notifyUpdateCallbacks();
    
    // Notificar usuário que o app está disponível offline
    PWAUtils.showNotification('TaskTrack Offline', {
      body: 'App instalado e disponível para uso offline!',
      tag: 'tasktrack-offline-ready'
    });
  },
  
  onRegistered(registration: ServiceWorkerRegistration | undefined) {
    console.log('SW Registered: ', registration);
    if (registration) {
      // Verificar atualizações periodicamente (a cada 60 segundos)
      setInterval(() => {
        registration.update();
      }, 60000);
    }
  },
    onRegisterError(error: unknown) {
    console.error('SW registration error:', error);
  },
});

// Funcionalidade adicional para PWA
export const PWAUtils = {
  // Verificar se é PWA
  isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator.standalone !== undefined && window.navigator.standalone) ||
           document.referrer.includes('android-app://');
  },

  // Solicitar permissão para notificações
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  },

  // Mostrar notificação
  showNotification(title: string, options: NotificationOptions = {}): Notification | null {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options
      });
    }
    return null;
  },

  // Verificar se o dispositivo está online
  isOnline(): boolean {
    return navigator.onLine;
  },

  // Aplicar atualização
  async applyUpdate(): Promise<void> {
    if (updateState.updateFunction) {
      try {
        await updateState.updateFunction(true);
        // Reset do estado após atualização
        updateState.updateAvailable = false;
        updateState.needRefresh = false;
        updateState.updateFunction = null;
        notifyUpdateCallbacks();
      } catch (error) {
        console.error('Erro ao aplicar atualização:', error);
        throw error;
      }
    }
  },

  // Obter informações da versão atual
  getVersionInfo(): { version: string; buildTime: string } {
    return {
      version: '1.0.0', // Você pode definir isso dinamicamente
      buildTime: new Date().toISOString()
    };
  },

  // Instalar prompt
  installPrompt: null as BeforeInstallPromptEvent | null,
  
  // Capturar evento de instalação
  captureInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      this.installPrompt = e;
      console.log('Install prompt captured');
    });
  },

  // Mostrar prompt de instalação
  async showInstallPrompt(): Promise<boolean> {
    if (this.installPrompt) {
      try {
        await this.installPrompt.prompt();
        const { outcome } = await this.installPrompt.userChoice;
        this.installPrompt = null;
        
        if (outcome === 'accepted') {
          this.showNotification('TaskTrack Instalado!', {
            body: 'O aplicativo foi instalado com sucesso.',
            tag: 'tasktrack-installed'
          });
        }
        
        return outcome === 'accepted';
      } catch (error) {
        console.error('Erro ao mostrar prompt de instalação:', error);
        return false;
      }
    }
    return false;
  },

  // Verificar se há atualizações disponíveis
  checkForUpdates(): boolean {
    return updateState.updateAvailable;
  },

  // Obter estado completo das atualizações
  getUpdateState(): UpdateState {
    return { ...updateState };
  }
};

// Inicializar captura do install prompt
PWAUtils.captureInstallPrompt();

// Listener para ações de notificação
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'NOTIFICATION_ACTION') {
      const { action } = event.data;
      
      switch (action) {
        case 'update':
          PWAUtils.applyUpdate();
          break;
        case 'later':
          console.log('Atualização adiada pelo usuário');
          break;
      }
    }
  });
}
