import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TaskStatus } from '../types';
import StatusBadge from './StatusBadge';
import TagBadge from './TagBadge';
import { useAppContext } from '../context/AppContext';
import { Search, Filter, Clock, Tag, SortAsc, ArrowDownUp, SortDesc } from 'lucide-react';
import { formatHoursToDisplay, formatHoursForTooltip } from '../utils/timeUtils';

type SortOption = 'newest' | 'oldest' | 'recently-updated' | 'least-recently-updated';

const TaskList: React.FC = () => {
  const { tasks, tickets, getTotalHoursForTask } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [tagFilter, setTagFilter] = useState('');
  const [showUnassociated, setShowUnassociated] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isTagFilterMenuOpen, setIsTagFilterMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  const getTicketTitle = (ticketId?: string) => {
    if (!ticketId) return 'Sem chamado';
    const ticket = tickets.find((t) => t.id === ticketId);
    return ticket ? ticket.title : 'Chamado não encontrado';
  };

  // Extract all unique tags from tasks
  const allTags = Array.from(
    new Set(tasks.flatMap(task => task.tags || []))
  ).sort();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesTag = !tagFilter || (task.tags && task.tags.includes(tagFilter));
    const matchesUnassociated = !showUnassociated || !task.ticketId;
    
    return matchesSearch && matchesStatus && matchesTag && matchesUnassociated;
  });

  const getSortedTasks = () => {
    return [...filteredTasks].sort((a, b) => {
      if (sortOption === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOption === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOption === 'recently-updated') {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      } else if (sortOption === 'least-recently-updated') {
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      return 0;
    });
  };

  const sortedTasks = getSortedTasks();

  const getSortButtonText = () => {
    switch (sortOption) {
      case 'newest': return 'Mais recentes primeiro';
      case 'oldest': return 'Mais antigas primeiro';
      case 'recently-updated': return 'Atualizadas recentemente';
      case 'least-recently-updated': return 'Atualizadas há mais tempo';
      default: return 'Ordenar por';
    }
  };

  const getSortIcon = () => {
    if (sortOption === 'newest' || sortOption === 'recently-updated') {
      return <SortDesc className="h-5 w-5 mr-2 text-gray-500" />;
    } else {
      return <SortAsc className="h-5 w-5 mr-2 text-gray-500" />;
    }
  };

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
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md"
              placeholder="Buscar tarefas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* Sort dropdown */}
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="sort-menu"
                  onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                >
                  {getSortIcon()}
                  {getSortButtonText()}
                </button>
              </div>
              {isSortMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="sort-menu">
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'newest' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortOption('newest');
                        setIsSortMenuOpen(false);
                      }}
                    >
                      <SortDesc className="h-4 w-4 inline mr-2" />
                      Mais recentes primeiro
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'oldest' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortOption('oldest');
                        setIsSortMenuOpen(false);
                      }}
                    >
                      <SortAsc className="h-4 w-4 inline mr-2" />
                      Mais antigas primeiro
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'recently-updated' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortOption('recently-updated');
                        setIsSortMenuOpen(false);
                      }}
                    >
                      <SortDesc className="h-4 w-4 inline mr-2" />
                      Atualizadas recentemente
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortOption === 'least-recently-updated' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortOption('least-recently-updated');
                        setIsSortMenuOpen(false);
                      }}
                    >
                      <SortAsc className="h-4 w-4 inline mr-2" />
                      Atualizadas há mais tempo
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  id="filter-menu"
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                >
                  <Filter className="h-5 w-5 mr-2 text-gray-500" />
                  {statusFilter === 'all' ? 'Todos os status' : statusFilter}
                </button>
              </div>
              {isFilterMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="filter-menu">
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setStatusFilter('all');
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      Todos os status
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === 'planejado' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setStatusFilter('planejado');
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      Planejado
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === 'em andamento' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setStatusFilter('em andamento');
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      Em andamento
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === 'em analise' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setStatusFilter('em analise');
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      Em análise
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${statusFilter === 'done' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                      onClick={() => {
                        setStatusFilter('done');
                        setIsFilterMenuOpen(false);
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            {allTags.length > 0 && (
              <div className="relative inline-block text-left">
                <div>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="tag-filter-menu"
                    onClick={() => setIsTagFilterMenuOpen(!isTagFilterMenuOpen)}
                  >
                    <Tag className="h-5 w-5 mr-2 text-gray-500" />
                    {tagFilter || 'Filtrar por tag'}
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
                        Todas as tags
                      </button>
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          className={`block px-4 py-2 text-sm w-full text-left ${tagFilter === tag ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                          onClick={() => {
                            setTagFilter(tag);
                            setIsTagFilterMenuOpen(false);
                          }}
                        >
                          <div className="flex items-center">
                            <TagBadge tag={tag} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600"
                checked={showUnassociated}
                onChange={(e) => setShowUnassociated(e.target.checked)}
              />
              <span className="ml-2 text-gray-700">Sem chamado</span>
            </label>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <Link
            to="/tasks/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Nova Tarefa
          </Link>
          
          <div className="text-sm text-gray-500">
            <span className="font-semibold">{sortedTasks.length}</span> 
            {sortedTasks.length === 1 ? ' tarefa encontrada' : ' tarefas encontradas'}
            {sortedTasks.length !== tasks.length && (
              <span> (de {tasks.length} total)</span>
            )}
          </div>
        </div>

        <div className="mt-6">
          <ul className="divide-y divide-gray-200">
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <li key={task.id} className="py-4 transition duration-150 ease-in-out hover:bg-gray-50">
                  <Link to={`/tasks/${task.id}`} className="block">
                    <div className="flex items-center px-4 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-blue-600 truncate">{task.title}</p>
                            {task.tags && task.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {task.tags.map(tag => (
                                  <TagBadge key={tag} tag={tag} />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <StatusBadge status={task.status} type="task" />
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center">
                              {task.ticketId ? (
                                <Link to={`/tickets/${task.ticketId}`} className="
                                 text-gray-500 hover:text-gray-700">
                                  {getTicketTitle(task.ticketId)}
                                </Link>
                              ) : (
                                <span className="text-yellow-600">Sem chamado</span>
                              )}
                            </p>
                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              <span title={formatHoursForTooltip(getTotalHoursForTask(task.id))}>
                                {formatHoursToDisplay(getTotalHoursForTask(task.id))}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="py-4">
                <div className="text-center text-gray-500">
                  Nenhuma tarefa encontrada.
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TaskList;