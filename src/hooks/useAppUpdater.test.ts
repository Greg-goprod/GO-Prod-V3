import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppUpdater } from './useAppUpdater';

// Mock pour ServiceWorkerRegistration
const mockRegistration = {
  waiting: { postMessage: vi.fn() },
  installing: { addEventListener: vi.fn() },
  update: vi.fn().mockResolvedValue(undefined),
  addEventListener: vi.fn(),
};

describe('useAppUpdater Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock pour navigator.serviceWorker.getRegistration
    navigator.serviceWorker.getRegistration = vi.fn().mockResolvedValue(mockRegistration);
  });

  it('initializes with default values', async () => {
    const { result } = renderHook(() => useAppUpdater());
    
    expect(result.current.updateStatus).toBe('idle');
    expect(result.current.updateError).toBeNull();
    expect(result.current.hasUpdate).toBe(false);
  });

  it('checks for updates correctly', async () => {
    const { result } = renderHook(() => useAppUpdater());
    
    // Forcer la mise à jour du hook
    await act(async () => {
      // Simuler une récupération d'enregistrement
      await navigator.serviceWorker.getRegistration();
    });
    
    // Appeler checkForUpdates
    await act(async () => {
      await result.current.checkForUpdates();
    });
    
    expect(mockRegistration.update).toHaveBeenCalled();
    expect(result.current.updateStatus).toBe('checking');
  });

  it('applies update correctly', async () => {
    const { result } = renderHook(() => useAppUpdater());
    
    // Forcer la mise à jour du hook
    await act(async () => {
      // Simuler une récupération d'enregistrement
      await navigator.serviceWorker.getRegistration();
    });
    
    // Appeler applyUpdate
    act(() => {
      result.current.applyUpdate();
    });
    
    expect(mockRegistration.waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });
    expect(result.current.updateStatus).toBe('installing');
  });

  it('resets update status correctly', async () => {
    const { result } = renderHook(() => useAppUpdater());
    
    // Forcer un statut non-idle
    await act(async () => {
      // Simuler une mise à jour disponible
      await navigator.serviceWorker.getRegistration();
      result.current.checkForUpdates();
    });
    
    // Réinitialiser le statut
    act(() => {
      result.current.resetUpdateStatus();
    });
    
    expect(result.current.updateStatus).toBe('idle');
    expect(result.current.updateError).toBeNull();
  });
}); 