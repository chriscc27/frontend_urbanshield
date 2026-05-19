import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Layouts
import PublicLayout from '../layout/PublicLayout';
import DashboardLayout from '../layout/DashboardLayout';
import AdminLayout from '../layout/AdminLayout';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Citizen Pages
import CitizenDashboard from '../pages/citizen/CitizenDashboard';
import CreateReport from '../pages/citizen/CreateReport';
import MyReports from '../pages/citizen/MyReports';
import ReportDetails from '../pages/citizen/ReportDetails';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminReports from '../pages/admin/AdminReports';
import AdminMap from '../pages/admin/AdminMap';

// Extra Pages
import NotificationsPage from '../pages/extra/NotificationsPage';
import ProfilePage from '../pages/extra/ProfilePage';
import SettingsPage from '../pages/extra/SettingsPage';
import HelpPage from '../pages/extra/HelpPage';
import NotFoundPage from '../pages/extra/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Citizen Routes */}
      <Route
        element={
          <ProtectedRoute role="citizen">
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/report/new" element={<CreateReport />} />
        <Route path="/reports" element={<MyReports />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="map" element={<AdminMap />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="/citizen" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
