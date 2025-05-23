import React, { useState } from 'react';
import { TimeEntry } from '../types';
import { useAppContext } from '../context/AppContext';
import TagBadge from './TagBadge';
import { Tag, X } from 'lucide-react';

// Lista pré-definida de tipos comuns de atividades
const ACTIVITY_TYPES = [
  'Desenvolvimento',
  'Testes',
  'Documentação',
  'Reunião',
  'Análise',
  'Planejamento',
  'Prototipagem',
  'Levantamento',
  'Orçamento',
  'Suporte',
  'Treinamento'
];

interface TimeEntryFormProps {
  taskId: string;
  timeEntry?: TimeEntry;
  isEditing?: boolean;
  onComplete: () => void;
}

const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  taskId,
  timeEntry,
  isEditing = false,
  onComplete,
}) => {
  const { addTimeEntry, updateTimeEntry } = useAppContext();

  // Converter horas decimais para horas e minutos para inicialização
  const getInitialHoursAndMinutes = (decimalHours?: number) => {
    if (!decimalHours) return { hours: 0, minutes: 0 };
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return { hours, minutes };
  };

  const initialValues = getInitialHoursAndMinutes(timeEntry?.hours);
  
  const [hours, setHours] = useState(initialValues.hours.toString());
  const [minutes, setMinutes] = useState(initialValues.minutes.toString());
  const [date, setDate] = useState(timeEntry?.date || new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState(timeEntry?.description || '');
  const [type, setType] = useState(timeEntry?.type || '');
  const [customType, setCustomType] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Converter horas e minutos para formato decimal
    const hoursValue = parseInt(hours) || 0;
    const minutesValue = parseInt(minutes) || 0;
    const decimalHours = hoursValue + (minutesValue / 60);

    if (isEditing && timeEntry) {
      updateTimeEntry({
        ...timeEntry,
        hours: decimalHours,
        date,
        description,
        type,
      });
    } else {
      addTimeEntry({
        taskId,
        hours: decimalHours,
        date,
        description,
        type,
      });
    }

    onComplete();
  };

  const selectType = (selectedType: string) => {
    setType(selectedType);
    setShowTypeDropdown(false);
  };

  const handleAddCustomType = () => {
    if (customType.trim()) {
      setType(customType.trim());
      setCustomType('');
      setShowTypeDropdown(false);
    }
  };

  const clearType = () => {
    setType('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="time" className="block text-sm font-medium text-gray-700">
          Tempo Trabalhado
        </label>
        <div className="mt-1 flex space-x-2">
          <div className="flex-1">
            <label htmlFor="hours" className="block text-xs text-gray-500">
              Horas
            </label>
            <input
              type="number"
              name="hours"
              id="hours"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label htmlFor="minutes" className="block text-xs text-gray-500">
              Minutos
            </label>
            <input
              type="number"
              name="minutes"
              id="minutes"
              min="0"
              max="59"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
          Tipo de Atividade
        </label>
        <div className="mt-1 relative">
          <div className="flex">
            <button
              type="button"
              className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm shadow-sm flex justify-between items-center focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              onClick={() => setShowTypeDropdown(!showTypeDropdown)}
            >
              {type ? (
                <div className="flex items-center justify-between w-full">
                  <TagBadge tag={type} />
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      clearType();
                    }}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <span className="text-gray-500 flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  Selecione o tipo de atividade
                </span>
              )}
            </button>
          </div>
          
          {showTypeDropdown && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto max-h-60">
              <div className="px-3 py-2">
                <div className="flex rounded-md shadow-sm">
                  <input
                    type="text"
                    className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                    placeholder="Adicionar tipo personalizado"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomType();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomType}
                    className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
              <div className="pt-1 pb-2 px-2">
                <div className="text-xs font-medium text-gray-500 px-2 py-1">
                  Tipos comuns:
                </div>
                <div className="mt-1 flex flex-wrap gap-1 px-2">
                  {ACTIVITY_TYPES.map((activityType) => (
                    <button
                      key={activityType}
                      type="button"
                      onClick={() => selectType(activityType)}
                      className="inline-flex items-center px-0.5 py-0.5"
                    >
                      <TagBadge tag={activityType} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">
          Data
        </label>
        <input
          type="date"
          name="date"
          id="date"
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={onComplete}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? 'Atualizar' : 'Registrar'}
        </button>
      </div>
    </form>
  );
};

export default TimeEntryForm;