import { useRef, useEffect, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { format } from "date-fns";
import { MoreVertical, Trash2, FileText, Check } from "lucide-react";
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
  setCurrentSlide: _setCurrentSlide, // eslint-disable-line @typescript-eslint/no-unused-vars
  onClear,
  onCopy,
  setIsEditorFullscreen,
  isDark,
  isEditorFullscreen,
}: FullscreenEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRequestedFullscreen = useRef(false);
  const { requestFullscreenOnly } = useFullscreen(containerRef, isEditorFullscreen, setIsEditorFullscreen);
  const [isSampleCopied, setIsSampleCopied] = useState(false);

  const handleCopySampleFrontmatter = () => {
    const sampleFrontmatter = `===/===
title: Sample presentation
description: Add presentation description
date: ${format(new Date(), "yyyyMMdd")}
presenter: My team
===/===
`;
    navigator.clipboard.writeText(sampleFrontmatter);
    setIsSampleCopied(true);
    setTimeout(() => setIsSampleCopied(false), 2000);
  };

  // Request fullscreen when component mounts with isEditorFullscreen=true
  useEffect(() => {
    if (isEditorFullscreen && containerRef.current && !hasRequestedFullscreen.current) {
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
          Exit <span className="ml-1 text-xs opacity-70 hidden sm:inline">(ESC)</span>
        </Button>
        <div className="flex gap-2">
          <Button
            btnType="secondary"
            className="px-3 py-1.5 sm:py-1 text-sm touch-manipulation"
            onClick={onCopy}
          >
            Copy <span className="ml-1 text-xs opacity-70 hidden sm:inline">Content</span>
          </Button>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                btnType="secondary"
                className="px-3 py-1.5 sm:py-1 text-sm touch-manipulation"
                title="Editor Actions"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[180px] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg p-1 z-50"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Item
                  className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-sm cursor-pointer outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center gap-2"
                  onSelect={handleCopySampleFrontmatter}
                >
                  <FileText className="w-4 h-4" />
                  <span>Copy Sample Frontmatter</span>
                  {isSampleCopied && <Check className="w-3.5 h-3.5 ml-auto" />}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  className="px-3 py-2 text-sm text-gray-900 dark:text-gray-100 rounded-sm cursor-pointer outline-none hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 flex items-center gap-2"
                  onSelect={onClear}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear Editor</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
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
            fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
          }}
          className="h-full"
        />
      </div>
    </div>
  );
}

