import React from 'react';
import { TicketStatus, TaskStatus } from '../types';

interface StatusBadgeProps {
  status: TicketStatus | TaskStatus;
  type: 'ticket' | 'task';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type }) => {
  const getStatusColor = () => {
    if (type === 'ticket') {
      switch (status) {
        case 'aberto':
          return 'bg-blue-100 text-blue-800';
        case 'pendente':
          return 'bg-yellow-100 text-yellow-800';
        case 'resolvido':
          return 'bg-green-100 text-green-800';
        case 'concluido':
          return 'bg-purple-100 text-purple-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'planejado':
          return 'bg-indigo-100 text-indigo-800';
        case 'em andamento':
          return 'bg-orange-100 text-orange-800';
        case 'em analise':
          return 'bg-cyan-100 text-cyan-800';
        case 'done':
          return 'bg-emerald-100 text-emerald-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;