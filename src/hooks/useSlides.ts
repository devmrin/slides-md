import { useMemo } from "react";
import { parseFrontmatter } from "../utils/parseFrontmatter";

/**
 * Detects if a slide contains only an image (and no other content)
 * Checks if the slide content is just an image markdown syntax: ![alt](url) or <img>
 * Also handles cases where the image might be wrapped in a paragraph tag by markdown parser
 */
function isImageOnlySlide(slide: string): boolean {
  const trimmed = slide.trim();
  if (!trimmed) return false;

  // Remove common markdown wrapper tags that might be added by the parser
  // e.g., <p>![alt](url)</p> or <p><img ... /></p>
  const withoutParagraphs = trimmed
    .replace(/^<p>\s*/i, '')
    .replace(/\s*<\/p>$/i, '')
    .trim();

  // Match markdown image syntax: ![alt](url) or ![alt](url "title")
  // Allow optional whitespace before/after
  const markdownImageRegex = /^\s*!\[.*?\]\(.+?\)(?:\s*"[\s\S]*?")?\s*$/;
  
  // Match HTML img tag: <img src="..." alt="..." /> or <img ...>
  const htmlImageRegex = /^\s*<img[\s\S]*?\/?>\s*$/i;
  
  // Check if the slide is only whitespace and an image
  return markdownImageRegex.test(withoutParagraphs) || htmlImageRegex.test(withoutParagraphs);
}

export function useSlides(markdown: string) {
  return useMemo(() => {
    const { frontmatter, content } = parseFrontmatter(markdown);
    const trimmedSlides = content.split("===").map((s) => s.trim());
    // Remove leading and trailing empty slides, but keep intentional empty slides (between two === separators)
    const contentSlides = trimmedSlides.filter((slide, index) => {
      // Keep all slides except leading/trailing empty ones
      if (slide.length > 0) return true;
      // If empty, check if there are any non-empty slides both before AND after it
      const hasContentBefore = trimmedSlides.slice(0, index).some((s) => s.length > 0);
      const hasContentAfter = trimmedSlides.slice(index + 1).some((s) => s.length > 0);
      return hasContentBefore && hasContentAfter;
    });
    const slides =
      Object.keys(frontmatter).length > 0
        ? ["__TITLE_SLIDE__", ...contentSlides]
        : contentSlides;
    
    // Detect image-only slides
    const imageOnlySlides = new Set<number>();
    slides.forEach((slide, index) => {
      if (slide !== "__TITLE_SLIDE__" && isImageOnlySlide(slide)) {
        imageOnlySlides.add(index);
      }
    });
    
    return { frontmatter, slides, imageOnlySlides };
  }, [markdown]);
}
