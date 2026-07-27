import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './api/client';
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
import Billing from './pages/Billing';
import GlobalLoader from './components/GlobalLoader';

function PrivateRoute({ children }) {
  return getToken() ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <GlobalLoader />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="pipelines" element={<Pipelines />} />
          <Route path="pipelines/:id" element={<PipelineDetail />} />
          <Route path="deployments" element={<Deployments />} />
          <Route path="security" element={<Security />} />
          <Route path="repositories" element={<Repositories />} />
          <Route path="health" element={<Health />} />
          <Route path="billing" element={<Billing />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
