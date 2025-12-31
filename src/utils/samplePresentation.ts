import seedMarkdown from "../data/seed.md?raw";

/**
 * Returns the sample presentation markdown content.
 * This is the same content used when creating a sample presentation from the home page.
 */
export function getSamplePresentationMarkdown(): string {
  return seedMarkdown;
}

