import React from 'react';
import TicketForm from '../components/TicketForm';

const TicketCreate: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Novo Chamado</h1>
      <TicketForm />
    </div>
  );
};

export default TicketCreate;