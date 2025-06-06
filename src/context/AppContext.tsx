import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Task, Ticket, Observation, TimeEntry, TicketStatus, TaskStatus } from '../types';

interface AppContextType {
  // Data
  tickets: Ticket[];
  tasks: Task[];
  observations: Observation[];
  timeEntries: TimeEntry[];
  
  // Ticket methods
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTicket: (ticket: Ticket) => void;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  deleteTicket: (ticketId: string) => void; // Nova função para excluir tickets
  
  // Task methods
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  associateTaskWithTicket: (taskId: string, ticketId: string) => void;
  dissociateTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void; // Adicionando a definição do método
  
  // Observation methods
  addObservation: (observation: Omit<Observation, 'id' | 'createdAt'>) => void;
  updateObservation: (observationId: string, content: string) => void;
  deleteObservation: (observationId: string) => void;
  
  // Time entries methods
  addTimeEntry: (entry: Omit<TimeEntry, 'id'>) => void;
  updateTimeEntry: (entry: TimeEntry) => void;
  deleteTimeEntry: (id: string) => void;
  
  // Utility methods
  getTasksForTicket: (ticketId: string) => Task[];
  getUnassociatedTasks: () => Task[];
  getTicketsWithNoTasks: () => Ticket[];
  getTotalHoursForTask: (taskId: string) => number;
  getTotalHoursForTicket: (ticketId: string) => number;
  
