import React, { useState, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Download, Upload, AlertTriangle, CheckCircle2, Trash2 } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { exportData, importData, clearAllData } = useAppContext();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para exportar dados
  const handleExportData = () => {
    const jsonString = exportData();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasktrack_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Função para iniciar o processo de importação
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Função para processar o arquivo importado
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const success = importData(content);
        if (success) {
          setImportStatus('success');
          setStatusMessage('Dados importados com sucesso!');
        } else {
          setImportStatus('error');
          setStatusMessage('Formato de arquivo inválido. Verifique se o arquivo é um backup válido do TaskTrack.');
        }
      } catch (error) {
        setImportStatus('error');
        setStatusMessage('Erro ao importar dados. Verifique o formato do arquivo.');
        console.error('Erro ao importar:', error);
      }
    };
    reader.readAsText(file);
  };

  // Função para limpar todos os dados
  const handleClearAllData = () => {
    if (window.confirm('ATENÇÃO: Esta ação irá excluir TODOS os dados da aplicação (chamados, tarefas, observações e registros de tempo). Esta ação não pode ser desfeita. Deseja continuar?')) {
      if (window.confirm('Tem certeza? Esta é a última chance de desistir. Todos os dados serão perdidos permanentemente.')) {
        clearAllData();
        setImportStatus('success');
        setStatusMessage('Todos os dados foram excluídos com sucesso.');
      }
    }
  };

  // Reset do status após 5 segundos
  React.useEffect(() => {
    if (importStatus !== 'idle') {
      const timer = setTimeout(() => {
        setImportStatus('idle');
        setStatusMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [importStatus]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Backup e Restauração</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Exporte seus dados para fazer backup ou restaure a partir de um arquivo de backup.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-2">Exportar Dados</h4>
              <p className="text-sm text-gray-500 mb-4">
                Baixe um arquivo JSON contendo todos os seus dados (chamados, tarefas, observações e registros de tempo).
              </p>
              <button
                onClick={handleExportData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar Dados
              </button>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-base font-medium text-gray-900 mb-2">Importar Dados</h4>
              <p className="text-sm text-gray-500 mb-4">
                Restaure seus dados a partir de um arquivo de backup. <strong>Atenção:</strong> Isso substituirá todos os dados atuais.
              </p>
              <input
                placeholder="Selecione um arquivo JSON"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={handleImportClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Upload className="h-4 w-4 mr-2" />
                Importar Dados
              </button>
              
              {importStatus !== 'idle' && (
                <div className={`mt-3 flex items-center p-2 rounded-md text-sm ${
                  importStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {importStatus === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mr-2" />
                  )}
                  {statusMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Operações Perigosas</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Opções que podem resultar em perda de dados irreversível. Use com cautela.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="text-base font-medium text-red-800 mb-2">Limpar todos os dados</h4>
            <p className="text-sm text-red-700 mb-4">
              Esta ação irá remover <strong>todos</strong> os dados da aplicação, incluindo chamados, tarefas, observações e registros de tempo. Esta ação não pode ser desfeita.
            </p>
            <button
              onClick={handleClearAllData}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Todos os Dados
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Sobre o TaskTrack</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Sistema de gerenciamento de chamados e tarefas
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-sm text-gray-500">
            TaskTrack é uma aplicação para gerenciamento de chamados, tarefas e controle de tempo.
            Todos os dados são armazenados localmente no seu navegador.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Versão: 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
