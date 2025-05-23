export type TicketStatus = 'aberto' | 'pendente' | 'resolvido' | 'concluido';
export type TaskStatus = 'planejado' | 'em andamento' | 'em analise' | 'finalizado';

export interface TimeEntry {
  id: string;
  taskId: string;
  hours: number;
  date: string;
  description: string;
  type?: string; // Tipo de atividade: desenvolvimento, teste, etc.
}

export interface Observation {
  id: string;
  parentId: string; // Can be ticketId or taskId
  parentType: 'ticket' | 'task';
  content: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  ticketId?: string; // Optional because a task might not be associated with a ticket
  estimatedHours?: number;
  tags: string[]; // Array de strings para armazenar as tags
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: 'baixa' | 'média' | 'alta' | 'crítica';
  tags: string[]; // Array de strings para armazenar as tags
  createdAt: string;
  updatedAt: string;
}