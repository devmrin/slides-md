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
    <div className="w-1/2 border-r flex flex-col bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
      <div className="px-4 py-2 border-b text-sm font-medium border-gray-300 dark:border-gray-700">
        <div className="flex items-center justify-between">
          Editor
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Reset Editor
            </button>
            <button
              onClick={onCopy}
              className="px-2 py-[2px] text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800"
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
        className="flex-1 p-4 font-mono text-sm resize-none focus:outline-none bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
      />
    </div>
  );
}
