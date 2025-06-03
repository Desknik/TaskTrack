import React from 'react';
import { Smartphone, Bell, Wifi, Download, Trash2, RefreshCw } from 'lucide-react';
import usePWA from '../hooks/usePWA';
import { offlineManager } from '../utils/offlineManager';

export const PWASettings: React.FC = () => {
  const { 
    isPWA, 
    canInstall, 
    isOnline, 
    notificationPermission, 
    install, 
    requestNotifications,
    showNotification 
  } = usePWA();

  const [syncStatus, setSyncStatus] = React.useState(offlineManager.getSyncStatus());

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      showNotification('TaskTrack Instalado!', {
        body: 'O aplicativo foi instalado com sucesso e agora está disponível offline.'
      });
    }
  };

  const handleRequestNotifications = async () => {
    const granted = await requestNotifications();
    if (granted) {
      showNotification('Notificações Ativadas!', {
        body: 'Você receberá notificações sobre atualizações e lembretes.'
      });
    }
  };

  const handleTestNotification = () => {
    showNotification('Notificação de Teste', {
      body: 'Esta é uma notificação de teste do TaskTrack.',
      actions: [
        { action: 'view', title: 'Ver' },
        { action: 'close', title: 'Fechar' }
      ]
    });
  };

  const handleSyncNow = async () => {
    try {
      await offlineManager.processSyncQueue();
      setSyncStatus(offlineManager.getSyncStatus());
      showNotification('Sincronização Concluída', {
        body: 'Dados sincronizados com sucesso!'
      });
    } catch (error) {
      console.error('Erro na sincronização:', error);
    }
  };

  const handleClearOfflineData = () => {
    if (confirm('Tem certeza que deseja limpar todos os dados offline? Esta ação não pode ser desfeita.')) {
      offlineManager.clearOfflineData();
      setSyncStatus(offlineManager.getSyncStatus());
      showNotification('Dados Offline Limpos', {
        body: 'Todos os dados offline foram removidos.'
      });
    }
  };

  const getStatusColor = (status: boolean) => status ? 'text-green-600' : 'text-red-600';
  const getStatusText = (status: boolean) => status ? 'Ativo' : 'Inativo';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Smartphone className="mr-2 h-5 w-5" />
          Configurações PWA
        </h3>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Status do PWA */}
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-900 mb-3">Status do Aplicativo</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Modo PWA</span>
                <span className={`text-sm font-medium ${getStatusColor(isPWA)}`}>
                  {getStatusText(isPWA)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Conectividade</span>
                <span className={`text-sm font-medium ${getStatusColor(isOnline)}`}>
                  <Wifi className="inline h-4 w-4 mr-1" />
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Notificações</span>
                <span className={`text-sm font-medium ${getStatusColor(notificationPermission === 'granted')}`}>
                  {notificationPermission === 'granted' ? 'Permitidas' : 'Bloqueadas'}
                </span>
              </div>
            </div>
          </div>

          {/* Instalação */}
          {!isPWA && (
            <div className="border-b pb-4">
              <h4 className="font-medium text-gray-900 mb-3">Instalação</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Instale o TaskTrack como um aplicativo para acesso rápido e uso offline.
                  </p>
                </div>
                <button
                  onClick={handleInstall}
                  disabled={!canInstall}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Instalar App
                </button>
              </div>
            </div>
          )}

          {/* Notificações */}
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-900 mb-3">Notificações</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">
                    Receba notificações sobre atualizações e lembretes importantes.
                  </p>
                </div>
                <div className="flex space-x-2">
                  {notificationPermission !== 'granted' && (
                    <button
                      onClick={handleRequestNotifications}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Permitir
                    </button>
                  )}
                  {notificationPermission === 'granted' && (
                    <button
                      onClick={handleTestNotification}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Testar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sincronização Offline */}
          <div className="border-b pb-4">
            <h4 className="font-medium text-gray-900 mb-3">Dados Offline</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Itens na fila</div>
                  <div className="text-lg font-semibold">{syncStatus.queueLength}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Última sincronização</div>
                  <div className="text-sm font-medium">
                    {syncStatus.lastSync 
                      ? syncStatus.lastSync.toLocaleString('pt-BR')
                      : 'Nunca'
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleSyncNow}
                  disabled={!isOnline || syncStatus.queueLength === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sincronizar Agora
                </button>
                
                <button
                  onClick={handleClearOfflineData}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Limpar Dados
                </button>
              </div>
            </div>
          </div>

          {/* Informações */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Informações</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• O modo PWA permite uso offline com sincronização automática</p>
              <p>• Dados são salvos localmente e sincronizados quando online</p>
              <p>• Notificações ajudam a manter você atualizado</p>
              <p>• A instalação cria um atalho no dispositivo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWASettings;
