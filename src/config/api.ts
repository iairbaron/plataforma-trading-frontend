export const API_BASE_URL = 'http://localhost:3000';

export const API_ROUTES = {
  auth: {
    login: `${API_BASE_URL}/trading/auth/login`,
    signup: `${API_BASE_URL}/trading/auth/signup`,
  },
  market: {
    instruments: `${API_BASE_URL}/api/market/instruments`,
  },
  orders: {
    create: `${API_BASE_URL}/api/orders`,
  },
  wallet: {
    balance: `${API_BASE_URL}/api/wallet/balance`,
  }
} as const; 