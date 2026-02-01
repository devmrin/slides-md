/**
 * Extracts image URLs from markdown for preloading.
 * Only returns http/https/data URLs; media:// URLs are excluded (they are
 * resolved from IndexedDB per-slide and don't benefit from link preload).
 */
export function getImageUrlsFromMarkdown(markdown: string): string[] {
  const urls: string[] = [];
  const regex = /!\[[^\]]*\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(markdown)) !== null) {
    const url = match[1].trim();
    if (url.startsWith("media://")) continue;
    urls.push(url);
  }
  return urls;
}
