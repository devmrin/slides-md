interface EditorProps {
  markdown: string;
  setMarkdown: (v: string) => void;
  setCurrentSlide: (n: number) => void;
  textColor: string;
  bgColor: string;
  onReset: () => void;
  onCopy: () => void;
}

export function Editor({
  markdown,
  setMarkdown,
  setCurrentSlide,
  textColor,
  bgColor,
  onReset,
  onCopy,
}: EditorProps) {
  return (
    <div
      className="w-1/2 border-r flex flex-col"
      style={{ backgroundColor: bgColor, borderColor: textColor + "20" }}
    >
      <div
        className="px-4 py-2 border-b text-sm font-medium"
        style={{ borderColor: textColor + "20" }}
      >
        <div className="flex items-center justify-between">
          Editor
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-3 py-1 text-xs border rounded"
              style={{ borderColor: textColor + "40", color: textColor }}
            >
              Reset Editor
            </button>
            <button
              onClick={onCopy}
              className="px-2 py-[2px] text-xs border rounded"
              style={{
                borderColor: textColor + "40",
                color: textColor,
                backgroundColor: bgColor,
              }}
            >
              Copy Content
            </button>
          </div>
        </div>
      </div>
      <textarea
        value={markdown}
        onChange={(e) => {
          setMarkdown(e.target.value);
          setCurrentSlide(0);
        }}
        className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none"
        style={{ backgroundColor: bgColor, color: textColor }}
      />
    </div>
  );
}
