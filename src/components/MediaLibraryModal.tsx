import { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tooltip from "@radix-ui/react-tooltip";
import { X, Upload, Copy, Check } from "lucide-react";
import { db } from "../db";
import type { MediaItem } from "../db/adapter";
import { ToastRoot } from "./Toast";
import { generateUUID } from "../utils/uuid";
import { ImageActionDropdown } from "./ImageActionDropdown";
import { ImageCarousel } from "./ImageCarousel";
import { EditAltDialog } from "./EditAltDialog";
import {
  MAX_MEDIA_ITEMS,
  MAX_FILE_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE_MB,
} from "../config/constants";

interface MediaLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MediaLibraryModal({
  open,
  onOpenChange,
}: MediaLibraryModalProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [editAltOpen, setEditAltOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load media items
  useEffect(() => {
    if (open) {
      loadMedia();
    }
  }, [open]);

  const loadMedia = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const items = await db.getAllMedia();
      setMediaItems(items);
    } catch (err) {
      console.error("Failed to load media:", err);
      setError("Failed to load media library");
    } finally {
      setIsLoading(false);
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    if (
      !ALLOWED_IMAGE_TYPES.includes(
        file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
      )
    ) {
      return `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(
        ", ",
      )}`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`;
    }

    // Check total count
    if (mediaItems.length >= MAX_MEDIA_ITEMS) {
      return `Maximum of ${MAX_MEDIA_ITEMS} images allowed`;
    }

    return null;
  };

  const convertFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      try {
        // Convert to data URL
        const dataUrl = await convertFileToDataUrl(file);

        // Save to database
        const newMedia: Omit<MediaItem, "createdAt"> = {
          id: generateUUID(),
          filename: file.name,
          mimeType: file.type,
          size: file.size,
          dataUrl,
        };

        await db.saveMedia(newMedia);
      } catch (err) {
        console.error("Failed to upload image:", err);
        setError(`Failed to upload ${file.name}`);
      }
    }

    // Reload media items
    await loadMedia();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await db.deleteMedia(id);
      await loadMedia();
    } catch (err) {
      console.error("Failed to delete media:", err);
      setError("Failed to delete image");
    }
  };

  const handleImageClick = (index: number) => {
    setCarouselIndex(index);
    setCarouselOpen(true);
  };

  const handleEditAlt = (media: MediaItem) => {
    setEditingMedia(media);
    setEditAltOpen(true);
  };

  const handleSaveAlt = async (id: string, alt: string) => {
    try {
      const media = await db.getMedia(id);
      if (!media) return;

      await db.saveMedia({
        ...media,
        alt,
      });

      await loadMedia();
    } catch (err) {
      console.error("Failed to save alt text:", err);
      throw err;
    }
  };

  const handleCopyReminder = () => {
    const text =
      "![vintage aesthetic](https://images.unsplash.com/photo-1767520832109-aee2a0d72f49)";
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40" />
          <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] overflow-hidden z-50 border border-gray-300 dark:border-gray-700">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Media Library
                  </Dialog.Title>
                  <Dialog.Description className="sr-only">
                    Upload and manage images for your presentations
                  </Dialog.Description>
                  <div className="flex items-center gap-4 mt-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {mediaItems.length} / {MAX_MEDIA_ITEMS} images
                    </p>
                    <span className="text-gray-300 dark:text-gray-600">•</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Supported: JPEG, PNG, GIF, WebP, SVG
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenChange(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
                    {error}
                  </div>
                )}

                {/* Media grid */}
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-gray-500 dark:text-gray-400">
                      Loading...
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {/* Upload Placeholder */}
                    <div className="aspect-square">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={ALLOWED_IMAGE_TYPES.join(",")}
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        id="media-file-input"
                      />
                      <label
                        htmlFor="media-file-input"
                        className="flex flex-col items-center justify-center gap-2 w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-900/50 p-4 text-center group"
                      >
                        <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                        <div>
                          <span className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Upload
                          </span>
                          <span className="block text-[10px] text-gray-500 dark:text-gray-400 mt-1">
                            max {MAX_FILE_SIZE_MB}MB
                          </span>
                        </div>
                      </label>
                    </div>

                    {mediaItems.map((item, index) => (
                      <div
                        key={item.id}
                        className="relative group aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                      >
                        <button
                          onClick={() => handleImageClick(index)}
                          className="w-full h-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
                        >
                          <img
                            src={item.dataUrl}
                            alt={item.filename}
                            className="w-full h-full object-cover"
                          />
                        </button>

                        {/* Action dropdown */}
                        <ImageActionDropdown
                          media={item}
                          onDelete={handleDelete}
                          onEditAlt={handleEditAlt}
                          onCopySuccess={(message) => {
                            setToastMessage(message);
                            setShowToast(true);
                            onOpenChange(false);
                          }}
                        />

                        {/* Image info overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-xs font-medium truncate">
                            {item.filename}
                          </p>
                          {item.alt && (
                            <p className="text-white/80 text-xs italic truncate mt-0.5">
                              {item.alt}
                            </p>
                          )}
                          <p className="text-white/70 text-xs">
                            {formatFileSize(item.size)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="opacity-75 hover:opacity-100 transition-opacity">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Reminder: When possible, use external images/GIFs via
                    markdown syntax rather than uploading:
                  </p>
                  <Tooltip.Provider>
                    <Tooltip.Root>
                      <Tooltip.Trigger asChild>
                        <button
                          onClick={handleCopyReminder}
                          className="group flex items-center gap-2 text-left bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors px-2 py-1 rounded cursor-pointer border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                        >
                          <code className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400 font-mono truncate flex-1">
                            ![vintage
                            aesthetic](https://images.unsplash.com/photo-1767520832109-aee2a0d72f49)
                          </code>
                          {isCopied ? (
                            <Check className="w-3 h-3 text-green-500 shrink-0" />
                          ) : (
                            <Copy className="w-3 h-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 shrink-0 transition-colors" />
                          )}
                        </button>
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          side="bottom"
                          className="px-3 py-1.5 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded shadow-lg z-50"
                          sideOffset={5}
                        >
                          Click to copy
                          <Tooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
                        </Tooltip.Content>
                      </Tooltip.Portal>
                    </Tooltip.Root>
                  </Tooltip.Provider>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Carousel */}
      {carouselOpen && (
        <ImageCarousel
          media={mediaItems}
          initialIndex={carouselIndex}
          onClose={() => setCarouselOpen(false)}
        />
      )}

      {/* Edit Alt Dialog */}
      {editAltOpen && editingMedia && (
        <EditAltDialog
          open={editAltOpen}
          onOpenChange={setEditAltOpen}
          media={editingMedia}
          onSave={handleSaveAlt}
        />
      )}

      {/* Toast */}
      <ToastRoot
        open={showToast}
        onOpenChange={setShowToast}
        title={toastMessage}
      />
    </>
  );
}
