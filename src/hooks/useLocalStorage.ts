import { useState, useEffect, useCallback, useRef, type Dispatch, type SetStateAction } from "react";

const STORAGE_KEY = "slides-md-user-preferences";

/**
 * User preferences stored in localStorage.
 * All user preferences are stored under a single key as an object.
 */
export interface UserPreferences {
  theme?: boolean;
  [key: string]: unknown;
}

/**
 * Get user preferences from localStorage.
 * Returns an empty object if not found or on error.
 */
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

/**
 * Save user preferences to localStorage.
 */
function setStoredPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
}

/**
 * Hook to access and update user preferences stored in localStorage.
 * All preferences are stored under a single "userPreferences" object.
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage("theme", false);
 * // Stores: { theme: false, ...otherPrefs }
 * 
 * @param key - The preference key (e.g., "theme")
 * @param defaultValue - Default value if the key doesn't exist
 * @returns A tuple of [value, setValue] similar to useState
 */
export function useLocalStorage<T extends keyof UserPreferences>(
  key: T,
  defaultValue: UserPreferences[T]
): [UserPreferences[T], Dispatch<SetStateAction<UserPreferences[T]>>] {
  const isFirstRender = useRef(true);
  
  const [value, setValue] = useState<UserPreferences[T]>(() => {
    const stored = getStoredPreferences();
    return stored[key] !== undefined ? (stored[key] as UserPreferences[T]) : defaultValue;
  });

  useEffect(() => {
    // Skip saving on initial mount to avoid overwriting with default value
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    // Update the userPreferences object with the new value
    const stored = getStoredPreferences();
    stored[key] = value as UserPreferences[typeof key];
    setStoredPreferences(stored);
  }, [key, value]);

  const setStoredValue: Dispatch<SetStateAction<UserPreferences[T]>> = useCallback((newValue) => {
    setValue(newValue);
  }, []);

  return [value, setStoredValue];
}

