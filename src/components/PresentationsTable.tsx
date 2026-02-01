import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import { Slide } from "./Slide";
import { useSlides } from "../hooks/useSlides";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { EditPresentationNameDialog } from "./EditPresentationNameDialog";
import { PresentationActionDropdown } from "./PresentationActionDropdown";
import { exportMarkdown } from "../utils/exportMarkdown";
import type { Presentation } from "../db/adapter";

interface PresentationsTableProps {
  presentations: Presentation[];
  onDelete: (id: string) => void;
  onEdit: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
}

function PreviewCell({ presentation }: { presentation: Presentation }) {
  const { frontmatter, slides } = useSlides(presentation.markdown);
  const firstSlide = slides[0] || "";

  return (
    <div className="w-32 h-20 bg-gray-100 dark:bg-gray-900 flex items-center justify-center overflow-hidden rounded">
      <div className="standard-view-slide scale-[0.15] origin-center w-[667%] h-[667%] pointer-events-none">
        <Slide
          slide={firstSlide}
          isTitle={firstSlide === "__TITLE_SLIDE__"}
          frontmatter={frontmatter}
        />
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Presentation | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<Presentation | null>(null);

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
    exportMarkdown(presentation.markdown, presentation.name);
  };

  const columns = useMemo<ColumnDef<Presentation>[]>(
    () => [
      {
        id: "preview",
        header: "Preview",
        cell: ({ row }) => <PreviewCell presentation={row.original} />,
      },
      {
        id: "name",
        header: "Name",
        accessorKey: "name",
        cell: ({ getValue }) => (
          <div className="font-semibold text-gray-900 dark:text-gray-100">
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
        header: "",
        cell: ({ row }) => {
          const presentation = row.original;
          return (
            <div
              className="w-12 flex justify-end"
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
    [onDelete, onEdit, onDuplicate]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: presentations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="overflow-x-auto">
        <div className="w-full">
          {/* Header */}
          <div
            className="grid border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
            style={{ gridTemplateColumns: "160px 1fr 120px 120px 120px" }}
          >
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </div>
              ))
            )}
          </div>
          {/* Rows */}
          {table.getRowModel().rows.map((row) => (
            <div
              key={row.id}
              className="grid border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
              style={{ gridTemplateColumns: "160px 1fr 120px 120px 120px" }}
              onClick={() => handleRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <div key={cell.id} className="px-4 py-3">
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
    </>
  );
}
