import { API_ROUTES } from "../config/api";
import { WalletBalance, WalletResponse, WalletOperationResponse } from "../types/wallet";

export type OperationType = "deposit" | "withdraw";

interface BalanceOperationParams {
  operation: OperationType;
  amount: number;
}

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
  },

  /**
   * Actualiza el balance del wallet (depositar o retirar)
   */
  async updateBalance({ operation, amount }: BalanceOperationParams): Promise<WalletOperationResponse> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No hay token de autenticación');
    }

    const response = await fetch(API_ROUTES.wallet.balance, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        operation,
        amount
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.error || `Error ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  }
}; 