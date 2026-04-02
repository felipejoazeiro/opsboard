import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { DashboardPage } from "./pages/DashboardPage";
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
    return <Navigate to="/home" replace />;
  }

  clearSession();

  return <LoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLoginRoute />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
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
