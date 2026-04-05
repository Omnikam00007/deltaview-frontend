import { useState, useEffect, useCallback } from 'react';
import { analyticsService } from '@/lib/services/analytics.service';
import { RealizedPnl, TaxSummary } from '@/lib/types';
import { useToast } from './use-toast';

export function useRealizedPnL(params?: {
  instrument_id?: string;
  tax_category?: string;
  financial_year?: string;
  start_date?: string;
  end_date?: string;
}) {
  const [realizedPnL, setRealizedPnL] = useState<RealizedPnl[]>([]);
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pnl, tax] = await Promise.all([
        analyticsService.listRealizedPnl(params),
        analyticsService.getTaxSummary(params?.financial_year),
      ]);
      setRealizedPnL(pnl);
      setTaxSummary(tax);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to fetch analytics data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [params, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { realizedPnL, taxSummary, isLoading, refetch: fetchData };
}
