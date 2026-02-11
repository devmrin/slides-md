import { useEffect, useState } from "react";
import { Editor } from "./Editor";
import { Slide } from "./Slide";
import { Director } from "./Director";
import { Button } from "../ui/Button";
import { AppHeader } from "./AppHeader";
import { StandardViewNav } from "./StandardViewNav";
import { useLocalStorage, type ViewMode } from "../hooks/useLocalStorage";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import { useHideMonacoContextView } from "../hooks/useHideMonacoContextView";
import { type SlideConfig } from "../hooks/useSlides";
import { SlideFrame } from "./SlideFrame";
import { db } from "../db";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MoreVertical, RotateCcw, Presentation } from "lucide-react";

interface StandardViewProps {
  markdown: string;
  setMarkdown: (value: string) => void;
  currentSlide: number;
  setCurrentSlide: (slide: number) => void;
  slides: string[];
  slideConfigs: SlideConfig[];
  frontmatter?: Record<string, string>;
  imageOnlySlides: Set<number>;
  isDark: boolean;
  setIsDark: (value: boolean | ((prev: boolean) => boolean)) => void;
  toggleFullscreen: () => void;
  toggleEditorFullscreen: () => void;
  onClear: () => void;
  onCopy: () => void;
  prevSlide: () => void;
  nextSlide: () => void;
  presentationName?: string;
  onEditName?: () => void;
  onOpenMediaLibrary?: () => void;
}

