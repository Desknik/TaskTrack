import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, X, Info } from 'lucide-react';

interface UpdateBannerProps {
  onUpdate: () => void;
  onDismiss: () => void;
  updateAvailable: boolean;
  updateSize?: string;
  changelogUrl?: string;
}

export const UpdateBanner: React.FC<UpdateBannerProps> = ({
  onUpdate,
  onDismiss,
  updateAvailable,
  updateSize,
  changelogUrl
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setIsVisible(true);
    }
  }, [updateAvailable]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onUpdate();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {isUpdating ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Download className="h-5 w-5" />
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-medium">
                {isUpdating ? 'Atualizando...' : 'Nova versão disponível!'}
              </h4>
              <p className="text-sm opacity-90">
                {isUpdating
                  ? 'Aplicando atualização, aguarde...'
                  : `Uma nova versão do TaskTrack está pronta para uso${updateSize ? ` (${updateSize})` : ''}.`
                }
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {changelogUrl && !isUpdating && (
              <a
                href={changelogUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-100 hover:text-white text-sm flex items-center space-x-1"
              >
                <Info className="h-4 w-4" />
                <span>Ver mudanças</span>
              </a>
            )}
            
            {!isUpdating && (
              <>
                <button
                  onClick={handleUpdate}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 flex items-center space-x-1"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Atualizar</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="text-blue-100 hover:text-white p-1"
                  title="Dispensar (atualizar depois)"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {isUpdating && (
          <div className="mt-2">
            <div className="w-full bg-blue-500 rounded-full h-2">
              <div className="bg-white h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateBanner;
