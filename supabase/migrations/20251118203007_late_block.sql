/*
  # Exchange Platform Database Schema

  1. New Tables
    - `users` - User accounts and profiles
    - `trading_pairs` - Available trading pairs (BTC/USDT, ETH/USDT, etc.)
    - `orders` - User orders (market, limit, etc.)
    - `trades` - Executed trades
    - `balances` - User account balances
    - `market_data` - Real-time market data cache

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    - Ensure users can only access their own data
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Trading pairs
CREATE TABLE IF NOT EXISTS trading_pairs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text UNIQUE NOT NULL, -- e.g., 'BTCUSDT'
  base_currency text NOT NULL, -- e.g., 'BTC'
  quote_currency text NOT NULL, -- e.g., 'USDT'
  price_precision integer DEFAULT 8,
  quantity_precision integer DEFAULT 8,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  trading_pair_id uuid NOT NULL REFERENCES trading_pairs(id),
  order_type text NOT NULL CHECK (order_type IN ('market', 'limit', 'stop')),
  side text NOT NULL CHECK (side IN ('buy', 'sell')),
  quantity decimal(20,8) NOT NULL,
  price decimal(20,8),
  filled_quantity decimal(20,8) DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'cancelled', 'partial')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Executed trades
CREATE TABLE IF NOT EXISTS trades (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_order_id uuid NOT NULL REFERENCES orders(id),
  seller_order_id uuid NOT NULL REFERENCES orders(id),
  trading_pair_id uuid NOT NULL REFERENCES trading_pairs(id),
  quantity decimal(20,8) NOT NULL,
  price decimal(20,8) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- User balances
CREATE TABLE IF NOT EXISTS balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  currency text NOT NULL,
  available_balance decimal(20,8) DEFAULT 0,
  locked_balance decimal(20,8) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency)
);

-- Market data cache
CREATE TABLE IF NOT EXISTS market_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trading_pair_id uuid NOT NULL REFERENCES trading_pairs(id),
  price decimal(20,8) NOT NULL,
  volume_24h decimal(20,8) DEFAULT 0,
  change_24h decimal(10,4) DEFAULT 0,
  high_24h decimal(20,8),
  low_24h decimal(20,8),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(trading_pair_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_data ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own balances"
  ON balances FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read own trades"
  ON trades FOR SELECT
  TO authenticated
  USING (
    auth.uid() IN (
      SELECT user_id FROM orders WHERE id IN (buyer_order_id, seller_order_id)
    )
  );

CREATE POLICY "Everyone can read trading pairs"
  ON trading_pairs FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Everyone can read market data"
  ON market_data FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO trading_pairs (symbol, base_currency, quote_currency) VALUES
  ('BTCUSDT', 'BTC', 'USDT'),
  ('ETHUSDT', 'ETH', 'USDT'),
  ('BNBUSDT', 'BNB', 'USDT'),
  ('ADAUSDT', 'ADA', 'USDT'),
  ('SOLUSDT', 'SOL', 'USDT'),
  ('DOTUSDT', 'DOT', 'USDT'),
  ('MATICUSDT', 'MATIC', 'USDT'),
  ('AVAXUSDT', 'AVAX', 'USDT');

-- Insert sample market data
INSERT INTO market_data (trading_pair_id, price, volume_24h, change_24h, high_24h, low_24h)
SELECT 
  tp.id,
  CASE 
    WHEN tp.symbol = 'BTCUSDT' THEN 43250.50
    WHEN tp.symbol = 'ETHUSDT' THEN 2650.75
    WHEN tp.symbol = 'BNBUSDT' THEN 315.20
    WHEN tp.symbol = 'ADAUSDT' THEN 0.485
    WHEN tp.symbol = 'SOLUSDT' THEN 98.45
    WHEN tp.symbol = 'DOTUSDT' THEN 6.85
    WHEN tp.symbol = 'MATICUSDT' THEN 0.875
    WHEN tp.symbol = 'AVAXUSDT' THEN 38.20
  END as price,
  RANDOM() * 1000000 as volume_24h,
  (RANDOM() - 0.5) * 10 as change_24h,
  CASE 
    WHEN tp.symbol = 'BTCUSDT' THEN 44100.00
    WHEN tp.symbol = 'ETHUSDT' THEN 2720.00
    WHEN tp.symbol = 'BNBUSDT' THEN 325.50
    WHEN tp.symbol = 'ADAUSDT' THEN 0.495
    WHEN tp.symbol = 'SOLUSDT' THEN 102.30
    WHEN tp.symbol = 'DOTUSDT' THEN 7.20
    WHEN tp.symbol = 'MATICUSDT' THEN 0.920
    WHEN tp.symbol = 'AVAXUSDT' THEN 40.15
  END as high_24h,
  CASE 
    WHEN tp.symbol = 'BTCUSDT' THEN 42800.00
    WHEN tp.symbol = 'ETHUSDT' THEN 2580.00
    WHEN tp.symbol = 'BNBUSDT' THEN 308.75
    WHEN tp.symbol = 'ADAUSDT' THEN 0.470
    WHEN tp.symbol = 'SOLUSDT' THEN 95.20
    WHEN tp.symbol = 'DOTUSDT' THEN 6.55
    WHEN tp.symbol = 'MATICUSDT' THEN 0.835
    WHEN tp.symbol = 'AVAXUSDT' THEN 36.80
  END as low_24h
FROM trading_pairs tp;