/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Requests } from './pages/Requests/Requests';
import { RequestDetails } from './pages/RequestDetails/RequestDetails';
import { Documents } from './pages/Documents/Documents';
import { Companies } from './pages/Companies/Companies';
import { PlaceholderPage } from './pages/PlaceholderPage/PlaceholderPage';
import { Limits } from './pages/Limits/Limits';
import { Notifications } from './pages/Notifications/Notifications';
import { Reports } from './pages/Reports/Reports';
import { AuditLog } from './pages/AuditLog/AuditLog';

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/requests/:id" element={<RequestDetails />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/users" element={<PlaceholderPage title="Користувачі" />} />
            <Route path="/limits" element={<Limits />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit" element={<AuditLog />} />
            <Route path="/settings" element={<PlaceholderPage title="Налаштування" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}