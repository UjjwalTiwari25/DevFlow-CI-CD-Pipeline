import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './api/client';
import { EventProvider } from './components/EventContext';
import { ToastProvider } from './components/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Pipelines from './pages/Pipelines';
import PipelineDetail from './pages/PipelineDetail';
import Deployments from './pages/Deployments';
import Security from './pages/Security';
import Repositories from './pages/Repositories';
import Health from './pages/Health';
import SettingsPage from './pages/Settings';


function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><EventProvider><ErrorBoundary><Layout /></ErrorBoundary></EventProvider></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="pipelines" element={<Pipelines />} />
          <Route path="pipelines/:id" element={<PipelineDetail />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="security" element={<Security />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="health" element={<Health />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}
