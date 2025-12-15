import { useState, useEffect, useCallback, useRef } from "react";

const STORAGE_KEY = "slides-md-user-preferences";

interface UserPreferences {
  theme?: boolean;
  [key: string]: unknown;
}

function getStoredPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as UserPreferences;
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
  return {};
}

function setStoredPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
}

export function useLocalStorage<T extends keyof UserPreferences>(
  key: T,
  defaultValue: UserPreferences[T]
): [UserPreferences[T], (value: UserPreferences[T]) => void] {
  const isFirstRender = useRef(true);
  
  const [value, setValue] = useState<UserPreferences[T]>(() => {
    const stored = getStoredPreferences();
    return stored[key] !== undefined ? (stored[key] as UserPreferences[T]) : defaultValue;
  });

  useEffect(() => {
    // Skip saving on initial mount
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const stored = getStoredPreferences();
    stored[key] = value as UserPreferences[typeof key];
    setStoredPreferences(stored);
  }, [key, value]);

  const setStoredValue = useCallback((newValue: UserPreferences[T]) => {
    setValue(newValue);
  }, []);

  return [value, setStoredValue];
}

