import { Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "./components/AuthGuard/AuthGuard";
import { MarketMonitor } from "./pages/Homepage";
import "./App.css";
import { SignupForm } from "./components/forms/SignUpForm";
import { AuthLayout } from "./components/layout/AuthLayout";
import { MainLayout } from "./components/layout/MainLayout";
import { LoginPage } from "./pages/LoginPage";

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
        <Route path="/instruments" element={<MarketMonitor />} />
      </Route>

      <Route path="/" element={<Navigate to="/instruments" replace />} />
    </Routes>
  );
}

export default App;
