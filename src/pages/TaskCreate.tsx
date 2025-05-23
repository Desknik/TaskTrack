import React from 'react';
import { useSearchParams } from 'react-router-dom';
import TaskForm from '../components/TaskForm';

const TaskCreate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get('ticketId') || undefined;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Nova Tarefa {ticketId ? 'para o Chamado' : ''}
      </h1>
      <TaskForm ticketId={ticketId} />
    </div>
  );
};

export default TaskCreate;