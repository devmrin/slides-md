import { useMemo } from "react";
import { parseFrontmatter } from "../utils/parseFrontmatter";

export function useSlides(markdown: string) {
  return useMemo(() => {
    const { frontmatter, content } = parseFrontmatter(markdown);
    const trimmedSlides = content.split("===").map((s) => s.trim());
    // Remove trailing empty slides, but keep intentional empty slides (between two === separators)
    const contentSlides = trimmedSlides.filter((slide, index) => {
      // Keep all slides except trailing empty ones
      if (slide.length > 0) return true;
      // If empty, check if there are any non-empty slides after it
      return trimmedSlides.slice(index + 1).some((s) => s.length > 0);
    });
    const slides =
      Object.keys(frontmatter).length > 0
        ? ["__TITLE_SLIDE__", ...contentSlides]
        : contentSlides;
    return { frontmatter, slides };
  }, [markdown]);
}
