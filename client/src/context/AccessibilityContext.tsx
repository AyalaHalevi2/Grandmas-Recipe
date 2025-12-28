import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

// ============================================
// Accessibility Settings Types
// ============================================

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: number; // Scale factor: 1 = 100%, 1.25 = 125%, etc.
  highlightLinks: boolean;
  reducedMotion: boolean;
  dyslexicFont: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleHighContrast: () => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  resetFontSize: () => void;
  toggleHighlightLinks: () => void;
  toggleReducedMotion: () => void;
  toggleDyslexicFont: () => void;
  resetAllSettings: () => void;
}

// ============================================
// Default Settings
// ============================================

const DEFAULT_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  fontSize: 1,
  highlightLinks: false,
  reducedMotion: false,
  dyslexicFont: false,
};

const STORAGE_KEY = 'grandmas-recipes-a11y-settings';
const MIN_FONT_SIZE = 0.8;
const MAX_FONT_SIZE = 1.5;
const FONT_SIZE_STEP = 0.1;

// ============================================
// Context Creation
// ============================================

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// ============================================
// Load/Save from localStorage
// ============================================

function loadSettings(): AccessibilitySettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<AccessibilitySettings>;
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (error) {
    console.warn('Failed to load accessibility settings:', error);
  }
  return DEFAULT_SETTINGS;
}

function saveSettings(settings: AccessibilitySettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Failed to save accessibility settings:', error);
  }
}

// ============================================
// Apply Settings to DOM
// ============================================

function applySettingsToDOM(settings: AccessibilitySettings): void {
  const html = document.documentElement;
  const body = document.body;

  // High Contrast Mode
  if (settings.highContrast) {
    body.classList.add('a11y-high-contrast');
  } else {
    body.classList.remove('a11y-high-contrast');
  }

  // Font Size (using CSS custom property)
  html.style.setProperty('--a11y-font-scale', settings.fontSize.toString());
  html.style.fontSize = `${16 * settings.fontSize}px`;

  // Highlight Links
  if (settings.highlightLinks) {
    body.classList.add('a11y-highlight-links');
  } else {
    body.classList.remove('a11y-highlight-links');
  }

  // Reduced Motion
  if (settings.reducedMotion) {
    body.classList.add('a11y-reduced-motion');
  } else {
    body.classList.remove('a11y-reduced-motion');
  }

  // Dyslexic Font
  if (settings.dyslexicFont) {
    body.classList.add('a11y-dyslexic-font');
  } else {
    body.classList.remove('a11y-dyslexic-font');
  }
}

// ============================================
// Provider Component
// ============================================

interface AccessibilityProviderProps {
  children: ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps): React.ReactElement {
  const [settings, setSettings] = useState<AccessibilitySettings>(loadSettings);

  // Apply settings to DOM whenever they change
  useEffect(() => {
    applySettingsToDOM(settings);
    saveSettings(settings);
  }, [settings]);

  // Check for system preference on mount
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !settings.reducedMotion) {
      setSettings(prev => ({ ...prev, reducedMotion: true }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleHighContrast = useCallback(() => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  }, []);

  const increaseFontSize = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.min(prev.fontSize + FONT_SIZE_STEP, MAX_FONT_SIZE),
    }));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      fontSize: Math.max(prev.fontSize - FONT_SIZE_STEP, MIN_FONT_SIZE),
    }));
  }, []);

  const resetFontSize = useCallback(() => {
    setSettings(prev => ({ ...prev, fontSize: 1 }));
  }, []);

  const toggleHighlightLinks = useCallback(() => {
    setSettings(prev => ({ ...prev, highlightLinks: !prev.highlightLinks }));
  }, []);

  const toggleReducedMotion = useCallback(() => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  }, []);

  const toggleDyslexicFont = useCallback(() => {
    setSettings(prev => ({ ...prev, dyslexicFont: !prev.dyslexicFont }));
  }, []);

  const resetAllSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const contextValue: AccessibilityContextType = {
    settings,
    toggleHighContrast,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    toggleHighlightLinks,
    toggleReducedMotion,
    toggleDyslexicFont,
    resetAllSettings,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}

// ============================================
// Custom Hook
// ============================================

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

export default AccessibilityContext;
