import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { store } from './app/store';
import { Login } from './pages/Login';
import { Turbines } from './pages/Turbines';
import { Role } from './types';
import './index.css';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';

// Placeholder pages
const Inspections = () => (
  <div className="text-2xl font-bold">Inspections Page - Coming Soon</div>
);
const RepairPlans = () => (
  <div className="text-2xl font-bold">Repair Plans Page - Coming Soon</div>
);
const Admin = () => (
  <div className="text-2xl font-bold">Admin Page - Coming Soon</div>
);
const Unauthorized = () => (
  <div className="flex items-center justify-center h-96">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-destructive mb-4">Unauthorized</h2>
      <p className="text-muted-foreground">
        You don't have permission to access this page
      </p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/turbines" replace />} />
            <Route path="turbines" element={<Turbines />} />
            <Route path="inspections" element={<Inspections />} />
            <Route
              path="repair-plans"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN, Role.ENGINEER]}>
                  <RepairPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin"
              element={
                <ProtectedRoute allowedRoles={[Role.ADMIN]}>
                  <Admin />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
