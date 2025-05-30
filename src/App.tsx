import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth'; // Make sure this path is correct

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StationsList from './pages/StationsList';
import MapView from './pages/MapView';
import EditStation from './pages/EditStation';
import AddStation from './pages/AddStation';

// Components
import Layout from './components/Layout';

// Protected Route component (must be inside component to use hook!)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="stations" element={<StationsList />} />
            <Route path="stations/add" element={<AddStation />} />
            <Route path="stations/edit/:id" element={<EditStation />} />
            <Route path="map" element={<MapView />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
