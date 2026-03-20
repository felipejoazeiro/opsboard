import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'

function hasAccessToken() {
  return Boolean(localStorage.getItem('access_token'))
}

function ProtectedRoute({ children }) {
  if (!hasAccessToken()) {
    return <Navigate to="/" replace />
  }

  return children
}

function PublicLoginRoute() {
  if (hasAccessToken()) {
    return <Navigate to="/home" replace />
  }

  return <LoginPage />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLoginRoute />} />
        <Route
          path="/home"
          element={(
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          )}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
