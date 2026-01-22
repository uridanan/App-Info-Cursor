import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppInfo } from '../../src/hooks/useAppInfo';
import { IApiService } from '../../src/services/IApiService';
import { AppInfo } from '../../src/types/AppInfo';

describe('useAppInfo', () => {
  const mockAppInfo: AppInfo = {
    appName: 'Test App',
    iconUrl: 'https://example.com/icon.png',
    bundleId: 'com.test.app',
    description: 'A test application',
    developer: {
      name: 'Test Developer',
      email: 'dev@test.com',
      website: 'https://test.com',
    },
  };

  const createMockApiService = (
    fetchAppInfoImpl: () => Promise<AppInfo>
  ): IApiService => ({
    fetchAppInfo: vi.fn(fetchAppInfoImpl),
  });

  it('should initialize with null appInfo and not loading', () => {
    const mockService = createMockApiService(() => Promise.resolve(mockAppInfo));
    const { result } = renderHook(() => useAppInfo(mockService));

    expect(result.current.appInfo).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set loading state when fetching', async () => {
    let resolvePromise: (value: AppInfo) => void;
    const mockService = createMockApiService(
      () => new Promise((resolve) => { resolvePromise = resolve; })
    );
    
    const { result } = renderHook(() => useAppInfo(mockService));

    act(() => {
      result.current.fetchAppInfo('https://example.com');
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePromise!(mockAppInfo);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should set appInfo on successful fetch', async () => {
    const mockService = createMockApiService(() => Promise.resolve(mockAppInfo));
    const { result } = renderHook(() => useAppInfo(mockService));

    await act(async () => {
      await result.current.fetchAppInfo('https://example.com');
    });

    expect(result.current.appInfo).toEqual(mockAppInfo);
    expect(result.current.error).toBeNull();
  });

  it('should set error on failed fetch', async () => {
    const mockService = createMockApiService(
      () => Promise.reject(new Error('App not found'))
    );
    const { result } = renderHook(() => useAppInfo(mockService));

    await act(async () => {
      await result.current.fetchAppInfo('https://example.com');
    });

    expect(result.current.appInfo).toBeNull();
    expect(result.current.error).toBe('App not found');
  });

  it('should reset state', async () => {
    const mockService = createMockApiService(() => Promise.resolve(mockAppInfo));
    const { result } = renderHook(() => useAppInfo(mockService));

    await act(async () => {
      await result.current.fetchAppInfo('https://example.com');
    });

    expect(result.current.appInfo).not.toBeNull();

    act(() => {
      result.current.reset();
    });

    expect(result.current.appInfo).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });
});
