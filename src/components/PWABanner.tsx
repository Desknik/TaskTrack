import React, { useState, useEffect } from 'react';
import { Download, Wifi, WifiOff, Smartphone } from 'lucide-react';
import { PWAUtils } from '../utils/pwaUtils';

export const PWABanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isPWA, setIsPWA] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Verificar se é PWA
    setIsPWA(PWAUtils.isPWA());

    // Verificar se pode instalar
    const checkInstallPrompt = () => {
      setCanInstall(!!PWAUtils.installPrompt);
      setShowBanner(!PWAUtils.isPWA() && !!PWAUtils.installPrompt);
    };

    // Listener para mudanças de conectividade
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    // Listener para prompt de instalação
    const handleBeforeInstallPrompt = () => {
      checkInstallPrompt();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check inicial
    checkInstallPrompt();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    const installed = await PWAUtils.showInstallPrompt();
    if (installed) {
      setShowBanner(false);
      setCanInstall(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    // Guardar preferência para não mostrar novamente
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  // Não mostrar se foi dispensado anteriormente
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed && showBanner) {
      setShowBanner(false);
    }
  }, [showBanner]);

  return (
    <>
      {/* Banner de Instalação PWA */}
      {showBanner && canInstall && (
        <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Smartphone className="h-5 w-5" />
            <div>
              <p className="font-medium">Instalar TaskTrack</p>
              <p className="text-sm opacity-90">
                Acesse rapidamente e use offline
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstall}
              className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Instalar</span>
            </button>
            <button
              onClick={handleDismiss}
              className="text-white hover:text-gray-200 px-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Status de Conectividade */}
      {!isOnline && (
        <div className="bg-orange-500 text-white p-2 text-center flex items-center justify-center space-x-2">
          <WifiOff className="h-4 w-4" />
          <span className="text-sm">
            Você está offline. Algumas funcionalidades podem estar limitadas.
          </span>
        </div>
      )}

      {/* Indicador PWA */}
      {isPWA && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-green-600 text-white px-3 py-2 rounded-full flex items-center space-x-2 shadow-lg">
            <Smartphone className="h-4 w-4" />
            <span className="text-sm font-medium">App Mode</span>
            {isOnline ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PWABanner;
