import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard/AuthGuard";

import "./App.css";
import { SignupForm } from "./components/forms/SignUpForm";
import { AuthLayout } from "./components/layout/AuthLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { LoginPage } from "./pages/LoginPage";
import { Homepage } from "./pages/Homepage";

function App() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
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
        <Route path="/" element={<Homepage />} />
      </Route>

      <Route path="/" element={<Navigate to="/instruments" replace />} />
    </Routes>
  );
}

export default App;
