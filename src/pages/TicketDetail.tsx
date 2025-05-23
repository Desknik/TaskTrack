import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import ObservationList from "../components/ObservationList";
import ObservationForm from "../components/ObservationForm";
import { TicketStatus } from "../types";
import {
  Edit,
  Clock,
  Plus,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Trash2,
} from "lucide-react";
import {
  formatHoursForTooltip,
  formatHoursToDisplay,
} from "../utils/timeUtils";
import TagBadge from "../components/TagBadge";
import { TiptapContent } from "../components/TiptapEditor";

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tickets,
    tasks,
    updateTicketStatus,
    getTasksForTicket,
    getTotalHoursForTicket,
    deleteTicket,
  } = useAppContext();

  const [showObservationForm, setShowObservationForm] = useState(false);
  const [showObservations, setShowObservations] = useState(true);

  if (!id) {
    navigate("/tickets");
    return null;
  }

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">
          Chamado não encontrado
        </h2>
        <div className="mt-4">
          <Link
            to="/tickets"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voltar para lista de chamados
          </Link>
        </div>
      </div>
    );
  }

  const ticketTasks = getTasksForTicket(id);
  const totalHours = getTotalHoursForTicket(id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTicketStatus(id, e.target.value as TicketStatus);
  };

  const handleDeleteTicket = () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir este chamado? Esta ação também removerá as associações com tarefas e não pode ser desfeita."
      )
    ) {
      deleteTicket(id);
      navigate("/tickets");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate("/tickets")}
          className="mr-4 text-gray-500 hover:text-gray-700"
          title="Voltar para lista de chamados"
          aria-label="Voltar para lista de chamados"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">
          Detalhes do Chamado
        </h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {ticket.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Criado em {formatDate(ticket.createdAt)}
            </p>
            {ticket.tags && ticket.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {ticket.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>
          <div className="flex space-x-4">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                {ticket.priority}
              </span>
            </div>
            <Link
              to={`/tickets/${id}/edit`}
              className="inline-flex items-center text-blue-600 hover:text-blue-900"
            >
              <Edit className="h-5 w-5" />
              <span className="ml-1">Editar</span>
            </Link>
            <button
              onClick={handleDeleteTicket}
              className="inline-flex items-center text-red-600 hover:text-red-700"
              title="Excluir chamado"
            >
              <Trash2 className="h-5 w-5" />
              <span className="ml-1">Excluir</span>
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <select
                  value={ticket.status}
                  onChange={handleStatusChange}
                  className="block border p-2 w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                >
                  <option value="aberto">Aberto</option>
                  <option value="pendente">Pendente</option>
                  <option value="resolvido">Resolvido</option>
                  <option value="concluido">Concluído</option>
                </select>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Última atualização
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(ticket.updatedAt)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Descrição</dt>

              <div className="content-container my-2 flex-grow">
                <TiptapContent content={ticket.description} />
              </div>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">
                Total de Horas
              </dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-1" />
                <span title={formatHoursForTooltip(totalHours)}>
                  {formatHoursToDisplay(totalHours)}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Tarefas Associadas
          </h3>
          <Link
            to={`/tasks/new?ticketId=${id}`}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
          >
            <Plus className="h-4 w-4 mr-1" /> Nova Tarefa
          </Link>
        </div>
        <div className="border-t border-gray-200">
          {ticketTasks.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {ticketTasks.map((task) => (
                <li
                  key={task.id}
                  className="py-4 px-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  <Link to={`/tasks/${task.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          {task.title}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <StatusBadge status={task.status} type="task" />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Nenhuma tarefa associada a este chamado.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <button
            className="text-lg leading-6 font-medium text-gray-900 flex items-center"
            onClick={() => setShowObservations(!showObservations)}
          >
            Observações
            {showObservations ? (
              <ChevronUp className="ml-2 h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
            )}
          </button>
          <button
            onClick={() => setShowObservationForm(!showObservationForm)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
          >
            <MessageSquare className="h-4 w-4 mr-1" /> Nova Observação
          </button>
        </div>
        {showObservationForm && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <ObservationForm
              parentId={id}
              parentType="ticket"
              onComplete={() => setShowObservationForm(false)}
            />
          </div>
        )}
        {showObservations && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <ObservationList parentId={id} parentType="ticket" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketDetail;
