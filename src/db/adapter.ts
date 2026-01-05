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

export interface MediaItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number; // in bytes
  dataUrl: string; // base64 encoded image data URL
  alt?: string; // alternative text for accessibility
  createdAt: number;
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

  /**
   * Get a media item by ID
   */
  getMedia(id: string): Promise<MediaItem | undefined>;

  /**
   * Save a media item (creates if doesn't exist, updates if it does)
   */
  saveMedia(media: Omit<MediaItem, "createdAt"> & Partial<Pick<MediaItem, "createdAt">>): Promise<MediaItem>;

  /**
   * Get all media items
   */
  getAllMedia(): Promise<MediaItem[]>;

  /**
   * Delete a media item by ID
   */
  deleteMedia(id: string): Promise<void>;
}

