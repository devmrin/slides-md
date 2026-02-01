import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Slide } from "./Slide";
import { useSlides } from "../hooks/useSlides";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { EditPresentationNameDialog } from "./EditPresentationNameDialog";
import { PresentationActionDropdown } from "./PresentationActionDropdown";
import { exportMarkdown } from "../utils/exportMarkdown";
import type { Presentation } from "../db/adapter";

interface PresentationCardProps {
  presentation: Presentation;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
}

export function PresentationCard({
  presentation,
  onDelete,
  onEdit,
  onDuplicate,
}: PresentationCardProps) {
  const navigate = useNavigate();
  const { frontmatter, slides } = useSlides(presentation.markdown);
  const firstSlide = slides[0] || "";
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const handleClick = () => {
    // Prevent navigation if a dialog is open
    if (deleteDialogOpen || editDialogOpen) {
      return;
    }
    navigate({ to: "/presentation/$id", params: { id: presentation.id } });
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
    exportMarkdown(presentation.markdown, presentation.name);
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
    </div>
  );
}
