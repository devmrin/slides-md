import { useRef, useEffect } from "react";
import MonacoEditor from "@monaco-editor/react";
import { Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { useFullscreen } from "../hooks/useFullscreen";

interface FullscreenEditorProps {
  markdown: string;
  setMarkdown: (v: string) => void;
  setCurrentSlide: (n: number) => void;
  onClear: () => void;
  onCopy: () => void;
  setIsEditorFullscreen: (value: boolean) => void;
  isDark: boolean;
  isEditorFullscreen: boolean;
}

export function FullscreenEditor({
  markdown,
  setMarkdown,
  onClear,
  onCopy,
  setIsEditorFullscreen,
  isDark,
  isEditorFullscreen,
}: FullscreenEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRequestedFullscreen = useRef(false);
  const { requestFullscreenOnly } = useFullscreen(
    containerRef,
    isEditorFullscreen,
    setIsEditorFullscreen,
  );

  // Request fullscreen when component mounts with isEditorFullscreen=true
  useEffect(() => {
    if (
      isEditorFullscreen &&
      containerRef.current &&
      !hasRequestedFullscreen.current
    ) {
      hasRequestedFullscreen.current = true;
      requestFullscreenOnly();
    }
  }, [isEditorFullscreen, requestFullscreenOnly]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100"
    >
      {/* Top bar for exit, clear, and copy */}
      <div className="w-full flex justify-between items-start px-4 pt-3 sm:px-6 sm:pt-4 z-10 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <Button
          btnType="secondary"
          className="px-3 py-1.5 sm:py-1 text-sm touch-manipulation"
          onClick={() => setIsEditorFullscreen(false)}
        >
          Exit{" "}
          <span className="ml-1 text-xs opacity-70 hidden sm:inline">
            (ESC)
          </span>
        </Button>
        <div className="flex gap-2 pb-3 sm:pb-4">
          <Button
            btnType="secondary"
            className="px-3 py-1.5 sm:py-1 text-sm touch-manipulation"
            onClick={onCopy}
          >
            Copy{" "}
            <span className="ml-1 text-xs opacity-70 hidden sm:inline">
              Current Content
            </span>
          </Button>
          <Button
            btnType="secondary"
            className="px-3 py-1.5 sm:py-1 text-sm touch-manipulation flex items-center gap-1.5"
            onClick={onClear}
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </Button>
        </div>
      </div>
      {/* Editor area */}
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
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}
