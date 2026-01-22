import { useState, useCallback } from 'react';
import { AppInfo } from '../types/AppInfo';
import { IApiService } from '../services/IApiService';

/**
 * State for the useAppInfo hook.
 */
export interface UseAppInfoState {
  appInfo: AppInfo | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Return type for the useAppInfo hook.
 */
export interface UseAppInfoReturn extends UseAppInfoState {
  fetchAppInfo: (url: string) => Promise<void>;
  reset: () => void;
}

/**
 * Custom hook for fetching app information.
 * @param apiService - The API service to use
 */
export function useAppInfo(apiService: IApiService): UseAppInfoReturn {
  const [state, setState] = useState<UseAppInfoState>({
    appInfo: null,
    isLoading: false,
    error: null,
  });

  const fetchAppInfo = useCallback(async (url: string): Promise<void> => {
    setState({ appInfo: null, isLoading: true, error: null });

    try {
      const appInfo = await apiService.fetchAppInfo(url);
      setState({ appInfo, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setState({ appInfo: null, isLoading: false, error: message });
    }
  }, [apiService]);

  const reset = useCallback((): void => {
    setState({ appInfo: null, isLoading: false, error: null });
  }, []);

  return {
    ...state,
    fetchAppInfo,
    reset,
  };
}
