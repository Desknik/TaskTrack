import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus } from '../types';
import { useAppContext } from '../context/AppContext';
import { X } from 'lucide-react';
import TagBadge from './TagBadge';
import TiptapEditor from './TiptapEditor';

interface TaskFormProps {
  task?: Task;
  isEditing?: boolean;
  ticketId?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, isEditing = false, ticketId }) => {
  const navigate = useNavigate();
  const { addTask, updateTask, tickets } = useAppContext();

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'planejado');
  const [selectedTicketId, setSelectedTicketId] = useState(task?.ticketId || ticketId || '');
  const [estimatedHours, setEstimatedHours] = useState(task?.estimatedHours?.toString() || '');
  const [tags, setTags] = useState<string[]>(task?.tags || []);
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      status,
      ticketId: selectedTicketId || undefined,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      tags,
    };

    if (isEditing && task) {
      updateTask({
        ...task,
        ...taskData,
      });
      navigate(`/tasks/${task.id}`);
    } else {
      addTask(taskData);
      if (ticketId) {
        navigate(`/tickets/${ticketId}`);
      } else {
        navigate('/tasks');
      }
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            {isEditing ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {isEditing
              ? 'Atualize as informações da tarefa conforme necessário.'
              : 'Forneça as informações para criar uma nova tarefa.'}
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <TiptapEditor
                content={description}
                onChange={setDescription}
                placeholder="Descreva os detalhes da tarefa..."
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="planejado">Planejado</option>
                <option value="em andamento">Em andamento</option>
                <option value="em analise">Em análise</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="estimatedHours" className="block text-sm font-medium text-gray-700">
                Horas Estimadas
              </label>
              <input
                type="number"
                name="estimatedHours"
                id="estimatedHours"
                min="0"
                step="0.5"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
              />
            </div>

            <div className="col-span-6">
              <label htmlFor="ticketId" className="block text-sm font-medium text-gray-700">
                Chamado Associado
              </label>
              <select
                id="ticketId"
                name="ticketId"
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                value={selectedTicketId}
                onChange={(e) => setSelectedTicketId(e.target.value)}
              >
                <option value="">Sem chamado</option>
                {tickets.map((ticket) => (
                  <option key={ticket.id} value={ticket.id}>
                    {ticket.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-6">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  className="border px-3 focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                  placeholder="Adicionar tag (ex: frontend, backend, documentação)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm"
                >
                  Adicionar
                </button>
              </div>
              
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center">
                      <TagBadge tag={tag} />
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => 
            navigate(
              isEditing 
                ? `/tasks/${task?.id}` 
                : ticketId 
                  ? `/tickets/${ticketId}` 
                  : '/tasks'
            )
          }
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? 'Atualizar' : 'Criar'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;