export function StandardView({
  markdown,
  setMarkdown,
  currentSlide,
  setCurrentSlide,
  slides,
  slideConfigs,
  frontmatter,
  imageOnlySlides,
  isDark,
  setIsDark,
  toggleFullscreen,
  toggleEditorFullscreen,
  onClear,
  onCopy,
  prevSlide,
  nextSlide,
  presentationName,
  onEditName,
  onOpenMediaLibrary,
}: StandardViewProps) {
  const { isMobile } = useDeviceDetection();
  const [viewModeRaw, setViewMode] = useLocalStorage(
    "viewMode",
    "split" as ViewMode,
  );
  const viewMode: ViewMode = viewModeRaw ?? "split";
  const [mobilePane, setMobilePane] = useState<"editor" | "presentation">(
    "editor",
  );
  const [resolvedLogoUrl, setResolvedLogoUrl] = useState<string | null>(null);

  // On mobile: one pane at a time (editor or presentation). On desktop: use viewMode.
  const showEditor = isMobile
    ? mobilePane === "editor"
    : viewMode !== "full-preview";
  const showPreview = isMobile
    ? mobilePane === "presentation"
    : viewMode !== "full-editor";

  // Get flex basis for editor based on view mode
  const getEditorFlexBasis = () => {
    switch (viewMode) {
      case "full-editor":
        return "100%";
      case "editor-65":
        return "65%";
      case "editor-35":
        return "35%";
      case "split":
      default:
        return "50%";
    }
  };

  // Get flex basis for preview based on view mode
  const getPreviewFlexBasis = () => {
    switch (viewMode) {
      case "full-preview":
        return "100%";
      case "editor-65":
        return "35%";
      case "editor-35":
        return "65%";
      case "split":
      default:
        return "50%";
    }
  };

  useHideMonacoContextView();

  // Resolve media:// URL for logo if present
  useEffect(() => {
    const resolveLogo = async () => {
      const logo = frontmatter?.logo;
      if (!logo) {
        setResolvedLogoUrl(null);
        return;
      }

      // Check if it's a media:// URL
      const mediaMatch = logo.match(/^media:\/\/([a-f0-9-]+)$/);
      if (mediaMatch) {
        const mediaId = mediaMatch[1];
        try {
          const mediaItem = await db.getMedia(mediaId);
          if (mediaItem) {
            setResolvedLogoUrl(mediaItem.dataUrl);
            return;
          }
        } catch (error) {
          console.error(`Failed to resolve logo media://${mediaId}:`, error);
        }
        setResolvedLogoUrl(null);
      } else {
        // Not a media:// URL, use as-is (regular URL)
        setResolvedLogoUrl(logo);
      }
    };

    resolveLogo();
  }, [frontmatter?.logo]);

  const isTitle = slides[currentSlide] === "__TITLE_SLIDE__";
  const isImageOnly = imageOnlySlides.has(currentSlide);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 relative">
      <AppHeader isDark={isDark} setIsDark={setIsDark} />

      <StandardViewNav
        presentationName={presentationName}
        onEditName={onEditName}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenMediaLibrary={onOpenMediaLibrary}
        isMobile={isMobile}
        mobilePane={mobilePane}
        onMobilePaneChange={setMobilePane}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Editor - visible based on view mode */}
        {showEditor && (
          <div
            key={`editor-${viewMode}`}
            className="flex"
            style={{
              flexBasis: isMobile ? "100%" : getEditorFlexBasis(),
              flexShrink: 0,
              flexGrow: isMobile ? 1 : 0,
            }}
          >
            <Editor
              markdown={markdown}
              setMarkdown={setMarkdown}
              setCurrentSlide={setCurrentSlide}
              onClear={onClear}
              onCopy={onCopy}
              onToggleFullscreen={toggleEditorFullscreen}
              isDark={isDark}
              isExpanded={showEditor}
            />
          </div>
        )}
        {/* Preview - visible based on view mode */}
        {showPreview && (
          <div
            key={`preview-${viewMode}`}
            className="flex flex-col min-w-0 overflow-hidden bg-white dark:bg-gray-900 relative"
            style={{
              flexBasis: isMobile ? "100%" : getPreviewFlexBasis(),
              flexShrink: 0,
              flexGrow: isMobile ? 1 : 0,
            }}
          >
            <div className="px-3 sm:px-4 py-2 border-b text-sm font-medium flex items-center justify-between gap-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700">
              <span>Preview</span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleFullscreen}
                  className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-1.5"
                >
                  <Presentation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Present (⌘↵)</span>
                  <span className="sm:hidden">Present</span>
                </Button>
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger asChild>
                    <Button
                      className="px-2 sm:px-3 py-1 text-xs border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 touch-manipulation"
                      title="More Options"
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
                        onSelect={() => setCurrentSlide(0)}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset to First Slide</span>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </div>
            </div>
            <div className="flex-1 min-h-0 min-w-0 overflow-hidden bg-white dark:bg-gray-900">
              <SlideFrame
                variant="standard"
                isTitle={isTitle}
                isImageOnly={isImageOnly}
                align={slideConfigs[currentSlide]?.align}
                frameClassName="bg-white dark:bg-gray-900"
                overlay={
                  resolvedLogoUrl ? (
                    <img
                      src={resolvedLogoUrl}
                      alt="Logo"
                      className={`presentation-logo absolute bottom-16 z-10 shadow-none ${
                        frontmatter?.logoPosition === "right"
                          ? "right-16"
                          : "left-16"
                      } ${
                        frontmatter?.logoSize === "sm"
                          ? "h-8"
                          : frontmatter?.logoSize === "lg"
                            ? "h-12"
                            : "h-10"
                      } w-auto`}
                      style={{
                        opacity: frontmatter?.logoOpacity
                          ? parseFloat(frontmatter.logoOpacity)
                          : 0.9,
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null
                }
              >
                <Slide
                  key={currentSlide}
                  slide={slides[currentSlide]}
                  isTitle={isTitle}
                  isImageOnly={isImageOnly}
                  frontmatter={frontmatter}
                  config={slideConfigs[currentSlide]}
                />
              </SlideFrame>
            </div>
            <Director
              currentSlide={currentSlide}
              slidesLength={slides.length}
              prevSlide={prevSlide}
              nextSlide={nextSlide}
              setCurrentSlide={setCurrentSlide}
              frontmatter={frontmatter}
              onToggleTheme={() => setIsDark(!isDark)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
