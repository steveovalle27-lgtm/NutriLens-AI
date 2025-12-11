import React, { useState } from 'react';
import Login from './components/Login';
import UserDashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);

  const handleLogin = (role: 'USER' | 'ADMIN') => {
    if (role === 'ADMIN') {
        setAppState(AppState.ADMIN_DASHBOARD);
    } else {
        setAppState(AppState.USER_DASHBOARD);
    }
  };

  const handleLogout = () => {
    setAppState(AppState.LOGIN);
  };

  return (
    <>
      {appState === AppState.LOGIN && <Login onLogin={handleLogin} />}
      {appState === AppState.USER_DASHBOARD && <UserDashboard onLogout={handleLogout} />}
      {appState === AppState.ADMIN_DASHBOARD && <AdminDashboard onLogout={handleLogout} />}
    </>
  );
};

export default App;