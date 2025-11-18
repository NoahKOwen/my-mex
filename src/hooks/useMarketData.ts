import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { MarketData } from '../types';

export const useMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const { data, error } = await supabase
          .from('market_data')
          .select(`
            *,
            trading_pair:trading_pairs(*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMarketData(data || []);
      } catch (error) {
        console.error('Error fetching market data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();

    // Set up real-time subscription
    const channel = supabase
      .channel('market_data_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'market_data'
      }, fetchMarketData)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { marketData, loading };
};