  // Backup and restore methods
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  clearAllData: () => void; // Nova função para limpar todos os dados
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Local storage keys
const STORAGE_KEYS = {
  TICKETS: 'tickets',
  TASKS: 'tasks',
  OBSERVATIONS: 'observations',
  TIME_ENTRIES: 'timeEntries',
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const storedTickets = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return storedTickets ? JSON.parse(storedTickets) : [];
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [observations, setObservations] = useState<Observation[]>(() => {
    const storedObservations = localStorage.getItem(STORAGE_KEYS.OBSERVATIONS);
    return storedObservations ? JSON.parse(storedObservations) : [];
  });

  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    const storedTimeEntries = localStorage.getItem(STORAGE_KEYS.TIME_ENTRIES);
    return storedTimeEntries ? JSON.parse(storedTimeEntries) : [];
  });

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OBSERVATIONS, JSON.stringify(observations));
  }, [observations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIME_ENTRIES, JSON.stringify(timeEntries));
  }, [timeEntries]);

  // Tickets methods
  const addTicket = (ticketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTicket: Ticket = {
      id: uuidv4(),
      ...ticketData,
      tags: ticketData.tags || [], // Garantir que as tags sempre existam
      createdAt: now,
      updatedAt: now,
    };
    setTickets((prev) => [...prev, newTicket]);
  };

  const updateTicket = (updatedTicket: Ticket) => {
    setTickets((prev) => 
      prev.map((ticket) => 
        ticket.id === updatedTicket.id 
          ? { ...updatedTicket, updatedAt: new Date().toISOString() } 
          : ticket
      )
    );
  };

  const updateTicketStatus = (id: string, status: TicketStatus) => {
    setTickets((prev) => 
      prev.map((ticket) => 
        ticket.id === id 
          ? { ...ticket, status, updatedAt: new Date().toISOString() } 
          : ticket
      )
    );
  };

  const deleteTicket = useCallback((ticketId: string) => {
    // Verificar se o ID existe
    if (!ticketId) {
      console.error("ID de chamado inválido");
      return;
    }
    
    // Remover associações de tarefas com este chamado
    setTasks((prev) => 
      prev.map((task) => 
        task.ticketId === ticketId
          ? { ...task, ticketId: undefined, updatedAt: new Date().toISOString() }
          : task
      )
    );
    
    // Excluir todas as observações associadas ao chamado
    setObservations((prev) => 
      prev.filter((obs) => !(obs.parentId === ticketId && obs.parentType === 'ticket'))
    );
    
    // Finalmente, excluir o chamado
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
  }, []);

  // Tasks methods
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uuidv4(),
      ...taskData,
      tags: taskData.tags || [], // Garantir que as tags sempre existam
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (updatedTask: Task) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.id === updatedTask.id 
          ? { ...updatedTask, updatedAt: new Date().toISOString() } 
          : task
      )
    );
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.id === id 
          ? { ...task, status, updatedAt: new Date().toISOString() } 
          : task
      )
    );
  };

  const associateTaskWithTicket = (taskId: string, ticketId: string) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.id === taskId 
          ? { ...task, ticketId, updatedAt: new Date().toISOString() } 
          : task
      )
    );
  };

  const dissociateTask = (taskId: string) => {
    setTasks((prev) => 
      prev.map((task) => 
        task.id === taskId 
          ? { ...task, ticketId: undefined, updatedAt: new Date().toISOString() } 
          : task
      )
    );
  };

  const deleteTask = useCallback((taskId: string) => {
    // Verificar se o ID existe
    if (!taskId) {
      console.error("ID de tarefa inválido");
      return;
    }
    
    // Primeiro excluir todas as entradas de tempo associadas à tarefa
    setTimeEntries((prev) => prev.filter((entry) => entry.taskId !== taskId));
    
    // Excluir todas as observações associadas à tarefa
    setObservations((prev) => 
      prev.filter((obs) => !(obs.parentId === taskId && obs.parentType === 'task'))
    );
    
    // Finalmente, excluir a tarefa
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }, []);

  // Observations methods
  const addObservation = (observationData: Omit<Observation, 'id' | 'createdAt'>) => {
    const newObservation: Observation = {
      id: uuidv4(),
      ...observationData,
      createdAt: new Date().toISOString(),
    };
    
    setObservations((prev) => {
      const updatedObservations = [...prev, newObservation];
      return updatedObservations;
    });
  };

  const updateObservation = (observationId: string, content: string) => {
    setObservations((prev) => 
      prev.map((obs) => 
        obs.id === observationId
          ? { ...obs, content }
          : obs
      )
    );
  };

  const deleteObservation = useCallback((observationId: string) => {

    // Verificar se o ID existe antes de tentar excluir
    if (!observationId) {
      console.error("ID de observação inválido");
      return;
    }
    
    // Atualiza o estado removendo a observação com o ID especificado
    setObservations((prevObservations) => 
      prevObservations.filter((obs) => obs.id !== observationId)
    );
    
  }, []);

  // Time entries methods
  const addTimeEntry = (entryData: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      id: uuidv4(),
      ...entryData,
    };
    setTimeEntries((prev) => [...prev, newEntry]);
  };

  const updateTimeEntry = (updatedEntry: TimeEntry) => {
    setTimeEntries((prev) => 
      prev.map((entry) => 
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  const deleteTimeEntry = (id: string) => {
    setTimeEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  // Utility methods
  const getTasksForTicket = (ticketId: string) => {
    return tasks.filter((task) => task.ticketId === ticketId);
  };

  const getUnassociatedTasks = () => {
    return tasks.filter((task) => !task.ticketId);
  };

  const getTicketsWithNoTasks = () => {
    const ticketsWithTasks = new Set(tasks.map((task) => task.ticketId).filter(Boolean));
    return tickets.filter((ticket) => !ticketsWithTasks.has(ticket.id));
  };

  const getTotalHoursForTask = (taskId: string) => {
    return timeEntries
      .filter((entry) => entry.taskId === taskId)
      .reduce((total, entry) => total + entry.hours, 0);
  };

  const getTotalHoursForTicket = (ticketId: string) => {
    const ticketTasks = tasks.filter((task) => task.ticketId === ticketId);
    return ticketTasks.reduce(
      (total, task) => total + getTotalHoursForTask(task.id),
      0
    );
  };

  // Backup and restore methods
  const exportData = useCallback(() => {
    const appData = {
      tickets,
      tasks,
      observations,
      timeEntries,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };
    
    return JSON.stringify(appData, null, 2);
  }, [tickets, tasks, observations, timeEntries]);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const parsedData = JSON.parse(jsonData);
      
      // Verificar se o arquivo possui uma estrutura válida
      if (!parsedData.tickets || !parsedData.tasks || 
          !parsedData.observations || !parsedData.timeEntries) {
        return false;
      }
      
      // Atualizar todos os dados
      setTickets(parsedData.tickets);
      setTasks(parsedData.tasks);
      setObservations(parsedData.observations);
      setTimeEntries(parsedData.timeEntries);
      
      return true;
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      return false;
    }
  }, []);

  // Função para limpar todos os dados
  const clearAllData = useCallback(() => {
    setTickets([]);
    setTasks([]);
    setObservations([]);
    setTimeEntries([]);
  }, []);

  const value: AppContextType = {
    tickets,
    tasks,
    observations,
    timeEntries,
    addTicket,
    updateTicket,
    updateTicketStatus,
    deleteTicket, // Adicionando a nova função ao contexto
    addTask,
    updateTask,
    updateTaskStatus,
    associateTaskWithTicket,
    dissociateTask,
    deleteTask, // Adicionando a função ao valor do contexto
    addObservation,
    updateObservation,
    deleteObservation,
    addTimeEntry,
    updateTimeEntry,
    deleteTimeEntry,
    getTasksForTicket,
    getUnassociatedTasks,
    getTicketsWithNoTasks,
    getTotalHoursForTask,
    getTotalHoursForTicket,
    exportData,
    importData,
    clearAllData, // Adicionando a nova função ao contexto
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};