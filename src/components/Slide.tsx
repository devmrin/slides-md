import { marked } from "marked";
import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import type { Tokens } from "marked";

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
      <div className="text-center max-w-full sm:max-w-4xl">
        <h1 className="text-4xl sm:text-6xl font-bold mb-3 sm:mb-4">{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="text-base sm:text-xl opacity-70 mt-4 sm:mt-6">{frontmatter.description}</p>
        )}
        {frontmatter.presenter && (
          <p className="text-sm sm:text-lg semi-bold opacity-60 mt-2">
            by {frontmatter.presenter}
          </p>
        )}
      </div>
    );
  }
  return (
    <div className="max-w-full sm:max-w-4xl w-full text-base sm:text-xl leading-[1.5rem] sm:leading-[1.875rem] break-words">
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: marked(slide) }} />
    </div>
  );
}
