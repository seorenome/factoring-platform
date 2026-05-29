import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { AuthProvider } from './contexts/AuthContext';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { Requests } from './pages/Requests/Requests';
import { RequestDetails } from './pages/RequestDetails/RequestDetails';
import { CreateRequest } from './pages/CreateRequest/CreateRequest';
import { Documents } from './pages/Documents/Documents';
import { Companies } from './pages/Companies/Companies';
import { Users } from './pages/Users/Users';
import { Limits } from './pages/Limits/Limits';
import { Notifications } from './pages/Notifications/Notifications';
import { Reports } from './pages/Reports/Reports';
import { AuditLog } from './pages/AuditLog/AuditLog';
import { Login } from './pages/Login/Login';
import { Profile } from './pages/Profile/Profile';
import { Settings } from './pages/Settings/Settings';
import { PlaceholderPage } from './pages/PlaceholderPage/PlaceholderPage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/requests" element={<PrivateRoute><Requests /></PrivateRoute>} />
            <Route path="/requests/:id" element={<PrivateRoute><RequestDetails /></PrivateRoute>} />
            <Route path="/requests/create" element={<PrivateRoute><CreateRequest /></PrivateRoute>} />
            <Route path="/documents" element={<PrivateRoute><Documents /></PrivateRoute>} />
            <Route path="/companies" element={<PrivateRoute><Companies /></PrivateRoute>} />
            <Route path="/users" element={<PrivateRoute><Users /></PrivateRoute>} />
            <Route path="/limits" element={<PrivateRoute><Limits /></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
            <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
            <Route path="/audit" element={<PrivateRoute><AuditLog /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}