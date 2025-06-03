import { useState, useEffect } from 'react';
import { PWAUtils, subscribeToUpdates, updateState } from '../utils/pwaUtils';

export const usePWA = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPWA, setIsPWA] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Verificar se é PWA
    setIsPWA(PWAUtils.isPWA());

    // Verificar permissão de notificação
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Estado inicial das atualizações
    setUpdateAvailable(updateState.updateAvailable);
    setOfflineReady(updateState.offlineReady);

    // Listeners para conectividade
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listener para prompt de instalação
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    // Listener para mudanças no estado de atualização
    const unsubscribeFromUpdates = subscribeToUpdates((state) => {
      setUpdateAvailable(state.updateAvailable);
      setOfflineReady(state.offlineReady);
    });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      unsubscribeFromUpdates();
    };
  }, []);

  const install = async () => {
    if (canInstall) {
      const installed = await PWAUtils.showInstallPrompt();
      if (installed) {
        setCanInstall(false);
      }
      return installed;
    }
    return false;
  };

  const requestNotifications = async () => {
    const granted = await PWAUtils.requestNotificationPermission();
    setNotificationPermission(granted ? 'granted' : 'denied');
    return granted;
  };

  const showNotification = (title: string, options?: NotificationOptions) => {
    return PWAUtils.showNotification(title, options);
  };

  const applyUpdate = async () => {
    try {
      await PWAUtils.applyUpdate();
      setUpdateAvailable(false);
      return true;
    } catch (error) {
      console.error('Erro ao aplicar atualização:', error);
      return false;
    }
  };

  const checkForUpdates = () => {
    return PWAUtils.checkForUpdates();
  };

  const getVersionInfo = () => {
    return PWAUtils.getVersionInfo();
  };

  return {
    isOnline,
    isPWA,
    canInstall,
    updateAvailable,
    offlineReady,
    notificationPermission,
    install,
    requestNotifications,
    showNotification,
    applyUpdate,
    checkForUpdates,
    getVersionInfo,
  };
};

export default usePWA;
