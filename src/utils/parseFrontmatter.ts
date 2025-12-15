// Utility to parse frontmatter from markdown
export function parseFrontmatter(text: string): {
  frontmatter: Record<string, string>;
  content: string;
} {
  const frontmatterRegex = /^===\/===([\s\S]*?)===\/===/;
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
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content };
}
