import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StoreState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  toggleDarkMode: () => void;
  toggleSidebar: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      isSidebarOpen: true,

      toggleDarkMode: () => {
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          
          // Appliquer le thème au document
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
          return { isDarkMode: newDarkMode };
        });
      },

      toggleSidebar: () => {
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
      },
    }),
    {
      name: 'go-prod-settings', // Nom du storage dans localStorage
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        isSidebarOpen: state.isSidebarOpen,
      }),
    }
  )
);

// Initialisation du thème au chargement
if (typeof window !== 'undefined') {
  const isDarkMode = useStore.getState().isDarkMode;
  if (isDarkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}