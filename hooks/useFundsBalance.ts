import { useState, useEffect, useCallback } from 'react';
import { fundsService } from '@/lib/services/funds.service';
import { FundsBalance } from '@/lib/types';
import { useToast } from './use-toast';

export function useFundsBalance() {
  const [balances, setBalances] = useState<FundsBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchBalances = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fundsService.getBalances();
      setBalances(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to fetch balances', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addFunds = useCallback(async (data: Parameters<typeof fundsService.addFunds>[0]) => {
    try {
      const result = await fundsService.addFunds(data);
      await fetchBalances();
      toast({ 
        title: 'Deposit successful', 
        description: 'Funds will be available for withdrawal after 2 business days.' 
      });
      return result;
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to add funds', variant: 'destructive' });
      throw err;
    }
  }, [fetchBalances, toast]);

  const withdrawFunds = useCallback(async (data: Parameters<typeof fundsService.withdrawFunds>[0]) => {
    try {
      const result = await fundsService.withdrawFunds(data);
      await fetchBalances();
      toast({ title: 'Withdrawal initiated successfully' });
      return result;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to withdraw funds';
      if (errorMsg.toLowerCase().includes('balance') || errorMsg.includes('400')) {
        toast({ 
          title: 'Insufficient balance', 
          description: 'You cannot withdraw more than your withdrawable balance (settled funds).', 
          variant: 'destructive' 
        });
      } else {
        toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
      }
      throw err;
    }
  }, [fetchBalances, toast]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  return { balances, isLoading, refetch: fetchBalances, addFunds, withdrawFunds };
}
