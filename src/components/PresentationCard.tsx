import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slide } from "./Slide";
import { useSlides } from "../hooks/useSlides";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { EditPresentationNameDialog } from "./EditPresentationNameDialog";
import { PresentationActionDropdown } from "./PresentationActionDropdown";
import { ToastRoot } from "./Toast";
import { SlideFrame } from "./SlideFrame";
import { db } from "../db";
import { exportMarkdown } from "../utils/exportMarkdown";
import type { Presentation } from "../db/adapter";

interface PresentationCardProps {
  presentation: Presentation;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
  /** When true, uses smaller thumbnail and padding for mobile/narrow layouts */
  compact?: boolean;
}

export function PresentationCard({
  presentation,
  onDelete,
  onEdit,
  onDuplicate,
  compact = false,
}: PresentationCardProps) {
  const navigate = useNavigate();
  const { frontmatter, slides, slideConfigs, imageOnlySlides } = useSlides(
    presentation.markdown,
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;
  const maxSlideIndex = Math.max(0, slideCount - 1);
  const activeSlideIndex = Math.min(currentSlide, maxSlideIndex);
  const activeSlide = slides[activeSlideIndex] || "";
  const isTitleSlide = activeSlide === "__TITLE_SLIDE__";
  const isImageOnly = imageOnlySlides.has(activeSlideIndex);
  const activeConfig = slideConfigs[activeSlideIndex];
  const [resolvedLogoUrl, setResolvedLogoUrl] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const didSwipeRef = useRef(false);
  const SWIPE_THRESHOLD = 40;

  useEffect(() => {
    const resolveLogo = async () => {
      const logo = frontmatter?.logo;
      if (!logo) {
        setResolvedLogoUrl(null);
        return;
      }

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
        setResolvedLogoUrl(logo);
      }
    };

    resolveLogo();
  }, [frontmatter?.logo]);

  const logoOverlay = resolvedLogoUrl ? (
    <img
      src={resolvedLogoUrl}
      alt="Logo"
      className={`presentation-logo preview-logo absolute bottom-16 z-10 shadow-none ${
        frontmatter?.logoPosition === "right" ? "right-16" : "left-16"
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
      onError={(event) => {
        (event.target as HTMLImageElement).style.display = "none";
      }}
    />
  ) : null;

  const handleClick = () => {
    if (didSwipeRef.current) {
      didSwipeRef.current = false;
      return;
    }
    // Prevent navigation if a dialog is open
    if (deleteDialogOpen || editDialogOpen) {
      return;
    }
    navigate({ to: "/presentation/$id", params: { id: presentation.id } });
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    if (event.changedTouches.length === 0 || slideCount <= 1) return;
    didSwipeRef.current = false;
    touchStartRef.current = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
    };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (
      event.changedTouches.length === 0 ||
      !touchStartRef.current ||
      slideCount <= 1
    ) {
      return;
    }

    const start = touchStartRef.current;
    touchStartRef.current = null;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    const deltaX = endX - start.x;
    const deltaY = endY - start.y;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    if (Math.abs(deltaY) > Math.abs(deltaX)) return;

    didSwipeRef.current = true;
    if (deltaX < 0) {
      setCurrentSlide((prev) => Math.min(slideCount - 1, prev + 1));
    } else {
      setCurrentSlide((prev) => Math.max(0, prev - 1));
    }
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmEdit = (newName: string) => {
    onEdit(presentation.id, newName);
    setEditDialogOpen(false);
  };

  const handleConfirmDelete = () => {
    onDelete(presentation.id);
  };

  const handleExport = () => {
    exportMarkdown(presentation.markdown, presentation.name, () => {
      setToastOpen(true);
    });
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      {/* Thumbnail preview */}
      <div
        className={
          compact
            ? "w-full aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden"
            : "w-full aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden"
        }
      >
        <div
          className="w-full h-full relative"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <SlideFrame
            variant="standard"
            isTitle={isTitleSlide}
            isImageOnly={isImageOnly}
            align={activeConfig?.align}
            frameClassName="preview-frame w-full h-full"
            overlay={logoOverlay}
          >
            <Slide
              slide={activeSlide}
              isTitle={isTitleSlide}
              isImageOnly={isImageOnly}
              frontmatter={frontmatter}
              config={activeConfig}
            />
          </SlideFrame>
          {slideCount > 1 && (
            <>
              <button
                type="button"
                className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/70 dark:border-gray-700/70 flex items-center justify-center transition hover:bg-white dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-default"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentSlide((prev) => Math.max(0, prev - 1));
                }}
                aria-label="Previous slide"
                disabled={activeSlideIndex === 0}
              >
                <ChevronLeft className="h-3 w-3" />
              </button>
              <button
                type="button"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/70 dark:border-gray-700/70 flex items-center justify-center transition hover:bg-white dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-default"
                onClick={(event) => {
                  event.stopPropagation();
                  setCurrentSlide((prev) => Math.min(slideCount - 1, prev + 1));
                }}
                aria-label="Next slide"
                disabled={activeSlideIndex === slideCount - 1}
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className={compact ? "p-2" : "p-3"}>
        <div className="flex items-center justify-between gap-1.5 sm:gap-2">
          <h3
            className={
              compact
                ? "font-medium text-sm text-gray-900 dark:text-gray-100 truncate flex-1"
                : "font-semibold text-gray-900 dark:text-gray-100 truncate flex-1"
            }
          >
            {presentation.name}
          </h3>
          <div className="flex items-center gap-1">
            <PresentationActionDropdown
              presentation={presentation}
              onDelete={onDelete}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onExport={handleExport}
              onEditClick={handleEdit}
              onDeleteClick={handleDelete}
            />
          </div>
        </div>
      </div>

      <EditPresentationNameDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentName={presentation.name}
        onSave={handleConfirmEdit}
      />
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        presentationName={presentation.name}
      />
      <ToastRoot
        open={toastOpen}
        onOpenChange={setToastOpen}
        title="Markdown exported successfully"
        description={`${presentation.name} has been downloaded`}
      />
    </div>
  );
}
