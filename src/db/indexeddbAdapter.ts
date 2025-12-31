import Dexie, { type Table } from "dexie";
import type { DatabaseAdapter, Presentation } from "./adapter";

/**
 * Dexie database schema
 */
class SlidesDatabase extends Dexie {
  presentations!: Table<Presentation, string>;

  constructor() {
    super("SlidesMD");
    this.version(1).stores({
      presentations: "id, name, createdAt, updatedAt",
    });
  }
}


/**
 * IndexedDB adapter implementation using Dexie.js
 */
export class IndexedDBAdapter implements DatabaseAdapter {
  private db: SlidesDatabase;
  private initialized = false;

  constructor() {
    this.db = new SlidesDatabase();
  }

  /**
   * Initialize the database (no auto-seeding - HomePage handles empty state)
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Just ensure database is ready
    // HomePage will handle empty state and let users create their first presentation
    this.initialized = true;
  }

  async getPresentation(id: string): Promise<Presentation | undefined> {
    await this.initialize();
    return await this.db.presentations.get(id);
  }

  async savePresentation(
    presentation: Omit<Presentation, "createdAt" | "updatedAt"> & Partial<Pick<Presentation, "createdAt" | "updatedAt">>
  ): Promise<Presentation> {
    await this.initialize();
    
    const now = Date.now();
    const existing = await this.db.presentations.get(presentation.id);

    const fullPresentation: Presentation = {
      id: presentation.id,
      name: presentation.name,
      markdown: presentation.markdown,
      createdAt: existing?.createdAt ?? presentation.createdAt ?? now,
      updatedAt: now,
    };

    await this.db.presentations.put(fullPresentation);
    return fullPresentation;
  }

  async getAllPresentations(): Promise<Presentation[]> {
    await this.initialize();
    return await this.db.presentations.orderBy("updatedAt").reverse().toArray();
  }

  async deletePresentation(id: string): Promise<void> {
    await this.initialize();
    await this.db.presentations.delete(id);
  }
}

