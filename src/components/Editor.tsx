interface EditorProps {
  markdown: string;
  setMarkdown: (v: string) => void;
  setCurrentSlide: (n: number) => void;
  onReset: () => void;
  onCopy: () => void;
}

export function Editor({
  markdown,
  setMarkdown,
  setCurrentSlide,
  onReset,
  onCopy,
}: EditorProps) {
  return (
    <div className="w-1/2 border-r flex flex-col bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-white/20">
      <div className="px-4 py-2 border-b text-sm font-medium border-gray-200 dark:border-white/20">
        <div className="flex items-center justify-between">
          Editor
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-3 py-1 text-xs border rounded border-gray-400 dark:border-white/40 text-gray-900 dark:text-white bg-white dark:bg-[#1a1a1a]"
            >
              Reset Editor
            </button>
            <button
              onClick={onCopy}
              className="px-2 py-[2px] text-xs border rounded border-gray-400 dark:border-white/40 text-gray-900 dark:text-white bg-white dark:bg-[#1a1a1a]"
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
        className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
      />
    </div>
  );
}
