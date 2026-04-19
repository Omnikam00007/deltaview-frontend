import { useState, useEffect, useCallback } from 'react';
import { holdingsService } from '@/lib/services/holdings.service';
import { ConsolidatedHolding } from '@/lib/types';
import { useToast } from './use-toast';

export function useHoldings() {
  const [holdings, setHoldings] = useState<ConsolidatedHolding[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchHoldings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await holdingsService.listConsolidated();
      setHoldings(data);
      setError(null);
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch holdings';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshPrices = useCallback(async () => {
    try {
      await holdingsService.refreshPrices();
      await fetchHoldings();
      toast({ title: 'Prices refreshed', description: 'Latest market prices loaded' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to refresh prices', variant: 'destructive' });
    }
  }, [fetchHoldings, toast]);

  const deleteHolding = useCallback(async (id: string) => {
    try {
      await holdingsService.remove(id);
      await fetchHoldings();
      toast({ title: 'Holding deleted' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  }, [fetchHoldings, toast]);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  return { holdings, isLoading, error, refreshPrices, deleteHolding, refetch: fetchHoldings };
}
