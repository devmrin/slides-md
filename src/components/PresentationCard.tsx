import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Slide } from "./Slide";
import { useSlides } from "../hooks/useSlides";
import { Button } from "../ui/Button";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import type { Presentation } from "../db/adapter";

interface PresentationCardProps {
  presentation: Presentation;
  onDelete: (id: string) => void;
}

export function PresentationCard({ presentation, onDelete }: PresentationCardProps) {
  const navigate = useNavigate();
  const { frontmatter, slides } = useSlides(presentation.markdown);
  const firstSlide = slides[0] || "";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleClick = () => {
    navigate({ to: "/presentation/$id", params: { id: presentation.id } });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(presentation.id);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={handleClick}
    >
      {/* Thumbnail preview */}
      <div className="w-full h-[150px] bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
        <div className="standard-view-slide scale-[0.3] origin-center w-[333%] h-[333%] pointer-events-none">
          <Slide
            slide={firstSlide}
            isTitle={firstSlide === "__TITLE_SLIDE__"}
            frontmatter={frontmatter}
          />
        </div>
      </div>

      {/* Card content */}
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">
            {presentation.name}
          </h3>
          <Button
            onClick={handleDelete}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded shrink-0"
            title="Delete presentation"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        presentationName={presentation.name}
      />
    </div>
  );
}

