import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface AuthRedirectProps {
  children: React.ReactNode;
}

/**
 * Redirige a los usuarios autenticados a /home cuando intentan acceder a páginas de autenticación
 */
export const AuthRedirect = ({ children }: AuthRedirectProps) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Si el usuario ya está autenticado, redirigir a la página principal
    return <Navigate to="/home" state={{ from: location.pathname }} replace />;
  }

  // Si no está autenticado, mostrar el componente hijo (formulario de login o registro)
  return <>{children}</>;
}; 