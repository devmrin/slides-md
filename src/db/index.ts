import { IndexedDBAdapter } from "./indexeddbAdapter";
import type { DatabaseAdapter } from "./adapter";

/**
 * Singleton database instance using IndexedDB adapter.
 * To switch to a different backend (e.g., PostgreSQL), simply replace
 * IndexedDBAdapter with a different implementation of DatabaseAdapter.
 */
export const db: DatabaseAdapter = new IndexedDBAdapter();

// Re-export types for convenience
export type { Presentation, DatabaseAdapter } from "./adapter";

