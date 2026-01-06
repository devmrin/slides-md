import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Copy, Trash2, MoreVertical, Edit3, Image } from "lucide-react";
import type { MediaItem } from "../db/adapter";

interface ImageActionDropdownProps {
  media: MediaItem;
  onDelete: (id: string) => void;
  onEditAlt: (media: MediaItem) => void;
}

export function ImageActionDropdown({
  media,
  onDelete,
  onEditAlt,
}: ImageActionDropdownProps) {
  const copyMarkdownLink = async () => {
    try {
      // Use custom media:// scheme with media ID
      // This keeps the markdown clean and references the IndexedDB entry
      const altText = media.alt || media.filename;
      const markdown = `![${altText}](media://${media.id})`;

      await navigator.clipboard.writeText(markdown);
      // Could add toast notification here in future
      console.log("Markdown link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("Failed to copy markdown link");
    }
  };

  const copyAsLogo = async () => {
    try {
      const logoFrontmatter = `logo: media://${media.id}`;
      await navigator.clipboard.writeText(logoFrontmatter);
      console.log("Logo frontmatter copied to clipboard");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      alert("Failed to copy logo frontmatter");
    }
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${media.filename}"?`)) {
      onDelete(media.id);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-md shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors touch-manipulation"
          aria-label="Image actions"
        >
          <MoreVertical className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-1 z-50"
          sideOffset={5}
          align="end"
        >
          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onSelect={copyMarkdownLink}
          >
            <Copy className="w-4 h-4" />
            Copy Markdown Link
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onSelect={copyAsLogo}
          >
            <Image className="w-4 h-4" />
            Copy as Frontmatter Logo
          </DropdownMenu.Item>

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer outline-none"
            onSelect={() => onEditAlt(media)}
          >
            <Edit3 className="w-4 h-4" />
            Edit Alt Text
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />

          <DropdownMenu.Item
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer outline-none"
            onSelect={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
