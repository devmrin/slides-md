import { marked } from "marked";

interface SlideProps {
  slide: string;
  isTitle?: boolean;
  frontmatter?: Record<string, string>;
}

export function Slide({ slide, isTitle, frontmatter }: SlideProps) {
  if (isTitle && frontmatter) {
    return (
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-4">{frontmatter.title}</h1>
        {frontmatter.description && (
          <p className="text-xl opacity-70 mt-6">{frontmatter.description}</p>
        )}
      </div>
    );
  }
  return (
    <div
      className="max-w-4xl w-full overflow-y-auto overflow-x-hidden"
      style={{
        maxHeight: "100%",
        fontSize: "1.25rem",
        lineHeight: "1.875rem",
        wordBreak: "break-word",
      }}
    >
      <div dangerouslySetInnerHTML={{ __html: marked(slide) }} />
    </div>
  );
}
