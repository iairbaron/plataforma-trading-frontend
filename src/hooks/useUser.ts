import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export const useUser = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  //TODO: Los datos del usuario se pueden obtener desde el backend y usar la cache de react query y no desde el localStorage
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      
      // Intentar obtener el usuario del localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
        return null;
      }
    },
    enabled: isAuthenticated,
    staleTime: Infinity, // Los datos no caducan hasta que se invaliden explícitamente
  });

  const updateUser = (userData: User | null) => {
    if (userData) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      localStorage.removeItem("user");
    }
    queryClient.setQueryData(["user"], userData);
  };

  const clearUser = () => {
    localStorage.removeItem("user");
    queryClient.setQueryData(["user"], null);
  };

  return {
    user,
    isLoading,
    updateUser,
    clearUser,
  };
}; 