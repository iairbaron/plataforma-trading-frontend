import { useAuth } from "../hooks/useAuth";
import { API_ROUTES } from "../config/api";
import { Instrument } from "../types/market";

export const marketService = {
  async getInstruments(): Promise<{ coins: Instrument[] }> {
    const token = useAuth.getState().token;

    const response = await fetch(API_ROUTES.market.instruments, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener los instrumentos");
    }

    return response.json();
  },
};
