import { useState, useEffect, useCallback } from 'react';
import { tradesService } from '@/lib/services/trades.service';
import { Trade } from '@/lib/types';
import { useToast } from './use-toast';

export function useTrades(params?: { instrument_id?: string; trade_type?: string; start_date?: string; end_date?: string }) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchTrades = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await tradesService.list(params);
      setTrades(data);
      setError(null);
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch trades';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [params, toast]);

  const createTrade = useCallback(async (tradeData: Parameters<typeof tradesService.create>[0]) => {
    try {
      const newTrade = await tradesService.create(tradeData);
      await fetchTrades();
      toast({ title: 'Trade recorded successfully' });
      return newTrade;
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to record trade', variant: 'destructive' });
      throw err;
    }
  }, [fetchTrades, toast]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return { trades, isLoading, error, createTrade, refetch: fetchTrades };
}
