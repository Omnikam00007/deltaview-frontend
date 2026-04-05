import { useState, useCallback } from 'react';
import { instrumentsService } from '@/lib/services/instruments.service';
import { Instrument } from '@/lib/types';
import { useToast } from './use-toast';

export function useInstruments() {
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const searchInstruments = useCallback(async (query: string, params?: { exchange?: string; segment?: string }) => {
    if (!query) {
      setInstruments([]);
      return;
    }
    
    setIsSearching(true);
    try {
      const data = await instrumentsService.search(query, params);
      setInstruments(data);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to search instruments', variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const createInstrument = useCallback(async (instrumentData: Partial<Instrument>) => {
    try {
      const newInstrument = await instrumentsService.create(instrumentData);
      toast({ title: 'Instrument created' });
      return newInstrument;
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to create instrument', variant: 'destructive' });
      throw err;
    }
  }, [toast]);

  return { instruments, isSearching, searchInstruments, createInstrument };
}
