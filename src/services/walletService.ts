import { API_ROUTES } from "../config/api";
import { WalletBalance, WalletResponse } from "../types/wallet";

export const walletService = {
  /**
   * Obtiene el balance del wallet del usuario
   */
  async getBalance(): Promise<WalletBalance> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(API_ROUTES.wallet.balance, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    const data: WalletResponse = await response.json();
    return data.data;
  }
}; 