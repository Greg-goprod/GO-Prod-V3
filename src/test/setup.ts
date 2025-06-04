import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mocking global objects
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mocking navigation API
const navigationMock = {
  serviceWorker: {
    register: vi.fn().mockResolvedValue({
      installing: null,
      waiting: null,
      active: { state: 'activated' },
      addEventListener: vi.fn(),
      updatefound: null,
      update: vi.fn(),
    }),
    getRegistration: vi.fn().mockResolvedValue(null),
    addEventListener: vi.fn(),
    controller: null,
  },
};

// Mocking matchMedia API
const matchMediaMock = () => {
  return {
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
};

// Setup global mocks
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: localStorageMock });
Object.defineProperty(window, 'navigator', { value: { ...window.navigator, ...navigationMock } });
Object.defineProperty(window, 'matchMedia', { value: vi.fn().mockImplementation(matchMediaMock) });

// Mocking fetch API
global.fetch = vi.fn();

// Reset mocks before each test
beforeEach(() => {
  vi.resetAllMocks();
}); 