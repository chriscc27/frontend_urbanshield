import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationToast from './components/ui/NotificationToast';
import AppRoutes from './routes/AppRoutes';

function App() {
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('us_settings');
      if (saved) {
        const { appearance } = JSON.parse(saved);
        if (appearance?.theme === 'Oscuro' || (appearance?.theme === 'Sistema' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
        if (appearance?.reduceAnimations) {
          document.documentElement.style.setProperty('--animate-duration', '0s');
        }
      }
    } catch (e) {
      console.error('Failed to parse settings on boot', e);
    }
  }, []);

  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
          <NotificationToast />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

