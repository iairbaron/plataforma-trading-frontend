import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard/AuthGuard";
import { AuthRedirect } from "./components/AuthGuard/AuthRedirect";
import { useAuth } from "./hooks/useAuth";

import "./App.css";
import { SignupForm } from "./components/forms/SignUpForm";
import { AuthLayout } from "./components/layout/AuthLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { LoginPage } from "./pages/LoginPage";
import { Homepage } from "./pages/Homepage";

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
          <Navigate to="/home" replace /> : 
          <Navigate to="/login" replace />
        } 
      />

      <Route 
        element={
          <AuthRedirect>
            <AuthLayout />
          </AuthRedirect>
        }
      >
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupForm />} />
      </Route>

      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route path="/home" element={<Homepage />} />
      </Route>
    </Routes>
  );
}

export default App;
