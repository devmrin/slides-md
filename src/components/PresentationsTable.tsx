import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Slide } from "./Slide";
import { SlideFrame } from "./SlideFrame";
import { useSlides } from "../hooks/useSlides";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { EditPresentationNameDialog } from "./EditPresentationNameDialog";
import { PresentationActionDropdown } from "./PresentationActionDropdown";
import { ToastRoot } from "./Toast";
import { db } from "../db";
import { exportMarkdown } from "../utils/exportMarkdown";
import type { Presentation } from "../db/adapter";

interface PresentationsTableProps {
  presentations: Presentation[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
}

function PreviewCell({ presentation }: { presentation: Presentation }) {
  const { frontmatter, slides, slideConfigs, imageOnlySlides } = useSlides(
    presentation.markdown,
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideCount = slides.length;
  const activeSlide = slides[currentSlide] || "";
  const isTitleSlide = activeSlide === "__TITLE_SLIDE__";
  const isImageOnly = imageOnlySlides.has(currentSlide);
  const activeConfig = slideConfigs[currentSlide];
  const [resolvedLogoUrl, setResolvedLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (slideCount === 0) {
      setCurrentSlide(0);
      return;
    }
    if (currentSlide > slideCount - 1) {
      setCurrentSlide(slideCount - 1);
    }
  }, [currentSlide, slideCount]);

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

  return (
    <div className="w-32 aspect-video bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden rounded">
      <div className="w-full h-full relative">
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
              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/70 dark:border-gray-700/70 flex items-center justify-center disabled:opacity-40 disabled:cursor-default"
              onClick={(event) => {
                event.stopPropagation();
                setCurrentSlide((prev) => Math.max(0, prev - 1));
              }}
              aria-label="Previous slide"
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-3 w-3" />
            </button>
            <button
              type="button"
              className="absolute right-0 top-1/2 -translate-y-1/2 h-6 w-6 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-200 shadow-sm border border-gray-200/70 dark:border-gray-700/70 flex items-center justify-center disabled:opacity-40 disabled:cursor-default"
              onClick={(event) => {
                event.stopPropagation();
                setCurrentSlide((prev) => Math.min(slideCount - 1, prev + 1));
              }}
              aria-label="Next slide"
              disabled={currentSlide === slideCount - 1}
            >
              <ChevronRight className="h-3 w-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function PresentationsTable({
  presentations,
  onDelete,
  onEdit,
  onDuplicate,
}: PresentationsTableProps) {
  const navigate = useNavigate();
  const { isMobile } = useDeviceDetection();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Presentation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Presentation | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [exportedName, setExportedName] = useState("");

  const handleRowClick = (presentation: Presentation) => {
    // Prevent navigation if a dialog is open
    if (deleteDialogOpen !== null || editDialogOpen !== null) {
      return;
    }
    navigate({ to: "/presentation/$id", params: { id: presentation.id } });
  };

  const handleDeleteClick = (presentation: Presentation) => {
    setDeleteTarget(presentation);
    setDeleteDialogOpen(presentation.id);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete(deleteTarget.id);
      setDeleteTarget(null);
      setDeleteDialogOpen(null);
    }
  };

  const handleEditClick = (presentation: Presentation) => {
    setEditTarget(presentation);
    setEditDialogOpen(presentation.id);
  };

  const handleConfirmEdit = (newName: string) => {
    if (editTarget) {
      onEdit(editTarget.id, newName);
      setEditTarget(null);
      setEditDialogOpen(null);
    }
  };

  const handleDeleteDialogChange = (open: boolean) => {
    if (!open) {
      setDeleteDialogOpen(null);
      setDeleteTarget(null);
    }
  };

  const handleEditDialogChange = (open: boolean) => {
    if (!open) {
      setEditDialogOpen(null);
      setEditTarget(null);
    }
  };

  const handleExport = (presentation: Presentation) => {
    exportMarkdown(presentation.markdown, presentation.name, () => {
      setExportedName(presentation.name);
      setToastOpen(true);
    });
  };

  const columns = useMemo<ColumnDef<Presentation>[]>(
    () => [
      ...(!isMobile
        ? [
            {
              id: "preview",
              header: "Preview",
              cell: ({ row }: { row: { original: Presentation } }) => (
                <PreviewCell presentation={row.original} />
              ),
            },
          ]
        : []),
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        cell: ({ getValue }) => (
          <div className="font-semibold text-gray-900 dark:text-gray-100 truncate min-w-0">
            {getValue() as string}
          </div>
        ),
      },
      {
        id: "createdAt",
        header: "Created At",
        accessorFn: (row) => row.createdAt,
        cell: ({ getValue }) => {
          const timestamp = getValue() as number;
          return (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(timestamp), "MMM d, yyyy")}
            </div>
          );
        },
      },
      {
        id: "updatedAt",
        header: "Updated At",
        accessorFn: (row) => row.updatedAt,
        cell: ({ getValue }) => {
          const timestamp = getValue() as number;
          return (
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(timestamp), "MMM d, yyyy")}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const presentation = row.original;
          return (
            <div
              className="min-w-0 max-w-full flex justify-end overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <PresentationActionDropdown
                presentation={presentation}
                onDelete={onDelete}
                onEdit={onEdit}
                onDuplicate={onDuplicate}
                onExport={() => handleExport(presentation)}
                onEditClick={() => handleEditClick(presentation)}
                onDeleteClick={() => handleDeleteClick(presentation)}
              />
            </div>
          );
        },
        size: 48,
        minSize: 48,
        maxSize: 48,
      },
    ],
    [isMobile, onDelete, onEdit, onDuplicate],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: presentations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const gridCols = isMobile
    ? "180px 120px 120px 80px"
    : "160px 1fr 120px 120px 80px";

  const tableMinWidth = isMobile ? "500px" : undefined;

  return (
    <>
      <div className={isMobile ? "overflow-x-auto w-full" : "w-full"}>
        <div
          className="w-full min-w-0"
          style={
            tableMinWidth != null ? { minWidth: tableMinWidth } : undefined
          }
        >
          {/* Header */}
          <div
            className="grid border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            style={{ gridTemplateColumns: gridCols }}
          >
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className={`py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider ${header.column.id === "actions" ? "pl-2 pr-4" : "px-4"}`}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </div>
              )),
            )}
          </div>
          {/* Rows */}
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="grid border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              style={{ gridTemplateColumns: gridCols }}
              onClick={() => handleRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <div
                  key={cell.id}
                  className={`py-3 ${cell.column.id === "actions" ? "pl-2 pr-4 min-w-0 overflow-hidden" : cell.column.id === "name" ? "px-4 min-w-0 overflow-hidden" : "px-4"}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {deleteTarget && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen === deleteTarget.id}
          onOpenChange={handleDeleteDialogChange}
          onConfirm={handleConfirmDelete}
          presentationName={deleteTarget.name}
        />
      )}

      {editTarget && (
        <EditPresentationNameDialog
          open={editDialogOpen === editTarget.id}
          onOpenChange={handleEditDialogChange}
          currentName={editTarget.name}
          onSave={handleConfirmEdit}
        />
      )}

      <ToastRoot
        open={toastOpen}
        onOpenChange={setToastOpen}
        title="Markdown exported successfully"
        description={`${exportedName} has been downloaded`}
      />
    </>
  );
}
