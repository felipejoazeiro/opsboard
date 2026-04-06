import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { TaskPage } from "./pages/TaskPage";
import { EmployeesPage } from "./pages/EmployeesPage";
import { clearSession, hasValidAccessToken } from "./lib/auth.js";
import { TeamsPage } from "./pages/TeamsPage.jsx";

function ProtectedRoute({ children }) {
  if (!hasValidAccessToken()) {
    clearSession();
    return <Navigate to="/" replace />;
  }

  return children;
}

function PublicLoginRoute() {
  if (hasValidAccessToken()) {
    return <Navigate to="/dashboard" replace />;
  }

  clearSession();

  return <LoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLoginRoute />} />
        <Route path="/home" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/task"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <TeamsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/employees" element={
          <ProtectedRoute>
            <EmployeesPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
