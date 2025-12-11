import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AppState } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOGIN);

  const handleLogin = () => {
    setAppState(AppState.DASHBOARD);
  };

  const handleLogout = () => {
    setAppState(AppState.LOGIN);
  };

  return (
    <>
      {appState === AppState.LOGIN ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard onLogout={handleLogout} />
      )}
    </>
  );
};

export default App;