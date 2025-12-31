/**
 * Database adapter interface for presentation storage.
 * This abstraction allows switching between different storage backends
 * (IndexedDB, PostgreSQL, etc.) with minimal code changes.
 */

export interface Presentation {
  id: string;
  name: string;
  markdown: string;
  createdAt: number;
  updatedAt: number;
}

export interface DatabaseAdapter {
  /**
   * Get a presentation by ID
   */
  getPresentation(id: string): Promise<Presentation | undefined>;

  /**
   * Save a presentation (creates if doesn't exist, updates if it does)
   */
  savePresentation(presentation: Omit<Presentation, "createdAt" | "updatedAt"> & Partial<Pick<Presentation, "createdAt" | "updatedAt">>): Promise<Presentation>;

  /**
   * Get all presentations
   */
  getAllPresentations(): Promise<Presentation[]>;

  /**
   * Delete a presentation by ID
   */
  deletePresentation(id: string): Promise<void>;
}

