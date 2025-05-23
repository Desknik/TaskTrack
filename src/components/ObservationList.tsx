import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, X, Check } from 'lucide-react';

interface ObservationListProps {
  parentId: string;
  parentType: 'ticket' | 'task';
}

const ObservationList: React.FC<ObservationListProps> = ({ parentId, parentType }) => {
  const { observations, deleteObservation } = useAppContext();
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

  const handleSaveEdit = () => {
    // Implementar lógica para salvar edição
    setEditingObservationId(null);
    setEditContent('');
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
        <div key={observation.id} className="bg-gray-50 p-4 rounded-md observation-item">
          {editingObservationId === observation.id ? (
            <div className="space-y-3">
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 edit-textarea"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancelEdit}
                  className="inline-flex items-center px-2 py-1 border border-gray-300 text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <X size={16} className="mr-1" /> Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  disabled={!editContent.trim()}
                >
                  <Check size={16} className="mr-1" /> Salvar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-start">
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {observation.content}
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(observation.createdAt), { 
                    addSuffix: true,
                    locale: ptBR
                  })}
                </div>
                <div className="observation-actions flex space-x-2">
                  <button
                    onClick={() => handleEditClick(observation)}
                    className="text-gray-400 hover:text-blue-500"
                    title="Editar"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(observation.id)}
                    className="text-gray-400 hover:text-red-500"
                    title="Excluir"
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