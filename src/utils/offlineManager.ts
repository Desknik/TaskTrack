// Configuração para armazenamento offline
export const OfflineConfig = {
  // Chaves para localStorage
  STORAGE_KEYS: {
    TICKETS: 'tasktrack_tickets_offline',
    TASKS: 'tasktrack_tasks_offline',
    TIME_ENTRIES: 'tasktrack_time_entries_offline',
    SYNC_QUEUE: 'tasktrack_sync_queue',
    LAST_SYNC: 'tasktrack_last_sync',
  },

  // Configuração de sincronização
  SYNC_INTERVAL: 5 * 60 * 1000, // 5 minutos
  MAX_RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 segundo
};

// Utilitários para funcionalidade offline
export class OfflineManager {
  private static instance: OfflineManager;
  private syncQueue: any[] = [];
  private lastSync: Date | null = null;

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager();
    }
    return OfflineManager.instance;
  }

  // Salvar dados no localStorage
  saveToLocalStorage(key: string, data: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error);
    }
  }

  // Carregar dados do localStorage
  loadFromLocalStorage(key: string): any {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error);
      return null;
    }
  }

  // Adicionar item à fila de sincronização
  addToSyncQueue(action: string, data: any): void {
    const syncItem = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: new Date().toISOString(),
      attempts: 0,
    };

    this.syncQueue.push(syncItem);
    this.saveToLocalStorage(OfflineConfig.STORAGE_KEYS.SYNC_QUEUE, this.syncQueue);
  }

  // Processar fila de sincronização
  async processSyncQueue(): Promise<void> {
    if (!navigator.onLine || this.syncQueue.length === 0) {
      return;
    }

    const itemsToProcess = [...this.syncQueue];
    
    for (const item of itemsToProcess) {
      try {
        // Aqui você implementaria a lógica real de sincronização com a API
        await this.syncItem(item);
        
        // Remove item da fila se sincronizado com sucesso
        this.syncQueue = this.syncQueue.filter(queueItem => queueItem.id !== item.id);
      } catch (error) {
        console.error('Erro ao sincronizar item:', error);
        
        // Incrementar tentativas
        item.attempts++;
        
        // Remove se excedeu máximo de tentativas
        if (item.attempts >= OfflineConfig.MAX_RETRY_ATTEMPTS) {
          this.syncQueue = this.syncQueue.filter(queueItem => queueItem.id !== item.id);
          console.error('Item removido da fila após máximo de tentativas:', item);
        }
      }
    }

    // Salvar fila atualizada
    this.saveToLocalStorage(OfflineConfig.STORAGE_KEYS.SYNC_QUEUE, this.syncQueue);
    
    // Atualizar último sync
    this.lastSync = new Date();
    this.saveToLocalStorage(OfflineConfig.STORAGE_KEYS.LAST_SYNC, this.lastSync.toISOString());
  }

  // Sincronizar item individual (implementação específica da aplicação)
  private async syncItem(item: any): Promise<void> {
    // Esta é uma implementação de exemplo
    // Na aplicação real, você faria requisições HTTP para sua API
    
    switch (item.action) {
      case 'CREATE_TICKET':
        console.log('Sincronizando criação de ticket:', item.data);
        break;
      case 'UPDATE_TICKET':
        console.log('Sincronizando atualização de ticket:', item.data);
        break;
      case 'CREATE_TASK':
        console.log('Sincronizando criação de tarefa:', item.data);
        break;
      case 'UPDATE_TASK':
        console.log('Sincronizando atualização de tarefa:', item.data);
        break;
      case 'CREATE_TIME_ENTRY':
        console.log('Sincronizando entrada de tempo:', item.data);
        break;
      default:
        console.warn('Ação de sincronização não reconhecida:', item.action);
    }

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Inicializar manager offline
  initialize(): void {
    // Carregar fila de sincronização
    this.syncQueue = this.loadFromLocalStorage(OfflineConfig.STORAGE_KEYS.SYNC_QUEUE) || [];
    
    // Carregar último sync
    const lastSyncStr = this.loadFromLocalStorage(OfflineConfig.STORAGE_KEYS.LAST_SYNC);
    this.lastSync = lastSyncStr ? new Date(lastSyncStr) : null;

    // Configurar sincronização automática
    this.setupAutoSync();

    // Processar fila na inicialização
    if (navigator.onLine) {
      this.processSyncQueue();
    }
  }

  // Configurar sincronização automática
  private setupAutoSync(): void {
    // Sincronizar quando voltar online
    window.addEventListener('online', () => {
      console.log('Aplicação voltou online, processando fila de sincronização...');
      this.processSyncQueue();
    });

    // Sincronização periódica
    setInterval(() => {
      if (navigator.onLine) {
        this.processSyncQueue();
      }
    }, OfflineConfig.SYNC_INTERVAL);
  }

  // Obter status da sincronização
  getSyncStatus(): { queueLength: number; lastSync: Date | null } {
    return {
      queueLength: this.syncQueue.length,
      lastSync: this.lastSync,
    };
  }

  // Limpar dados offline
  clearOfflineData(): void {
    Object.values(OfflineConfig.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    this.syncQueue = [];
    this.lastSync = null;
  }
}

// Exportar instância singleton
export const offlineManager = OfflineManager.getInstance();
