import { API_ROUTES } from "../config/api";

export interface OrderData {
  symbol: string;
  amount: number;
  type: string;
  priceAtExecution: number;
  total: number;
}

export interface OrderResponse {
  status: string;
  data: {
    orderId: string;
    symbol: string;
    amount: number;
    type: string;
    priceAtExecution: number;
    total: number;
    timestamp: string;
  };
}

export class OrderError extends Error {
  statusCode?: number;
  
  constructor(message: string, statusCode?: number) {
    super(message);
    this.name = "OrderError";
    this.statusCode = statusCode;
  }
}

export const orderService = {
  /**
   * Crea una nueva orden de compra o venta
   * @param orderData Datos de la orden
   * @returns Respuesta de la orden
   */
  async createOrder(orderData: OrderData): Promise<OrderResponse> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new OrderError('No hay token de autenticación');
    }
    
    try {
      const response = await fetch(API_ROUTES.orders.create, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido" }));
        throw new OrderError(
          errorData.error || `Error ${response.status}: ${response.statusText}`,
          response.status
        );
      }
      
      return await response.json();
    } catch (error) {
      if (error instanceof OrderError) {
        throw error;
      }
      throw new OrderError((error as Error).message || "Error al procesar la orden");
    }
  }
}; 