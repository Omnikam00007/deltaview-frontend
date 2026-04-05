import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/lib/services/analytics.service';
import { DailyPnl } from '@/lib/types';
import { useToast } from './use-toast';

export function useDailyPnL(params?: { start_date?: string; end_date?: string; segment?: string }) {
  const [dailyPnL, setDailyPnL] = useState<DailyPnl[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchDailyPnL = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await analyticsService.listDailyPnl(params);
      setDailyPnL(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to fetch Daily P&L', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [params, toast]);

  useEffect(() => {
    fetchDailyPnL();
  }, [fetchDailyPnL]);

  return { dailyPnL, isLoading, refetch: fetchDailyPnL };
}
