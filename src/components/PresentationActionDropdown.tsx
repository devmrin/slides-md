import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Copy, Trash2, MoreVertical, Pencil, FileDown } from "lucide-react";
import type { Presentation } from "../db/adapter";

interface PresentationActionDropdownProps {
  presentation: Presentation;
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
  onExport: (id: string) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

export function PresentationActionDropdown({
  presentation,
  onDuplicate,
  onExport,
  onEditClick,
  onDeleteClick,
}: PresentationActionDropdownProps) {
  const handleDuplicate = () => {
    onDuplicate(presentation.id);
  };

  const handleExport = () => {
    onExport(presentation.id);
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded touch-manipulation"
          aria-label="Presentation actions"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[160px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1 z-50"
          sideOffset={5}
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onSelect={onEditClick}
          >
            <Pencil className="w-4 h-4" />
            Edit Name
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onSelect={handleDuplicate}
          >
            <Copy className="w-4 h-4" />
            Duplicate
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onSelect={handleExport}
          >
            <FileDown className="w-4 h-4" />
            Export to PPTX
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer outline-none"
            onSelect={onDeleteClick}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
