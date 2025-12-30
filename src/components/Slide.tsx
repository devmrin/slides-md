import { marked } from "marked";
import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import type { Tokens } from "marked";
import { format } from "date-fns";

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return format(new Date(), "d MMM, yyyy");
    return format(date, "d MMM, yyyy");
  } catch {
    return format(new Date(), "d MMM, yyyy");
  }
}

// Configure marked to use highlight.js for code blocks
marked.use({
  renderer: {
    code(token: Tokens.Code) {
      const codeStr = token.text;
      const lang = token.lang;
      
      if (lang && hljs.getLanguage(lang)) {
        try {
          const result = hljs.highlight(codeStr, { language: lang });
          // Extract inner HTML from highlight.js output
          const match = result.value.match(/<code[^>]*>(.*?)<\/code>/s);
          const highlighted = match ? match[1] : result.value;
          return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`;
        } catch (err) {
          // Fall through to auto-detection
        }
      }
      // Auto-detect language
      const result = hljs.highlightAuto(codeStr);
      const match = result.value.match(/<code[^>]*>(.*?)<\/code>/s);
      const highlighted = match ? match[1] : result.value;
      return `<pre><code class="hljs">${highlighted}</code></pre>`;
    },
  },
});

interface SlideProps {
  slide: string;
  isTitle?: boolean;
  frontmatter?: Record<string, string>;
}

export function Slide({ slide, isTitle, frontmatter }: SlideProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add hljs class to code blocks and highlight them after rendering
    if (contentRef.current) {
      contentRef.current.querySelectorAll("pre code").forEach((block) => {
        const codeElement = block as HTMLElement;
        if (!codeElement.classList.contains("hljs")) {
          codeElement.classList.add("hljs");
          hljs.highlightElement(codeElement);
        }
      });
    }
  }, [slide]);

  if (isTitle && frontmatter) {
    return (
      <div className="text-center max-w-full sm:max-w-4xl flex flex-col items-center">
        <h1 className="text-4xl sm:text-6xl font-bold">{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="text-base sm:text-xl opacity-70 mt-4 sm:mt-5">{frontmatter.description}</p>
        )}
        <div className="mt-8 sm:mt-10 space-y-1">
          {frontmatter.presenter && (
            <p className="text-sm sm:text-lg font-medium opacity-60">
              by {frontmatter.presenter}
            </p>
          )}
          {frontmatter.date && (
            <p className="text-sm sm:text-base italic opacity-40 tracking-wide">{formatDate(frontmatter.date)}</p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-full sm:max-w-4xl w-full text-base sm:text-xl leading-[1.5rem] sm:leading-[1.875rem] break-words">
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: marked(slide || "") }} />
    </div>
  );
}
