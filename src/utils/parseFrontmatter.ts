// Utility to parse frontmatter from markdown

export interface SlideConfig {
  align?: "top" | "center" | "bottom";
  text?: "left" | "center" | "right";
  size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | number;
  animate?: "none" | "fade-in" | "slide-in" | "zoom-in" | "bounce-in" | "ease-in-out";
}

// Aliases that should be normalized to a canonical key
const keyAliases: Record<string, string> = {
  presenters: "presenter",
  author: "presenter",
  authors: "presenter",
  by: "presenter",
  subtitle: "description",
  "logo-position": "logoPosition",
  "logo-opacity": "logoOpacity",
  "logo-size": "logoSize",
};

// Config keys that should be extracted as default slide config
const configKeys = new Set(["align", "text", "size", "animate"]);

function normalizeKey(key: string): string {
  const lowercaseKey = key.toLowerCase();
  return keyAliases[lowercaseKey] ?? lowercaseKey;
}

/**
 * Validates and returns a config value if it matches the expected type
 * For size, also accepts numeric values (e.g., "14" -> 14)
 */
function validateConfigValue(key: string, value: string): string | number | undefined {
  const validValues: Record<string, string[]> = {
    align: ["top", "center", "bottom"],
    text: ["left", "center", "right"],
    size: ["xs", "sm", "base", "lg", "xl", "2xl"],
    animate: ["none", "fade-in", "slide-in", "zoom-in", "bounce-in", "ease-in-out"],
  };

  // Special handling for size: accept numeric values
  if (key === "size") {
    // Try to parse as number first
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      return numValue;
    }
    // Fall back to predefined size strings
    if (validValues.size.includes(value)) {
      return value;
    }
    return undefined;
  }

  if (validValues[key]?.includes(value)) {
    return value;
  }
  return undefined;
}

/**
 * Validates logo-specific properties
 */
function validateLogoProperty(key: string, value: string): string | number | undefined {
  if (key === "logoPosition") {
    return ["left", "right"].includes(value) ? value : undefined;
  }
  
  if (key === "logoOpacity") {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 1) {
      return numValue;
    }
    return undefined;
  }
  
  if (key === "logoSize") {
    return ["sm", "base", "lg"].includes(value) ? value : undefined;
  }
  
  return undefined;
}

export function parseFrontmatter(text: string): {
  frontmatter: Record<string, string>;
  defaultSlideConfig: SlideConfig;
  content: string;
} {
  const frontmatterRegex = /^@@@([\s\S]*?)@@@/;
  const match = text.match(frontmatterRegex);

  if (!match) return { frontmatter: {}, defaultSlideConfig: {}, content: text };

  const frontmatterText = match[1].trim();
  const content = text.replace(frontmatterRegex, "").trim();

  const frontmatter: Record<string, string> = {};
  const defaultSlideConfig: SlideConfig = {};

  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      const normalizedKey = normalizeKey(key);
      
      // Check if this is a config key
      if (configKeys.has(normalizedKey)) {
        const validatedValue = validateConfigValue(normalizedKey, value);
        if (validatedValue) {
          // Type-safe assignment for each config property
          if (normalizedKey === "align") {
            defaultSlideConfig.align = validatedValue as SlideConfig["align"];
          } else if (normalizedKey === "text") {
            defaultSlideConfig.text = validatedValue as SlideConfig["text"];
          } else if (normalizedKey === "size") {
            // size can be string or number
            defaultSlideConfig.size = validatedValue as SlideConfig["size"];
          } else if (normalizedKey === "animate") {
            defaultSlideConfig.animate = validatedValue as SlideConfig["animate"];
          }
        }
      } else if (["logoPosition", "logoOpacity", "logoSize"].includes(normalizedKey)) {
        // Logo-specific properties
        const validatedValue = validateLogoProperty(normalizedKey, value);
        if (validatedValue !== undefined) {
          frontmatter[normalizedKey] = String(validatedValue);
        }
      } else {
        // Regular frontmatter key
        frontmatter[normalizedKey] = value;
      }
    }
  });

  return { frontmatter, defaultSlideConfig, content };
}
