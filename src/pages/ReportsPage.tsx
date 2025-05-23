import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { TicketStatus, TaskStatus } from '../types';
import { BarChart3, PieChart, Filter, ArrowDownWideNarrow } from 'lucide-react';

const ReportsPage: React.FC = () => {
  const { 
    tickets, 
    tasks, 
    timeEntries,
    getTasksForTicket, 
    getUnassociatedTasks, 
    getTicketsWithNoTasks,
    getTotalHoursForTask,
    getTotalHoursForTicket
  } = useAppContext();

  const [selectedReport, setSelectedReport] = useState<'unassociated' | 'byStatus' | 'byHours'>('unassociated');
  
  const unassociatedTasks = getUnassociatedTasks();
  const ticketsWithNoTasks = getTicketsWithNoTasks();

  // Data for status reports
  const ticketsByStatus = {
    aberto: tickets.filter(t => t.status === 'aberto'),
    pendente: tickets.filter(t => t.status === 'pendente'),
    resolvido: tickets.filter(t => t.status === 'resolvido'),
    concluido: tickets.filter(t => t.status === 'concluido')
  };

  const tasksByStatus = {
    planejado: tasks.filter(t => t.status === 'planejado'),
    'em andamento': tasks.filter(t => t.status === 'em andamento'),
    'em analise': tasks.filter(t => t.status === 'em analise'),
    done: tasks.filter(t => t.status === 'done')
  };

  // Data for hours reports
  const ticketsWithHours = tickets.map(ticket => ({
    ...ticket,
    hours: getTotalHoursForTicket(ticket.id)
  })).sort((a, b) => b.hours - a.hours);

  const tasksWithHours = tasks.map(task => ({
    ...task,
    hours: getTotalHoursForTask(task.id)
  })).sort((a, b) => b.hours - a.hours);

  const totalHours = timeEntries.reduce((sum, entry) => sum + entry.hours, 0);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getTicketTitle = (ticketId?: string) => {
    if (!ticketId) return 'Sem chamado';
    const ticket = tickets.find((t) => t.id === ticketId);
    return ticket ? ticket.title : 'Chamado não encontrado';
  };

  const renderUnassociatedReport = () => (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Filter className="mr-2 h-5 w-5 text-blue-500" />
            Tarefas sem Chamados ({unassociatedTasks.length})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Tarefas que não estão associadas a nenhum chamado.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {unassociatedTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {unassociatedTasks.map((task) => (
                <li key={task.id} className="py-4 px-4 hover:bg-gray-50 transition-colors duration-150">
                  <Link to={`/tasks/${task.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{task.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(task.updatedAt)}</p>
                      </div>
                      <StatusBadge status={task.status} type="task" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Não há tarefas sem chamados.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <Filter className="mr-2 h-5 w-5 text-blue-500" />
            Chamados sem Tarefas ({ticketsWithNoTasks.length})
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Chamados que não têm nenhuma tarefa associada.
          </p>
        </div>
        <div className="border-t border-gray-200">
          {ticketsWithNoTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {ticketsWithNoTasks.map((ticket) => (
                <li key={ticket.id} className="py-4 px-4 hover:bg-gray-50 transition-colors duration-150">
                  <Link to={`/tickets/${ticket.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{ticket.title}</p>
                        <p className="text-sm text-gray-500 mt-1">{formatDate(ticket.updatedAt)}</p>
                      </div>
                      <div className="flex items-center">
                        <StatusBadge status={ticket.status} type="ticket" />
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Não há chamados sem tarefas.
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderStatusReport = () => (
    <>
      <div className="grid grid-cols-1 gap-6 mt-6 lg:grid-cols-2">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-blue-500" />
              Chamados por Status
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {Object.entries(ticketsByStatus).map(([status, statusTickets]) => (
              <div key={status} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <StatusBadge status={status as TicketStatus} type="ticket" />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {statusTickets.length} chamados
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {tickets.length > 0 ? Math.round((statusTickets.length / tickets.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`bg-sky-500 h-2.5 rounded-full`} 
                    style={{ width: `${tickets.length > 0 ? (statusTickets.length / tickets.length) * 100 : 0}%` }}
                  ></div>
                </div>
                
                {statusTickets.length > 0 && (
                  <div className="mt-2 ml-4">
                    <ul className="divide-y divide-gray-200 border rounded-md">
                      {statusTickets.map((ticket) => (
                        <li key={ticket.id} className="py-2 px-3 text-sm hover:bg-gray-50">
                          <Link to={`/tickets/${ticket.id}`} className="hover:text-blue-600">
                            {ticket.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <PieChart className="mr-2 h-5 w-5 text-green-500" />
              Tarefas por Status
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <div key={status} className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <StatusBadge status={status as TaskStatus} type="task" />
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      {statusTasks.length} tarefas
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {tasks.length > 0 ? Math.round((statusTasks.length / tasks.length) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`bg-green-400 h-2.5 rounded-full`} 
                    style={{ width: `${tasks.length > 0 ? (statusTasks.length / tasks.length) * 100 : 0}%` }}
                  ></div>
                </div>
                
                {statusTasks.length > 0 && (
                  <div className="mt-2 ml-4">
                    <ul className="divide-y divide-gray-200 border rounded-md">
                      {statusTasks.map((task) => (
                        <li key={task.id} className="py-2 px-3 text-sm hover:bg-gray-50">
                          <Link to={`/tasks/${task.id}`} className="hover:text-blue-600">
                            {task.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  const renderHoursReport = () => (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-blue-500" />
            Horas Trabalhadas por Chamado
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Total de {totalHours.toFixed(1)} horas registradas
          </p>
        </div>
        <div className="border-t border-gray-200">
          {ticketsWithHours.length > 0 ? (
            <div className="px-4 py-5 sm:px-6">
              {ticketsWithHours.map((ticket) => (
                <div key={ticket.id} className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Link to={`/tickets/${ticket.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                        {ticket.title}
                      </Link>
                      <StatusBadge status={ticket.status} type="ticket" className="ml-2" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {ticket.hours.toFixed(1)}h
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-violet-500 h-2.5 rounded-full" 
                      style={{ width: `${totalHours > 0 ? (ticket.hours / totalHours) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Não há horas registradas para chamados.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mt-6">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-green-500" />
            Horas Trabalhadas por Tarefa
          </h3>
        </div>
        <div className="border-t border-gray-200">
          {tasksWithHours.filter(t => t.hours > 0).length > 0 ? (
            <div className="px-4 py-5 sm:px-6">
              {tasksWithHours
                .filter(t => t.hours > 0)
                .map((task) => (
                  <div key={task.id} className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Link to={`/tasks/${task.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                            {task.title}
                          </Link>
                          <StatusBadge status={task.status} type="task" className="ml-2" />
                        </div>
                        {task.ticketId && (
                          <div className="text-xs text-gray-500 mt-0.5">
                            Chamado: {getTicketTitle(task.ticketId)}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700 ml-2">
                        {task.hours.toFixed(1)}h
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${totalHours > 0 ? (task.hours / totalHours) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Não há horas registradas para tarefas.
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedReport('unassociated')}
            className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
              selectedReport === 'unassociated'
                ? 'bg-blue-600 text-white border-transparent'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="h-4 w-4 mr-1" />
            Não Associados
          </button>
          <button
            onClick={() => setSelectedReport('byStatus')}
            className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
              selectedReport === 'byStatus'
                ? 'bg-blue-600 text-white border-transparent'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <PieChart className="h-4 w-4 mr-1" />
            Por Status
          </button>
          <button
            onClick={() => setSelectedReport('byHours')}
            className={`inline-flex items-center px-3 py-2 border text-sm font-medium rounded-md ${
              selectedReport === 'byHours'
                ? 'bg-blue-600 text-white border-transparent'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            Por Horas
          </button>
        </div>
      </div>

      {selectedReport === 'unassociated' && renderUnassociatedReport()}
      {selectedReport === 'byStatus' && renderStatusReport()}
      {selectedReport === 'byHours' && renderHoursReport()}
    </div>
  );
};

export default ReportsPage;