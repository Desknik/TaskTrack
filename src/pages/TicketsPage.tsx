import React from 'react';
import TicketList from '../components/TicketList';

const TicketsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Chamados</h1>
      <TicketList />
    </div>
  );
};

export default TicketsPage;