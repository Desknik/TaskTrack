import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Importar funcionalidades PWA
import './utils/pwaUtils.ts';
import { offlineManager } from './utils/offlineManager.ts';

// Inicializar manager offline
offlineManager.initialize();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
