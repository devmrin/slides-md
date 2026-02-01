import { useEffect } from "react";

const STYLE_ID = "hide-monaco-context-view";

/**
 * Hides Monaco's context-view element (hover/context UI) while the component is mounted.
 * Removes the style on unmount.
 */
export function useHideMonacoContextView(): void {
  useEffect(() => {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `.context-view.monaco-component { display: none !important; }`;
    document.head.appendChild(style);
    return () => {
      document.getElementById(STYLE_ID)?.remove();
    };
  }, []);
}
