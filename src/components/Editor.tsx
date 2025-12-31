import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Copy, Check, Maximize } from "lucide-react";
import { Button } from "./Button";

interface EditorProps {
  markdown: string;
  setMarkdown: (v: string) => void;
  setCurrentSlide: (n: number) => void;
  onClear: () => void;
  onCopy: () => void;
  onToggleFullscreen: () => void;
  isDark: boolean;
}

export function Editor({
  markdown,
  setMarkdown,
  setCurrentSlide: _setCurrentSlide, // eslint-disable-line @typescript-eslint/no-unused-vars
  onClear,
  onCopy,
  onToggleFullscreen,
  isDark,
}: EditorProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="w-full border-r flex flex-col bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700">
      <div className="px-3 sm:px-4 py-2 border-b text-sm font-medium border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs sm:text-sm">Editor</span>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              onClick={onToggleFullscreen}
              className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation flex items-center gap-1.5"
              title="Enter Fullscreen"
            >
              <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Fullscreen</span>
            </Button>
            <Button
              onClick={onClear}
              className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation"
            >
              <span className="hidden sm:inline">Clear Editor</span>
              <span className="sm:hidden">Clear</span>
            </Button>
            <Button
              onClick={handleCopy}
              className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation flex items-center gap-1.5"
              title="Copy Content"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 ease-out" />
                  <span className="hidden sm:inline transition-opacity duration-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-opacity duration-200" />
                  <span className="hidden sm:inline">Copy</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <MonacoEditor
          value={markdown}
          onChange={(value) => {
            setMarkdown(value || "");
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
