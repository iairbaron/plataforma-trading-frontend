import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { API_BASE_URL } from "../config/api";

export const useFavorites = () => {
  const token = useAuth.getState().token;
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/api/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      return json.data.map((f: any) => f.symbol.toLowerCase());
    },
  });

  const toggleFavorite = useMutation({
    mutationFn: async (symbol: string) => {
      const isFav = data.includes(symbol.toLowerCase());

      if (isFav) {
        await fetch(`${API_BASE_URL}/api/favorites/${symbol}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await fetch(`${API_BASE_URL}/api/favorites`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ symbol }),
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });

  return {
    data, 
    isLoading, 
    toggleFavorite, 
  };
};
