import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TicketsPage from './pages/TicketsPage';
import TasksPage from './pages/TasksPage';
import TicketDetail from './pages/TicketDetail';
import TaskDetail from './pages/TaskDetail';
import TicketCreate from './pages/TicketCreate';
import TaskCreate from './pages/TaskCreate';
import TicketEdit from './pages/TicketEdit';
import TaskEdit from './pages/TaskEdit';
import ReportsPage from './pages/ReportsPage';
import TimePage from './pages/TimePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tickets" element={<TicketsPage />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/tickets/new" element={<TicketCreate />} />
            <Route path="/tickets/:id/edit" element={<TicketEdit />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/tasks/:id" element={<TaskDetail />} />
            <Route path="/tasks/new" element={<TaskCreate />} />
            <Route path="/tasks/:id/edit" element={<TaskEdit />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/time" element={<TimePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;