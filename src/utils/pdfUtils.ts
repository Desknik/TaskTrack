import jsPDF from 'jspdf';
import { Ticket, Task, TimeEntry } from '../types';
import { formatHoursToDisplay } from './timeUtils';

interface PDFReportData {
  tickets: Ticket[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  getTotalHoursForTicket: (ticketId: string) => number;
  getTotalHoursForTask: (taskId: string) => number;
  getTasksForTicket: (ticketId: string) => Task[];
}

interface ReportSummary {
  totalTickets: number;
  totalTasks: number;
  totalHours: number;
  completedTickets: number;
  completedTasks: number;
}

export const generateWorkHoursPDFReport = (data: PDFReportData): void => {
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  const margin = 20;
  let yPosition = margin;

  // Função auxiliar para adicionar nova página
  const addNewPage = () => {
    pdf.addPage();
    yPosition = margin;
  };

  // Função auxiliar para verificar se precisa de nova página
  const checkPageBreak = (heightNeeded: number = 10) => {
    if (yPosition + heightNeeded > pageHeight - margin) {
      addNewPage();
    }
  };

  // Função auxiliar para adicionar texto
  const addText = (text: string, size: number = 12, style: 'normal' | 'bold' = 'normal') => {
    checkPageBreak();
    pdf.setFontSize(size);
    pdf.setFont('helvetica', style);
    pdf.text(text, margin, yPosition);
    yPosition += size * 0.5 + 2;
  };

  // Cabeçalho do relatório
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RELATÓRIO DE HORAS TRABALHADAS', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Data de geração
  const currentDate = new Date().toLocaleDateString('pt-BR');
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Gerado em: ${currentDate}`, pageWidth - margin, yPosition, { align: 'right' });
  yPosition += 15;

  // Resumo executivo
  const summary = calculateReportSummary(data);
  
  addText('RESUMO EXECUTIVO', 14, 'bold');
  yPosition += 5;
  
  addText(`Total de Chamados: ${summary.totalTickets}`, 12);
  addText(`Chamados Concluídos: ${summary.completedTickets}`, 12);
  addText(`Total de Tarefas: ${summary.totalTasks}`, 12);
  addText(`Tarefas Finalizadas: ${summary.completedTasks}`, 12);
  addText(`Total de Horas Trabalhadas: ${formatHoursToDisplay(summary.totalHours)}`, 12, 'bold');
  
  yPosition += 10;

  // Linha separadora
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 15;

  // Detalhamento por chamado
  addText('DETALHAMENTO POR CHAMADOS', 14, 'bold');
  yPosition += 10;

  // Filtrar apenas chamados que têm horas trabalhadas
  const ticketsWithHours = data.tickets
    .map(ticket => ({
      ...ticket,
      hours: data.getTotalHoursForTicket(ticket.id),
      tasks: data.getTasksForTicket(ticket.id)
    }))
    .filter(ticket => ticket.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  if (ticketsWithHours.length === 0) {
    addText('Nenhum chamado com horas registradas.', 12);
  } else {
    ticketsWithHours.forEach((ticket, index) => {
      checkPageBreak(30);      // Título do chamado
      addText(`${index + 1}. ${ticket.title}`, 12, 'bold');
      
      // Tags do chamado
      if (ticket.tags && ticket.tags.length > 0) {
        addText(`Tags: ${ticket.tags.join(', ')}`, 10);
      }
      
      // Status do chamado
      const statusText = getStatusLabel(ticket.status, 'ticket');
      addText(`Status: ${statusText}`, 10);
        // Horas totais do chamado
      addText(`Total de Horas: ${formatHoursToDisplay(ticket.hours)}`, 10, 'bold');
      
      yPosition += 3;

      // Tarefas do chamado
      if (ticket.tasks.length > 0) {
        addText('Tarefas:', 10, 'bold');
        
        ticket.tasks.forEach((task) => {
          const taskHours = data.getTotalHoursForTask(task.id);
          if (taskHours > 0) {
            checkPageBreak(15);
            const taskStatusText = getStatusLabel(task.status, 'task');
            addText(`  • ${task.title} - ${formatHoursToDisplay(taskHours)} (${taskStatusText})`, 9);
          }
        });
      }
        yPosition += 10;
    });
  }

  // Seção de tarefas complementares (sem chamado associado)
  yPosition += 10;
  addText('TAREFAS COMPLEMENTARES', 14, 'bold');
  yPosition += 5;
  addText('(Tarefas não associadas a chamados)', 10);
  yPosition += 10;

  // Filtrar tarefas que não têm chamado associado e têm horas trabalhadas
  const complementaryTasks = data.tasks
    .filter(task => !task.ticketId)
    .map(task => ({
      ...task,
      hours: data.getTotalHoursForTask(task.id)
    }))
    .filter(task => task.hours > 0)
    .sort((a, b) => b.hours - a.hours);

  if (complementaryTasks.length === 0) {
    addText('Nenhuma tarefa complementar com horas registradas.', 12);
  } else {
    complementaryTasks.forEach((task, index) => {
      checkPageBreak(25);

      // Título da tarefa
      addText(`${index + 1}. ${task.title}`, 12, 'bold');
      
      // Tags da tarefa complementar
      if (task.tags && task.tags.length > 0) {
        addText(`Tags: ${task.tags.join(', ')}`, 10);
      }
      
      // Status da tarefa
      const taskStatusText = getStatusLabel(task.status, 'task');
      addText(`Status: ${taskStatusText}`, 10);
      
      // Horas da tarefa
      addText(`Horas Trabalhadas: ${formatHoursToDisplay(task.hours)}`, 10, 'bold');
      
      yPosition += 8;
    });
  }// Rodapé na página final
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'normal');
  pdf.text(
    'Relatório de Controle de Horas - TaskTrack',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Salvar o PDF
  const fileName = `relatorio-horas-${currentDate.replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
};

const calculateReportSummary = (data: PDFReportData): ReportSummary => {
  const totalTickets = data.tickets.length;
  const totalTasks = data.tasks.length;
  const totalHours = data.timeEntries.reduce((sum, entry) => sum + entry.hours, 0);
  const completedTickets = data.tickets.filter(t => t.status === 'concluido').length;
  const completedTasks = data.tasks.filter(t => t.status === 'finalizado').length;

  return {
    totalTickets,
    totalTasks,
    totalHours,
    completedTickets,
    completedTasks
  };
};

const getStatusLabel = (status: string, type: 'ticket' | 'task'): string => {
  if (type === 'ticket') {
    const ticketStatusMap: Record<string, string> = {
      'aberto': 'Aberto',
      'pendente': 'Pendente',
      'resolvido': 'Resolvido',
      'concluido': 'Concluído'
    };
    return ticketStatusMap[status] || status;
  } else {
    const taskStatusMap: Record<string, string> = {
      'planejado': 'Planejado',
      'em andamento': 'Em Andamento',
      'em analise': 'Em Análise',
      'finalizado': 'Finalizado'
    };
    return taskStatusMap[status] || status;
  }
};
