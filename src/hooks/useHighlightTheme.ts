import { useEffect } from "react";
import hljs from "highlight.js";

/**
 * Hook to dynamically load highlight.js theme CSS based on dark mode
 * INVERTED: Uses atom-one-light for dark mode and atom-one-dark for light mode
 * This provides better contrast - light code on dark background, dark code on light background
 * 
 * This hook manages a single link tag in the document head that points to the
 * appropriate highlight.js theme CSS file. The href is updated when theme changes.
 * 
 * CSS files are served from /hljs-themes/ (copied to public directory)
 * 
 * After the CSS loads, we re-run highlight.js on all code blocks to ensure
 * the new theme styles are applied to already-highlighted code.
 */
export function useHighlightTheme(isDark: boolean) {
  useEffect(() => {
    // Inverted: dark mode app → light theme code, light mode app → dark theme code
    const themeName = isDark ? "atom-one-light" : "atom-one-dark";
    
    // Find existing link element (might have been created by HTML script or previous render)
    // Remove ALL links with this ID (in case of duplicates from rapid changes)
    const existingLinks = document.querySelectorAll('link#hljs-theme');
    existingLinks.forEach(link => link.remove());
    
    // Create new link element with the correct theme
    const themeLink = document.createElement("link");
    themeLink.id = "hljs-theme";
    themeLink.rel = "stylesheet";
    themeLink.type = "text/css";
    themeLink.href = `/hljs-themes/${themeName}.min.css`;
    themeLink.setAttribute("data-theme", themeName);
    
    // After CSS loads, re-highlight all code blocks to apply new theme styles
    themeLink.onload = () => {
      document.querySelectorAll("pre code").forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    };
    
    // Append to head
    document.head.appendChild(themeLink);
    
    // Cleanup: remove link element when effect re-runs or component unmounts
    return () => {
      // Remove the link we just created (or any with this ID)
      const linkToRemove = document.getElementById("hljs-theme");
      if (linkToRemove) {
        linkToRemove.remove();
      }
    };
  }, [isDark]);
}

