export interface CoinDetail {
  amount: number;
  value: number;
  currentPrice: number;
}

export interface WalletBalance {
  usdBalance: number;
  totalCoinValue: number;
  coinDetails: {
    [symbol: string]: CoinDetail;
  };
}

export interface WalletResponse {
  status: string;
  data: WalletBalance;
} 