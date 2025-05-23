import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '../components/TaskForm';
import { useAppContext } from '../context/AppContext';

const TaskEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tasks } = useAppContext();

  if (!id) {
    navigate('/tasks');
    return null;
  }

  const task = tasks.find((t) => t.id === id);

  if (!task) {
    navigate('/tasks');
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Tarefa</h1>
      <TaskForm task={task} isEditing={true} />
    </div>
  );
};

export default TaskEdit;