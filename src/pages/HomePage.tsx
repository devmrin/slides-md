import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Plus, Grid3x3, List, ImagePlus } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { CreatePresentationDialog } from "../components/CreatePresentationDialog";
import { MediaLibraryModal } from "../components/MediaLibraryModal";
import { PresentationCard } from "../components/PresentationCard";
import { PresentationsTable } from "../components/PresentationsTable";
import { Button } from "../ui/Button";
import { Switch } from "../ui/Switch";
import { db } from "../db";
import { generateUUID } from "../utils/uuid";
import { MAX_PRESENTATIONS } from "../config/constants";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Presentation } from "../db/adapter";
import seedMarkdown from "../data/seed.md?raw";

export function HomePage() {
  const navigate = useNavigate();
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [viewMode, setViewMode] = useLocalStorage("homeViewMode", "gallery");
  const [isDark, setIsDarkRaw] = useLocalStorage("theme", false);

  const isDarkValue = isDark ?? false;
  const setIsDark = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      if (typeof value === "function") {
        setIsDarkRaw((prev) => {
          const prevValue = prev ?? false;
          return value(prevValue);
        });
      } else {
        setIsDarkRaw(value);
      }
    },
    [setIsDarkRaw]
  );

  useEffect(() => {
    loadPresentations();
  }, []);

  useEffect(() => {
    if (isDarkValue) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkValue]);

  // Keyboard shortcuts: Command/Control+N to create new presentation, Command/Control+M for Media Library, Command/Control+T for theme toggle
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input/textarea
      const activeElement = document.activeElement;
      const isEditing =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.hasAttribute("contenteditable"));

      if (isEditing) {
        return; // Let the input handle the key
      }

      // Command+N or Control+N to create new presentation
      if ((e.metaKey || e.ctrlKey) && (e.key === "n" || e.key === "N")) {
        e.preventDefault();
        if (presentations.length < MAX_PRESENTATIONS) {
          setCreateDialogOpen(true);
        }
      }

      // Command+M or Control+M to open Media Library
      if ((e.metaKey || e.ctrlKey) && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        setMediaLibraryOpen(true);
      }

      // Command+T or Control+T to toggle theme
      if ((e.metaKey || e.ctrlKey) && (e.key === "t" || e.key === "T")) {
        e.preventDefault();
        setIsDark((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [presentations.length, setIsDark]);

  const loadPresentations = async () => {
    try {
      setIsLoading(true);
      const all = await db.getAllPresentations();
      setPresentations(all);
    } catch (error) {
      console.error("Error loading presentations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (name: string) => {
    try {
      if (presentations.length >= MAX_PRESENTATIONS) {
        alert(`Maximum of ${MAX_PRESENTATIONS} presentations allowed`);
        return;
      }

      const id = generateUUID();
      const now = Date.now();
      await db.savePresentation({
        id,
        name,
        markdown: "",
        createdAt: now,
        updatedAt: now,
      });

      await loadPresentations();
      navigate({ to: "/presentation/$id", params: { id } });
    } catch (error) {
      console.error("Error creating presentation:", error);
      alert("Failed to create presentation");
    }
  };

  const handleEdit = async (id: string, newName: string) => {
    try {
      const presentation = await db.getPresentation(id);
      if (presentation) {
        await db.savePresentation({
          id,
          name: newName,
          markdown: presentation.markdown,
        });
        await loadPresentations();
      }
    } catch (error) {
      console.error("Error updating presentation name:", error);
      alert("Failed to update presentation name");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await db.deletePresentation(id);
      await loadPresentations();
    } catch (error) {
      console.error("Error deleting presentation:", error);
      alert("Failed to delete presentation");
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      if (presentations.length >= MAX_PRESENTATIONS) {
        alert(`Maximum of ${MAX_PRESENTATIONS} presentations allowed`);
        return;
      }

      const original = await db.getPresentation(id);
      if (!original) {
        alert("Presentation not found");
        return;
      }

      const newId = generateUUID();
      const now = Date.now();
      await db.savePresentation({
        id: newId,
        name: `${original.name} (Copy)`,
        markdown: original.markdown,
        createdAt: now,
        updatedAt: now,
      });

      await loadPresentations();
    } catch (error) {
      console.error("Error duplicating presentation:", error);
      alert("Failed to duplicate presentation");
    }
  };

  const handleViewSample = async () => {
    try {
      if (presentations.length >= MAX_PRESENTATIONS) {
        alert(`Maximum of ${MAX_PRESENTATIONS} presentations allowed`);
        return;
      }

      const id = generateUUID();
      const now = Date.now();
      await db.savePresentation({
        id,
        name: "React Server Components Architecture",
        markdown: seedMarkdown,
        createdAt: now,
        updatedAt: now,
      });

      await loadPresentations();
      navigate({ to: "/presentation/$id", params: { id } });
    } catch (error) {
      console.error("Error creating sample presentation:", error);
      alert("Failed to create sample presentation");
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <AppHeader isDark={isDarkValue} setIsDark={setIsDark} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar with controls */}
        {presentations.length > 0 && (
          <div className="px-6 py-4 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setCreateDialogOpen(true)}
                disabled={presentations.length >= MAX_PRESENTATIONS}
                className="px-3 py-1 text-xs sm:text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Presentation (^N)</span>
                <span className="sm:hidden">New Presentation</span>
              </Button>
              <Button
                onClick={() => setMediaLibraryOpen(true)}
                className="px-3 py-1 text-xs sm:text-sm border rounded border-gray-400 dark:border-gray-600 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
              >
                <ImagePlus className="w-4 h-4" />
                <span className="hidden sm:inline">Media Library (^M)</span>
                <span className="sm:hidden">Media (^M)</span>
              </Button>
              {presentations.length >= MAX_PRESENTATIONS && (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Maximum of {MAX_PRESENTATIONS} presentations reached
                </span>
              )}
            </div>

            {/* View mode toggle */}
            <div className="flex items-center gap-2">
              <Grid3x3 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <Switch
                checked={viewMode === "list"}
                onCheckedChange={(checked) =>
                  setViewMode(checked ? "list" : "gallery")
                }
              />
              <List className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        )}

        {/* Presentations grid/list */}
        <div className="flex-1 overflow-y-auto p-6">
          {presentations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <img
                src="/no-ppt.svg"
                alt="No presentations"
                className="w-auto h-24 mb-6"
              />
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                No presentations yet?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <Button
                  onClick={() => setCreateDialogOpen(true)}
                  className="px-3 py-1 text-xs sm:text-sm border rounded border-gray-400 dark:border-gray-300 text-gray-900 dark:text-gray-900 bg-white dark:bg-white hover:bg-gray-50 dark:hover:bg-gray-100 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create Your First Presentation
                </Button>
                <Button
                  onClick={handleViewSample}
                  btnType="primary"
                  className="px-3 py-1 text-xs sm:text-sm flex items-center gap-2"
                >
                  Add Sample Presentation
                </Button>
              </div>
            </div>
          ) : viewMode === "gallery" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {presentations.map((pres) => (
                <PresentationCard
                  key={pres.id}
                  presentation={pres}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          ) : (
            <div className="max-w-full">
              <PresentationsTable
                presentations={presentations}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onDuplicate={handleDuplicate}
              />
            </div>
          )}
        </div>
      </div>

      <CreatePresentationDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreate={handleCreate}
        currentCount={presentations.length}
      />

      <MediaLibraryModal
        open={mediaLibraryOpen}
        onOpenChange={setMediaLibraryOpen}
      />
    </div>
  );
}
