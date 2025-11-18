export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TradingPair {
  id: string;
  symbol: string;
  base_currency: string;
  quote_currency: string;
  price_precision: number;
  quantity_precision: number;
  is_active: boolean;
  created_at: string;
}

export interface MarketData {
  id: string;
  trading_pair_id: string;
  price: number;
  volume_24h: number;
  change_24h: number;
  high_24h: number;
  low_24h: number;
  updated_at: string;
  trading_pair?: TradingPair;
}

export interface Order {
  id: string;
  user_id: string;
  trading_pair_id: string;
  order_type: 'market' | 'limit' | 'stop';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  filled_quantity: number;
  status: 'pending' | 'filled' | 'cancelled' | 'partial';
  created_at: string;
  updated_at: string;
  trading_pair?: TradingPair;
}

export interface Trade {
  id: string;
  buyer_order_id: string;
  seller_order_id: string;
  trading_pair_id: string;
  quantity: number;
  price: number;
  created_at: string;
  trading_pair?: TradingPair;
}

export interface Balance {
  id: string;
  user_id: string;
  currency: string;
  available_balance: number;
  locked_balance: number;
  created_at: string;
  updated_at: string;
}

export interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}