import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { format } from "date-fns";
import { Copy, Check, Maximize, MoreVertical, Trash2, FileText } from "lucide-react";
import { Button } from "../ui/Button";

interface EditorProps {
  markdown: string;
  setMarkdown: (v: string) => void;
  setCurrentSlide: (n: number) => void;
  onClear: () => void;
  onCopy: () => void;
  onToggleFullscreen: () => void;
  isDark: boolean;
  isExpanded: boolean;
}

export function Editor({
  markdown,
  setMarkdown,
  setCurrentSlide: _setCurrentSlide, // eslint-disable-line @typescript-eslint/no-unused-vars
  onClear,
  onCopy,
  onToggleFullscreen,
  isDark,
  isExpanded,
}: EditorProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isSampleCopied, setIsSampleCopied] = useState(false);

  const handleCopy = () => {
    onCopy();
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

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

  return (
    <div className={`${isExpanded ? "w-full" : "w-0"} border-r flex flex-col bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 overflow-hidden`}>
      <div className="px-3 sm:px-4 py-2 border-b text-sm font-medium border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <Button
            onClick={onToggleFullscreen}
            className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation flex items-center gap-1.5"
            title="Enter Fullscreen"
          >
            <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Fullscreen Editor</span>
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
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Button
                className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation"
                title="Editor Actions"
              >
                <MoreVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
      {isExpanded && (
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
      )}
    </div>
  );
}
