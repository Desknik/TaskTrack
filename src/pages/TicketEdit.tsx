import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketForm from '../components/TicketForm';
import { useAppContext } from '../context/AppContext';

const TicketEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tickets } = useAppContext();

  if (!id) {
    navigate('/tickets');
    return null;
  }

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    navigate('/tickets');
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Editar Chamado</h1>
      <TicketForm ticket={ticket} isEditing={true} />
    </div>
  );
};

export default TicketEdit;