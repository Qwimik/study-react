import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import Profile from './pages/Profile';
import Notes from './pages/Notes';
import News from './pages/News';
import Users from './pages/Users';
import './styles/global.css';

const DashboardRoutes = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="profile" element={<Profile />} />
        <Route path="notes" element={<Notes />} />
        <Route path="news" element={<News />} />
        <Route path="users" element={<Users />} />
        <Route path="*" element={<Navigate to="/dashboard/profile" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
        }
      />
      <Route path="/news" element={<News />} />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <DashboardRoutes />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

