import { useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/Button";
import type { Presentation } from "../db/adapter";

interface PresentationListItemProps {
  presentation: Presentation;
  onDelete: (id: string) => void;
}

export function PresentationListItem({ presentation, onDelete }: PresentationListItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: "/presentation/$id", params: { id: presentation.id } });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${presentation.name}"?`)) {
      onDelete(presentation.id);
    }
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
        <p className="text-xs text-gray-500 dark:text-gray-400">{formattedDate}</p>
      </div>
      <Button
        onClick={handleDelete}
        className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded flex-shrink-0"
        title="Delete presentation"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

