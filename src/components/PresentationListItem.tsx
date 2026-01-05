import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { EditPresentationNameDialog } from "./EditPresentationNameDialog";
import { PresentationActionDropdown } from "./PresentationActionDropdown";
import type { Presentation } from "../db/adapter";

interface PresentationListItemProps {
  presentation: Presentation;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
}

export function PresentationListItem({
  presentation,
  onDelete,
  onEdit,
  onDuplicate,
}: PresentationListItemProps) {
  const navigate = useNavigate();
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

  const formattedDate = format(new Date(presentation.updatedAt), "MMM d, yyyy");

  return (
    <div
      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-between gap-4"
      onClick={handleClick}
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate mb-1">
          {presentation.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formattedDate}
        </p>
      </div>
      <PresentationActionDropdown
        presentation={presentation}
        onDelete={onDelete}
        onEdit={onEdit}
        onDuplicate={onDuplicate}
        onEditClick={handleEdit}
        onDeleteClick={handleDelete}
      />

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
