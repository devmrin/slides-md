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
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { EditPresentationNameDialog } from "./EditPresentationNameDialog";
import { PresentationActionDropdown } from "./PresentationActionDropdown";
import { ToastRoot } from "./Toast";
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
          style={tableMinWidth != null ? { minWidth: tableMinWidth } : undefined}
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
