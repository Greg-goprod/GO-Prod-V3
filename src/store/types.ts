import { ThemeSlice } from './slices/themeSlice';
import { LanguageSlice } from './slices/languageSlice';
import { EventSlice } from './slices/eventSlice';
import { DataSlice } from './slices/dataSlice';
import { ViewSlice } from './slices/viewSlice';

/**
 * Type complet du store combinant tous les slices
 */
export type StoreState = ThemeSlice & LanguageSlice & EventSlice & DataSlice & ViewSlice; 