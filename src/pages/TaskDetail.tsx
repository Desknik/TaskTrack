import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import StatusBadge from "../components/StatusBadge";
import ObservationList from "../components/ObservationList";
import ObservationForm from "../components/ObservationForm";
import TimeEntryList from "../components/TimeEntryList";
import TimeEntryForm from "../components/TimeEntryForm";
import TagBadge from "../components/TagBadge";
import { TiptapContent } from "../components/TiptapEditor";
import { TaskStatus } from "../types";
import {
  Edit,
  Clock,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Link as LinkIcon,
  Unlink,
  Trash2,
} from "lucide-react";
import {
  formatHoursToDisplay,
  formatHoursForTooltip,
} from "../utils/timeUtils";

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    tasks,
    tickets,
    updateTaskStatus,
    associateTaskWithTicket,
    dissociateTask,
    getTotalHoursForTask,
    deleteTask,
  } = useAppContext();

  const [showObservationForm, setShowObservationForm] = useState(false);
  const [showObservations, setShowObservations] = useState(true);
  const [showTimeEntryForm, setShowTimeEntryForm] = useState(false);
  const [showTimeEntries, setShowTimeEntries] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState("");

  if (!id) {
    navigate("/tasks");
    return null;
  }

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-semibold text-gray-700">
          Tarefa não encontrada
        </h2>
        <div className="mt-4">
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Voltar para lista de tarefas
          </Link>
        </div>
      </div>
    );
  }

  const ticketTitle = task.ticketId
    ? tickets.find((t) => t.id === task.ticketId)?.title ||
      "Chamado não encontrado"
    : "Sem chamado";

  const totalHours = getTotalHoursForTask(id);

  const formatDate = (dateString: string) => {
    const parts = dateString.split("-");
    if (parts.length !== 3) return dateString;

    const date = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2])
    );

    return date.toLocaleDateString();
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTaskStatus(id, e.target.value as TaskStatus);
  };

  const handleAssociateTicket = () => {
    if (selectedTicketId) {
      associateTaskWithTicket(id, selectedTicketId);
      setSelectedTicketId("");
    }
  };

  const handleDeleteTask = () => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita."
      )
    ) {
      deleteTask(id);
      navigate("/tasks");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate("/tasks")}
          className="mr-4 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Detalhes da Tarefa</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {task.title}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Criada em {formatDate(task.createdAt)}
            </p>
            {task.tags && task.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={`/tasks/${id}/edit`}
              className="inline-flex items-center text-blue-600 hover:text-blue-900"
            >
              <Edit className="h-5 w-5" />
              <span className="ml-1">Editar</span>
            </Link>
            <button
              onClick={handleDeleteTask}
              className="inline-flex items-center text-red-600 hover:text-red-700"
              title="Excluir tarefa"
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
                  value={task.status}
                  onChange={handleStatusChange}
                  className="block border p-2 w-full mt-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  aria-label="Status da tarefa"
                >
                  <option value="planejado">Planejado</option>
                  <option value="em andamento">Em andamento</option>
                  <option value="em analise">Em análise</option>
                  <option value="finalizado">Finalizado</option>
                </select>
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Última atualização
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formatDate(task.updatedAt)}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Descrição</dt>
              <div className="content-container my-2 flex-grow">
                <TiptapContent content={task.description} />
              </div>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">
                Chamado Associado
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {task.ticketId ? (
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/tickets/${task.ticketId}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      {ticketTitle}
                    </Link>
                    <button
                      onClick={() => dissociateTask(task.id)}
                      className="text-red-600 hover:text-red-900 ml-2"
                      title="Desassociar chamado"
                    >
                      <Unlink className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <select
                      value={selectedTicketId}
                      onChange={(e) => setSelectedTicketId(e.target.value)}
                      className="block border p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      aria-label="Selecionar chamado para associar"
                    >
                      <option value="">Selecione um chamado...</option>
                      {tickets.map((ticket) => (
                        <option key={ticket.id} value={ticket.id}>
                          {ticket.title}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssociateTicket}
                      disabled={!selectedTicketId}
                      className="inline-flex items-center p-1 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-300"
                      title="Associar chamado"
                      aria-label="Associar chamado"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Horas</dt>
              <dd className="mt-1 text-sm text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-blue-500 mr-1" />
                <span title={formatHoursForTooltip(totalHours)}>
                  {formatHoursToDisplay(totalHours)}
                </span>
                {task.estimatedHours && (
                  <span
                    className="ml-2 text-gray-500"
                    title={formatHoursForTooltip(task.estimatedHours)}
                  >
                    (estimado: {formatHoursToDisplay(task.estimatedHours)})
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <button
            className="text-lg leading-6 font-medium text-gray-900 flex items-center"
            onClick={() => setShowTimeEntries(!showTimeEntries)}
          >
            Registros de Tempo
            {showTimeEntries ? (
              <ChevronUp className="ml-2 h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="ml-2 h-5 w-5 text-gray-500" />
            )}
          </button>
          <button
            onClick={() => setShowTimeEntryForm(!showTimeEntryForm)}
            className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-700 transition ease-in-out duration-150"
          >
            <Clock className="h-4 w-4 mr-1" /> Registrar Horas
          </button>
        </div>
        {showTimeEntryForm && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <TimeEntryForm
              taskId={id}
              onComplete={() => setShowTimeEntryForm(false)}
            />
          </div>
        )}
        {showTimeEntries && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <TimeEntryList taskId={id} />
          </div>
        )}
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
              parentType="task"
              onComplete={() => setShowObservationForm(false)}
            />
          </div>
        )}
        {showObservations && (
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <ObservationList parentId={id} parentType="task" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDetail;
