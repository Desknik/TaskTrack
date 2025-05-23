import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TiptapEditor from './TiptapEditor';

interface ObservationFormProps {
  parentId: string;
  parentType: 'ticket' | 'task';
  onComplete: () => void;
}

const ObservationForm: React.FC<ObservationFormProps> = ({ 
  parentId, 
  parentType, 
  onComplete 
}) => {
  const { addObservation } = useAppContext();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    
    addObservation({
      parentId,
      parentType,
      content: content.trim(),
    });
    
    setContent('');
    setIsSubmitting(false);
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="observation-content" className="block text-sm font-medium text-gray-700">
          Conteúdo da Observação
        </label>
        <div className="mt-1">
          <TiptapEditor 
            content={content} 
            onChange={setContent} 
            placeholder="Descreva a observação..."
          />
        </div>
      </div>
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onComplete}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
        >
          Salvar
        </button>
      </div>
    </form>
  );
};

export default ObservationForm;