import { useMemo } from "react";
import { parseFrontmatter } from "../utils/parseFrontmatter";

export function useSlides(markdown: string) {
  return useMemo(() => {
    const { frontmatter, content } = parseFrontmatter(markdown);
    const contentSlides = content.split("===").map((s) => s.trim());
    const slides =
      Object.keys(frontmatter).length > 0
        ? ["__TITLE_SLIDE__", ...contentSlides]
        : contentSlides;
    return { frontmatter, slides };
  }, [markdown]);
}
