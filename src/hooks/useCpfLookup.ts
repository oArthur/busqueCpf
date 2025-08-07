import { useState, useCallback } from 'react';
import { cpfService, CpfData, CpfLookupResponse } from '@/services/cpfService';

interface UseCpfLookupReturn {
  data: CpfData | null;
  loading: boolean;
  error: string | null;
  lookupCpf: (cpf: string) => Promise<void>;
  clearData: () => void;
  validateCpf: (cpf: string) => boolean;
  formatCpf: (cpf: string) => string;
}

export const useCpfLookup = (): UseCpfLookupReturn => {
  const [data, setData] = useState<CpfData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookupCpf = useCallback(async (cpf: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: CpfLookupResponse = await cpfService.lookupCpf(cpf);
      
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Erro desconhecido');
        setData(null);
      }
    } catch (err) {
      setError('Erro ao consultar CPF');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  const validateCpf = useCallback((cpf: string) => {
    return cpfService.validateCpf(cpf);
  }, []);

  const formatCpf = useCallback((cpf: string) => {
    return cpfService.formatCpf(cpf);
  }, []);

  return {
    data,
    loading,
    error,
    lookupCpf,
    clearData,
    validateCpf,
    formatCpf
  };
};