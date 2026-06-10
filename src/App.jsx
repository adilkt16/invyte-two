import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Invitation from './components/Invitation';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect route / to /dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard route */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Personalized guest invitation route */}
        <Route path="/invite/:slug" element={<Invitation />} />
        
        {/* Themed 404 fallback route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
