import { StateCreator } from 'zustand';
import { RootState } from '../store';

export interface UIState {
  // Gestion du thème
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  
  // Gestion de la langue
  language: string;
  setLanguage: (lang: string) => void;
  
  // Gestion de la sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  
  // Gestion des notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  title?: string;
  autoClose?: boolean;
  duration?: number;
}

export const createUISlice: StateCreator<RootState, [], [], UIState> = (set) => ({
  // État initial du thème (vérifier les préférences du système)
  isDarkMode: 
    typeof window !== 'undefined' 
      ? localStorage.getItem('darkMode') === 'true' || 
        (localStorage.getItem('darkMode') === null && 
        window.matchMedia('(prefers-color-scheme: dark)').matches) 
      : false,
  
  // Basculer le mode sombre
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.isDarkMode;
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Appliquer la classe dark au document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { isDarkMode: newDarkMode };
  }),
  
  // Définir le mode sombre
  setDarkMode: (isDark) => set(() => {
    localStorage.setItem('darkMode', isDark.toString());
    
    // Appliquer la classe dark au document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    return { isDarkMode: isDark };
  }),
  
  // État initial de la langue (vérifier les préférences du navigateur)
  language: 
    typeof window !== 'undefined'
      ? localStorage.getItem('i18nextLng') || 
        navigator.language.split('-')[0] || 
        'fr'
      : 'fr',
  
  // Définir la langue
  setLanguage: (lang) => set(() => {
    localStorage.setItem('i18nextLng', lang);
    return { language: lang };
  }),
  
  // État initial de la sidebar
  isSidebarOpen: 
    typeof window !== 'undefined' 
      ? localStorage.getItem('sidebarOpen') !== 'false'
      : true,
  
  // Basculer la sidebar
  toggleSidebar: () => set((state) => {
    const newSidebarOpen = !state.isSidebarOpen;
    localStorage.setItem('sidebarOpen', newSidebarOpen.toString());
    return { isSidebarOpen: newSidebarOpen };
  }),
  
  // Définir l'état de la sidebar
  setSidebarOpen: (isOpen) => set(() => {
    localStorage.setItem('sidebarOpen', isOpen.toString());
    return { isSidebarOpen: isOpen };
  }),
  
  // État initial des notifications
  notifications: [],
  
  // Ajouter une notification
  addNotification: (notification) => set((state) => ({
    notifications: [
      ...state.notifications,
      { 
        id: Date.now().toString(), 
        ...notification 
      }
    ]
  })),
  
  // Supprimer une notification
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),
  
  // Supprimer toutes les notifications
  clearNotifications: () => set({ notifications: [] }),
}); 