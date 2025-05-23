import React from 'react';
import TaskList from '../components/TaskList';

const TasksPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Tarefas</h1>
      <TaskList />
    </div>
  );
};

export default TasksPage;