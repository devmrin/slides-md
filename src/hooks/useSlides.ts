import { useMemo } from "react";
import { parseFrontmatter } from "../utils/parseFrontmatter";

export interface SlideConfig {
  align?: "top" | "center" | "bottom";
  text?: "left" | "center" | "right";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | number;
  animate?: "none" | "fade-in" | "slide-in" | "zoom-in" | "bounce-in" | "ease-in-out";
}

/**
 * Parses slide delimiter attributes from a line like:
 * === align=top text=right size=sm
 * Returns parsed config or empty object if no valid attributes found
 */
function parseSlideConfig(delimiterLine: string): SlideConfig {
  const config: SlideConfig = {};
  
  // Match key=value pairs in the delimiter line
  const attrRegex = /(\w+)=([\w-]+)/g;
  let match;
  
  while ((match = attrRegex.exec(delimiterLine)) !== null) {
    const key = match[1];
    const value = match[2];
    
    if (key === "align" && ["top", "center", "bottom"].includes(value)) {
      config.align = value as SlideConfig["align"];
    } else if (key === "text" && ["left", "center", "right"].includes(value)) {
      config.text = value as SlideConfig["text"];
    } else if (key === "size") {
      // Try to parse as number first
      const numValue = parseInt(value, 10);
      if (!isNaN(numValue) && numValue > 0) {
        config.size = numValue;
      } else if (["xs", "sm", "base", "lg", "xl", "2xl"].includes(value)) {
        config.size = value as SlideConfig["size"];
      }
      // If neither numeric nor valid string, skip (fallback to default)
    } else if (key === "animate" && ["none", "fade-in", "slide-in", "zoom-in", "bounce-in", "ease-in-out"].includes(value)) {
      config.animate = value as SlideConfig["animate"];
    }
  }
  
  return config;
}

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

function splitSlidesWithConfigs(
  content: string,
  defaultSlideConfig: SlideConfig,
): { slides: string[]; slideConfigs: SlideConfig[] } {
  const normalized = content.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");

  const slides: string[] = [];
  const slideConfigs: SlideConfig[] = [];

  let currentSlideLines: string[] = [];
  let currentConfig: SlideConfig = {};

  let inFence = false;
  let fenceChar: "`" | "~" | null = null;
  let fenceLen = 0;

  const flushSlide = () => {
    const slideText = currentSlideLines.join("\n").trim();
    if (slideText.length > 0 || slides.length > 0) {
      slides.push(slideText);
      slideConfigs.push({ ...defaultSlideConfig, ...currentConfig });
    }
    currentSlideLines = [];
  };

  for (const line of lines) {
    const fenceMatch = line.match(/^\s*(```+|~~~+)(.*)$/);
    if (fenceMatch) {
      const fence = fenceMatch[1];
      const char = fence[0] as "`" | "~";

      if (!inFence) {
        inFence = true;
        fenceChar = char;
        fenceLen = fence.length;
      } else if (fenceChar === char && fence.length >= fenceLen) {
        inFence = false;
        fenceChar = null;
        fenceLen = 0;
      }

      currentSlideLines.push(line);
      continue;
    }

    const isDelimiterLine = !inFence && /^\s*===(?:\s+.*)?\s*$/.test(line);
    if (isDelimiterLine) {
      flushSlide();
      currentConfig = parseSlideConfig(line.trim());
      continue;
    }

    currentSlideLines.push(line);
  }

  // Add the last slide
  flushSlide();

  return { slides, slideConfigs };
}

export function useSlides(markdown: string) {
  return useMemo(() => {
    const { frontmatter, defaultSlideConfig, content } = parseFrontmatter(markdown);

    const { slides, slideConfigs } = splitSlidesWithConfigs(content, defaultSlideConfig);
    
    // Remove leading and trailing empty slides, but keep intentional empty slides
    const filteredIndices: number[] = [];
    slides.forEach((slide, index) => {
      if (slide.length > 0) {
        filteredIndices.push(index);
      } else {
        // Keep empty slides that have content before and after
        const hasContentBefore = slides.slice(0, index).some((s) => s.length > 0);
        const hasContentAfter = slides.slice(index + 1).some((s) => s.length > 0);
        if (hasContentBefore && hasContentAfter) {
          filteredIndices.push(index);
        }
      }
    });
    
    const contentSlides = filteredIndices.map((i) => slides[i]);
    const contentConfigs = filteredIndices.map((i) => slideConfigs[i]);
    
    // Add title slide if frontmatter exists
    const finalSlides =
      Object.keys(frontmatter).length > 0
        ? ["__TITLE_SLIDE__", ...contentSlides]
        : contentSlides;
    
    const finalConfigs =
      Object.keys(frontmatter).length > 0
        ? [{}, ...contentConfigs] // Title slide gets empty config (ignores defaults)
        : contentConfigs;
    
    // Detect image-only slides
    const imageOnlySlides = new Set<number>();
    finalSlides.forEach((slide, index) => {
      if (slide !== "__TITLE_SLIDE__" && isImageOnlySlide(slide)) {
        imageOnlySlides.add(index);
      }
    });
    
    return { frontmatter, slides: finalSlides, slideConfigs: finalConfigs, imageOnlySlides };
  }, [markdown]);
}
