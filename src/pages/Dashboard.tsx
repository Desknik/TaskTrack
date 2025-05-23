import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { TicketStatus, TaskStatus } from '../types';
import { 
  Ticket, 
  ListTodo, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  HourglassIcon, 
  BarChart4 
} from 'lucide-react';
import { formatHoursToDisplay, formatHoursForTooltip } from '../utils/timeUtils';

const Dashboard: React.FC = () => {
  const { 
    tickets, 
    tasks,
    timeEntries,
    getTasksForTicket, 
    getUnassociatedTasks, 
    getTicketsWithNoTasks 
  } = useAppContext();

  // Calculate statistics
  const ticketsByStatus = {
    aberto: tickets.filter(t => t.status === 'aberto').length,
    pendente: tickets.filter(t => t.status === 'pendente').length,
    resolvido: tickets.filter(t => t.status === 'resolvido').length,
    concluido: tickets.filter(t => t.status === 'concluido').length
  };

  const tasksByStatus = {
    planejado: tasks.filter(t => t.status === 'planejado').length,
    'em andamento': tasks.filter(t => t.status === 'em andamento').length,
    'em analise': tasks.filter(t => t.status === 'em analise').length,
    finalizado: tasks.filter(t => t.status === 'finalizado').length
  };

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const unassociatedTasksCount = getUnassociatedTasks().length;
  const ticketsWithNoTasksCount = getTicketsWithNoTasks().length;

  // Get recent tickets and tasks
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

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

  // Helper function to get color class for ticket status chart
  const getTicketStatusColor = (status: TicketStatus): string => {
    switch (status) {
      case 'aberto': return 'bg-blue-500';
      case 'pendente': return 'bg-yellow-500';
      case 'resolvido': return 'bg-green-500';
      case 'concluido': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Helper function to get color class for task status chart
  const getTaskStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'planejado': return 'bg-indigo-500';
      case 'em andamento': return 'bg-orange-500';
      case 'em analise': return 'bg-cyan-500';
      case 'finalizado': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Link
            to="/tickets/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Novo Chamado
          </Link>
          <Link
            to="/tasks/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Nova Tarefa
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Ticket className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Chamados</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{tickets.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/tickets" className="font-medium text-blue-600 hover:text-blue-900">
                Ver todos
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ListTodo className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total de Tarefas</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{tasks.length}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/tasks" className="font-medium text-green-600 hover:text-green-900">
                Ver todas
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-purple-600" />
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
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/time" className="font-medium text-purple-600 hover:text-purple-900">
                Ver detalhes
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Atenção Necessária</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {unassociatedTasksCount} tarefa(s) sem chamado
                    </div>
                    <div className="text-sm text-gray-500">
                      {ticketsWithNoTasksCount} chamado(s) sem tarefa
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/reports" className="font-medium text-yellow-600 hover:text-yellow-900">
                Ver relatório
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Status Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <BarChart4 className="h-5 w-5 mr-2 text-blue-500" />
              Status dos Chamados
            </h3>
            <div className="mt-4">
              <div className="space-y-2">
                {Object.entries(ticketsByStatus).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">
                        <StatusBadge status={status as TicketStatus} type="ticket" />
                        <span className="ml-2">{count}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0}%
                      </div>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${getTicketStatusColor(status as TicketStatus)} h-2.5 rounded-full`} 
                        style={{ width: `${tickets.length > 0 ? (count / tickets.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <BarChart4 className="h-5 w-5 mr-2 text-green-500" />
              Status das Tarefas
            </h3>
            <div className="mt-4">
              <div className="space-y-2">
                {Object.entries(tasksByStatus).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium text-gray-700">
                        <StatusBadge status={status as TaskStatus} type="task" />
                        <span className="ml-2">{count}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0}%
                      </div>
                    </div>
                    <div className="mt-1 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${getTaskStatusColor(status as TaskStatus)} h-2.5 rounded-full`} 
                        style={{ width: `${tasks.length > 0 ? (count / tasks.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Chamados Recentes</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentTickets.length > 0 ? (
                recentTickets.map((ticket) => (
                  <li key={ticket.id} className="py-4 px-4 transition duration-150 ease-in-out hover:bg-gray-50">
                    <Link to={`/tickets/${ticket.id}`} className="block">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-blue-600 truncate">{ticket.title}</p>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <StatusBadge status={ticket.status} type="ticket" />
                              <span className="ml-2">
                                {getTasksForTicket(ticket.id).length} tarefas
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">{formatDate(ticket.updatedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="py-4 px-4">
                  <div className="text-center text-gray-500">
                    Nenhum chamado registrado.
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Tarefas Recentes</h3>
          </div>
          <div className="border-t border-gray-200">
            <ul className="divide-y divide-gray-200">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <li key={task.id} className="py-4 px-4 transition duration-150 ease-in-out hover:bg-gray-50">
                    <Link to={`/tasks/${task.id}`} className="block">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-blue-600 truncate">{task.title}</p>
                          <div className="mt-2 flex">
                            <div className="flex items-center text-sm text-gray-500">
                              <StatusBadge status={task.status} type="task" />
                              {task.ticketId ? (
                                <Link to={`/tickets/${task.ticketId}`} className="ml-2 text-blue-500 hover:text-blue-700 truncate">
                                  {tickets.find(t => t.id === task.ticketId)?.title || 'Chamado'}
                                </Link>
                              ) : (
                                <span className="ml-2 text-yellow-600">Sem chamado</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">{formatDate(task.updatedAt)}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="py-4 px-4">
                  <div className="text-center text-gray-500">
                    Nenhuma tarefa registrada.
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;