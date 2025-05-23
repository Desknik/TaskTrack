import React, { useState } from 'react';
import { TimeEntry } from '../types';
import { useAppContext } from '../context/AppContext';
import { Clock, Edit, Trash2, Calendar } from 'lucide-react';
import TimeEntryForm from './TimeEntryForm';
import { formatHoursToDisplay, formatHoursForTooltip } from '../utils/timeUtils';
import TagBadge from './TagBadge';

interface TimeEntryListProps {
  taskId: string;
}

const TimeEntryList: React.FC<TimeEntryListProps> = ({ taskId }) => {
  const { timeEntries, deleteTimeEntry } = useAppContext();
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);

  const taskTimeEntries = timeEntries.filter((entry) => entry.taskId === taskId);

  // Agrupar entradas por data
  const entriesByDate: Record<string, TimeEntry[]> = {};
  taskTimeEntries.forEach(entry => {
    if (!entriesByDate[entry.date]) {
      entriesByDate[entry.date] = [];
    }
    entriesByDate[entry.date].push(entry);
  });

  // Ordenar datas em ordem decrescente
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const totalHours = taskTimeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  
  // Função para calcular total de horas por dia
  const getHoursForDate = (date: string) => {
    return entriesByDate[date].reduce((sum, entry) => sum + entry.hours, 0);
  };

  // Corrigindo a função de formatação de data para evitar problemas com fuso horário
  const formatDate = (dateString: string) => {
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    const date = new Date(
      parseInt(parts[0]), 
      parseInt(parts[1]) - 1, 
      parseInt(parts[2])
    );
    
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString(undefined, options);
  };

  if (taskTimeEntries.length === 0 && !editingEntry) {
    return <p className="text-gray-500 italic">Nenhum registro de horas para esta tarefa.</p>;
  }

  return (
    <div className="space-y-4">
      {editingEntry ? (
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Editar Registro</h4>
          <TimeEntryForm
            taskId={taskId}
            timeEntry={editingEntry}
            isEditing={true}
            onComplete={() => setEditingEntry(null)}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-medium text-gray-700">Registros de Horas</h4>
              <span className="text-xs text-gray-500">
                ({taskTimeEntries.length} {taskTimeEntries.length === 1 ? 'registro' : 'registros'})
              </span>
            </div>
            <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-md">
              <Clock className="h-4 w-4 mr-1" />
              <span 
                className="text-sm font-medium"
                title={formatHoursForTooltip(totalHours)}
              >
                Total: {formatHoursToDisplay(totalHours)}
              </span>
            </div>
          </div>

          {sortedDates.map(date => (
            <div key={date} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center text-sm text-gray-700">
                  <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                  <span>{formatDate(date)}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({entriesByDate[date].length} {entriesByDate[date].length === 1 ? 'registro' : 'registros'})
                  </span>
                </div>
                <div 
                  className="text-sm font-medium text-blue-600"
                  title={formatHoursForTooltip(getHoursForDate(date))}
                >
                  {formatHoursToDisplay(getHoursForDate(date))}
                </div>
              </div>

              <div className="overflow-x-auto bg-gray-50 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Horas
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Tipo
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Descrição
                      </th>
                      <th scope="col" className="relative px-6 py-3 w-20">
                        <span className="sr-only">Ações</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {entriesByDate[date].map((entry) => (
                      <tr key={entry.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-32">
                          <span title={formatHoursForTooltip(entry.hours)}>
                            {formatHoursToDisplay(entry.hours)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-40">
                          {entry.type ? (
                            <TagBadge tag={entry.type} />
                          ) : (
                            <span className="italic text-gray-400">Não especificado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                          {entry.description || <span className="italic text-gray-400">Sem descrição</span>}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2 justify-end">
                            <button
                              onClick={() => setEditingEntry(entry)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteTimeEntry(entry.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default TimeEntryList;