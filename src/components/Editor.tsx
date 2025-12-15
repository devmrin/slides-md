import MonacoEditor from "@monaco-editor/react";
import { Button } from "./Button";

interface EditorProps {
  markdown: string;
  setMarkdown: (v: string) => void;
  setCurrentSlide: (n: number) => void;
  onReset: () => void;
  onCopy: () => void;
  isDark: boolean;
}

export function Editor({
  markdown,
  setMarkdown,
  setCurrentSlide,
  onReset,
  onCopy,
  isDark,
}: EditorProps) {
  return (
    <div className="w-full border-r flex flex-col bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
      <div className="px-3 sm:px-4 py-2 border-b text-sm font-medium border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm">Editor</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              onClick={onReset}
              className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation"
            >
              <span className="hidden sm:inline">Reset Editor</span>
              <span className="sm:hidden">Reset</span>
            </Button>
            <Button
              onClick={onCopy}
              className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation"
            >
              <span className="hidden sm:inline">Copy Content</span>
              <span className="sm:hidden">Copy</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          value={markdown}
          onChange={(value) => {
            setMarkdown(value || "");
            setCurrentSlide(0);
          }}
          language="markdown"
          theme={isDark ? "vs-dark" : "vs"}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            folding: true,
            wordWrap: "on",
            automaticLayout: true,
            scrollBeyondLastLine: false,
            padding: { top: 8, bottom: 8 },
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}
