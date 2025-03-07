import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import AddHabit from './components/habits/AddHabit';
import Statistics from './components/statistics/Statistics';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

function AppRoutes() {
  const { isAuthenticated, login, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route
          path="/register"
          element={
            !isAuthenticated? (
              <Register onRegister={login} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={login} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register onRegister={login} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={logout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/add-habit"
          element={
            isAuthenticated ? (
              <AddHabit />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/statistics"
          element={
            isAuthenticated ? (
              <Statistics />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;