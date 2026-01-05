import {
  marked,
  type TokenizerExtension,
  type RendererExtension,
} from "marked";
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

// Custom extension for standalone todo items: [ ] and [x] without the - prefix
const standaloneTodoExtension: TokenizerExtension & RendererExtension = {
  name: "standaloneTodo",
  level: "block",
  start(src: string) {
    return src.match(/^(?:\[ \]|\[x\])/im)?.index;
  },
  tokenizer(src: string) {
    // Match lines starting with [ ] or [x] (case insensitive for x)
    const rule = /^(\[( |x)\]) (.+?)(?:\n|$)/i;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "standaloneTodo",
        raw: match[0],
        checked: match[2].toLowerCase() === "x",
        text: match[3].trim(),
      };
    }
    return undefined;
  },
  renderer(token) {
    const { checked, text } = token as unknown as {
      checked: boolean;
      text: string;
    };
    const checkbox = checked
      ? '<input type="checkbox" checked disabled>'
      : '<input type="checkbox" disabled>';
    return `<p class="todo-item">${checkbox} ${text}</p>\n`;
  },
};

// Custom extension for 1) style ordered lists
const parenOrderedListExtension: TokenizerExtension & RendererExtension = {
  name: "parenOrderedList",
  level: "block",
  start(src: string) {
    return src.match(/^\d+\) /m)?.index;
  },
  tokenizer(src: string) {
    // Match consecutive lines starting with number)
    const rule = /^((?:\d+\) .+(?:\n|$))+)/;
    const match = rule.exec(src);
    if (match) {
      const items = match[1]
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => {
          const itemMatch = line.match(/^\d+\) (.+)/);
          return itemMatch ? itemMatch[1] : line;
        });
      return {
        type: "parenOrderedList",
        raw: match[0],
        items,
      };
    }
    return undefined;
  },
  renderer(token) {
    const { items } = token as unknown as { items: string[] };
    const listItems = items.map((item) => `<li>${item}</li>`).join("\n");
    return `<ol>\n${listItems}\n</ol>\n`;
  },
};

// Configure marked with GFM (for - [ ] task lists) and custom extensions
marked.use({
  gfm: true,
  extensions: [standaloneTodoExtension, parenOrderedListExtension],
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
        } catch {
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
  isImageOnly?: boolean;
  frontmatter?: Record<string, string>;
  config?: {
    align?: "top" | "center" | "bottom";
    text?: "left" | "center" | "right";
    size?: "xs" | "sm" | "base" | "lg" | "xl" | "2xl";
  };
}

export function Slide({
  slide,
  isTitle,
  isImageOnly,
  frontmatter,
  config,
}: SlideProps) {
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
          <p className="text-base sm:text-xl opacity-70">
            {frontmatter.description}
          </p>
        )}
        <div className="mt-6 sm:mt-8 space-y-0.5">
          {frontmatter.presenter && (
            <p className="text-sm sm:text-lg font-medium opacity-60 italic">
              by {frontmatter.presenter}
            </p>
          )}
          {frontmatter.date && (
            <p className="text-sm sm:text-base opacity-40 -mt-1">
              {formatDate(frontmatter.date)}
            </p>
          )}
        </div>
      </div>
    );
  }
  // Apply text and size config
  const textAlign = config?.text || "left";
  const size = config?.size || "base";

  // Map size to Tailwind classes with responsive variants
  const sizeClasses = {
    xs: "text-xs sm:text-sm leading-[1.25rem] sm:leading-[1.375rem]",
    sm: "text-sm sm:text-base leading-[1.375rem] sm:leading-[1.5rem]",
    base: "text-base sm:text-xl leading-[1.5rem] sm:leading-[1.875rem]",
    lg: "text-lg sm:text-2xl leading-[1.625rem] sm:leading-[2rem]",
    xl: "text-xl sm:text-3xl leading-[1.875rem] sm:leading-[2.25rem]",
    "2xl": "text-2xl sm:text-4xl leading-[2rem] sm:leading-[2.5rem]",
  };

  // Map text alignment to Tailwind classes (can't use dynamic class names with Tailwind JIT)
  const textAlignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div
      className={`${
        isImageOnly ? "image-only-slide" : "max-w-full sm:max-w-4xl"
      } w-full ${sizeClasses[size]} ${textAlignClasses[textAlign]} break-words`}
    >
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: marked(slide || "") }}
      />
    </div>
  );
}
