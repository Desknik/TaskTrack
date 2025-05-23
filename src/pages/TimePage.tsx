import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { Clock, Calendar, Search, Tag, ClipboardList } from 'lucide-react';
import { formatHoursToDisplay, formatHoursForTooltip } from '../utils/timeUtils';
import TagBadge from '../components/TagBadge';

const TimePage: React.FC = () => {
  const { timeEntries, tasks, tickets, getTotalHoursForTask } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [isTagFilterMenuOpen, setIsTagFilterMenuOpen] = useState(false);

  // Extrair tags das tarefas e tipos de atividade dos registros de tempo
  const taskIds = [...new Set(timeEntries.map(entry => entry.taskId))];
  const relatedTasks = tasks.filter(task => taskIds.includes(task.id));

  // Coletar tags das tarefas
  const taskTags = new Set(relatedTasks.flatMap(task => task.tags || []).filter(Boolean));

  // Coletar tipos de atividades das entradas
  const activityTypes = new Set(timeEntries.map(entry => entry.type).filter(Boolean));

  // Combinar ambos para o filtro
  const allFilters = [...taskTags, ...activityTypes].sort();

  const getTaskTitle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task ? task.title : 'Tarefa não encontrada';
  };

  const getTaskTags = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    return task?.tags || [];
  };

  const getTicketForTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.ticketId) return null;
    return tickets.find(t => t.id === task.ticketId);
  };

  const filteredEntries = timeEntries.filter(entry => {
    const task = tasks.find(t => t.id === entry.taskId);
    const taskTags = task?.tags || [];
    
    const matchesSearch = 
      getTaskTitle(entry.taskId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !dateFilter || entry.date === dateFilter;
    // Verifique se a tag está nas tags da tarefa OU no tipo da entrada
    const matchesTag = !tagFilter || taskTags.includes(tagFilter) || entry.type === tagFilter;
    
    return matchesSearch && matchesDate && matchesTag;
  });

  // Group entries by date
  const entriesByDate: Record<string, typeof timeEntries> = {};
  
  filteredEntries.forEach(entry => {
    if (!entriesByDate[entry.date]) {
      entriesByDate[entry.date] = [];
    }
    entriesByDate[entry.date].push(entry);
  });

  // Sort dates in descending order
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const totalHours = filteredEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const totalEntriesCount = filteredEntries.length;
  const uniqueTasksCount = [...new Set(filteredEntries.map(entry => entry.taskId))].length;

  const formatDate = (dateString: string) => {
    // Adicionando 'T00:00:00' para garantir que a data seja tratada como local, não UTC
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    
    // Criar a data usando componentes individuais (ano, mês, dia)
    // Mês é baseado em zero no JavaScript (janeiro = 0)
    const date = new Date(
      parseInt(parts[0]), 
      parseInt(parts[1]) - 1, 
      parseInt(parts[2])
    );
    
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Registro de Horas</h1>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Horas</dt>
                  <dd>
                    <div 
                      className="text-lg font-medium text-gray-900"
                      title={formatHoursForTooltip(totalHours)}
                    >
                      {formatHoursToDisplay(totalHours)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardList className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Registros</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {totalEntriesCount} {totalEntriesCount === 1 ? 'registro' : 'registros'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Tarefas Trabalhadas</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {uniqueTasksCount} {uniqueTasksCount === 1 ? 'tarefa' : 'tarefas'}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                placeholder="Buscar por tarefa ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              {allFilters.length > 0 && (
                <div className="relative inline-block text-left">
                  <div>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      id="tag-filter-menu"
                      onClick={() => setIsTagFilterMenuOpen(!isTagFilterMenuOpen)}
                    >
                      <Tag className="h-5 w-5 mr-2 text-gray-500" />
                      {tagFilter || 'Filtrar por tag ou tipo'}
                    </button>
                  </div>
                  {isTagFilterMenuOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="tag-filter-menu">
                        <button
                          className={`block px-4 py-2 text-sm w-full text-left ${!tagFilter ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                          onClick={() => {
                            setTagFilter('');
                            setIsTagFilterMenuOpen(false);
                          }}
                        >
                          Todas as tags e tipos
                        </button>
                        {allFilters.map(filter => (
                          <button
                            key={filter}
                            className={`block px-4 py-2 text-sm w-full text-left ${tagFilter === filter ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                            onClick={() => {
                              setTagFilter(filter);
                              setIsTagFilterMenuOpen(false);
                            }}
                          >
                            <div className="flex items-center">
                              <TagBadge tag={filter} />
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
              {dateFilter && (
                <button
                  className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={() => setDateFilter('')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 101.414 1.414L10 11.414l1.293 1.293a1 1 001.414-1.414L11.414 10l1.293-1.293a1 1 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {sortedDates.length > 0 ? (
            <div className="space-y-8">
              {sortedDates.map(date => {
                const dateEntries = entriesByDate[date];
                const hoursForDate = dateEntries.reduce((sum, entry) => sum + entry.hours, 0);
                
                return (
                  <div key={date}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{formatDate(date)}</h3>
                      <div className="flex items-center text-sm">
                        <div 
                          className="font-medium text-blue-600 mr-2"
                          title={formatHoursForTooltip(hoursForDate)}
                        >
                          {formatHoursToDisplay(hoursForDate)}
                        </div>
                        <div className="text-gray-500">
                          ({dateEntries.length} {dateEntries.length === 1 ? 'registro' : 'registros'})
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <ul className="divide-y divide-gray-200">
                        {dateEntries.map(entry => {
                          const task = tasks.find(t => t.id === entry.taskId);
                          const ticket = task?.ticketId ? tickets.find(t => t.id === task.ticketId) : null;
                          const taskTags = task?.tags || [];
                          
                          return (
                            <li key={entry.id} className="p-4 hover:bg-gray-50">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <Link 
                                      to={`/tasks/${entry.taskId}`} 
                                      className="text-blue-600 hover:text-blue-900 font-medium"
                                    >
                                      {getTaskTitle(entry.taskId)}
                                    </Link>
                                    <span 
                                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                      title={formatHoursForTooltip(entry.hours)}
                                    >
                                      {formatHoursToDisplay(entry.hours)}
                                    </span>
                                    {entry.type && (
                                      <TagBadge tag={entry.type} />
                                    )}
                                    {taskTags.map(tag => (
                                      <TagBadge key={tag} tag={tag} />
                                    ))}
                                  </div>
                                  
                                  {ticket && (
                                    <div className="mt-1">
                                      <Link 
                                        to={`/tickets/${ticket.id}`}
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                      >
                                        Chamado: {ticket.title}
                                      </Link>
                                    </div>
                                  )}
                                  
                                  {entry.description && (
                                    <p className="mt-1 text-sm text-gray-500">
                                      {entry.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              Nenhum registro de horas encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimePage;