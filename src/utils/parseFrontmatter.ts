// Utility to parse frontmatter from markdown

// Aliases that should be normalized to a canonical key
const keyAliases: Record<string, string> = {
  presenters: "presenter",
  author: "presenter",
  authors: "presenter",
  by: "presenter",
  subtitle: "description",
};

function normalizeKey(key: string): string {
  const lowercaseKey = key.toLowerCase();
  return keyAliases[lowercaseKey] ?? lowercaseKey;
}

export function parseFrontmatter(text: string): {
  frontmatter: Record<string, string>;
  content: string;
} {
  const frontmatterRegex = /^@@@([\s\S]*?)@@@/;
  const match = text.match(frontmatterRegex);

  if (!match) return { frontmatter: {}, content: text };

  const frontmatterText = match[1].trim();
  const content = text.replace(frontmatterRegex, "").trim();

  const frontmatter: Record<string, string> = {};

  frontmatterText.split("\n").forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex > -1) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      const normalizedKey = normalizeKey(key);
      frontmatter[normalizedKey] = value;
    }
  });

  return { frontmatter, content };
}
