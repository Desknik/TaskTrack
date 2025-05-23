import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, X, Check } from 'lucide-react';
import TiptapEditor, { TiptapContent } from './TiptapEditor';

interface ObservationListProps {
  parentId: string;
  parentType: 'ticket' | 'task';
}

const ObservationList: React.FC<ObservationListProps> = ({ parentId, parentType }) => {
  const { observations, deleteObservation, updateObservation } = useAppContext();
  const [editingObservationId, setEditingObservationId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  // Filtrar observações relacionadas a este item (ticket ou task)
  const relevantObservations = observations.filter(
    (obs) => obs.parentId === parentId && obs.parentType === parentType
  );

  if (relevantObservations.length === 0) {
    return (
      <div className="text-gray-500 italic text-sm">
        Nenhuma observação registrada.
      </div>
    );
  }

  // Ordenar por data de criação (mais recente primeiro)
  const sortedObservations = [...relevantObservations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleEditClick = (observation: any) => {
    setEditingObservationId(observation.id);
    setEditContent(observation.content);
  };

  const handleCancelEdit = () => {
    setEditingObservationId(null);
    setEditContent('');
  };

  const handleSaveEdit = (observationId: string) => {
    if (editContent.trim()) {
      updateObservation(observationId, editContent);
      setEditingObservationId(null);
      setEditContent('');
    }
  };

  const handleDeleteClick = (observationId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta observação?')) {
      try {
        deleteObservation(observationId);
      } catch (error) {
        console.error("Erro ao excluir observação:", error);
      }
    } 
  };

  return (
    <div className="space-y-4">
      {sortedObservations.map((observation) => (
        <div key={observation.id} className="bg-gray-50 p-4 rounded-md observation-item border border-gray-200">
          {editingObservationId === observation.id ? (
            <div className="space-y-3">
              <TiptapEditor
                content={editContent}
                onChange={setEditContent}
                placeholder="Edite sua observação..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <X size={16} className="mr-1" /> Cancelar
                </button>
                <button
                  onClick={() => handleSaveEdit(observation.id)}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  disabled={!editContent.trim()}
                >
                  <Check size={16} className="mr-1" /> Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <div className="content-container my-2 flex-grow">
                <TiptapContent content={observation.content} />
              </div>
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto text-xs text-gray-500 mt-1">
                <span className="mr-2 sm:mr-0">{formatDistanceToNow(new Date(observation.createdAt), { locale: ptBR })}</span>
                
                <div className="flex space-x-2 mt-1">
                  <button
                    onClick={() => handleEditClick(observation)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Editar observação"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(observation.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                    title="Excluir observação"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ObservationList;