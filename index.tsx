
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/Auth';
import AdminPanel from './pages/AdminPanel';
import EmployeePanel from './pages/EmployeePanel';

import { Toaster } from 'react-hot-toast';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#333',
          color: '#fff',
        },
      }} />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/employee" element={<EmployeePanel />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
