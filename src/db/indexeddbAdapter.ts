import Dexie, { type Table } from "dexie";
import type { DatabaseAdapter, Presentation } from "./adapter";
import initialMarkdown from "../data/seed.md?raw";
import { parseFrontmatter } from "../utils/parseFrontmatter";

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
 * Default presentation ID
 */
const DEFAULT_PRESENTATION_ID = "default";

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
   * Initialize the database and seed initial data if needed
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    // Check if we have any presentations
    const count = await this.db.presentations.count();
    
    if (count === 0) {
      // Seed initial data from seed.md
      const { frontmatter } = parseFrontmatter(initialMarkdown);
      const now = Date.now();
      await this.db.presentations.add({
        id: DEFAULT_PRESENTATION_ID,
        name: frontmatter.title || "Untitled Presentation",
        markdown: initialMarkdown,
        createdAt: now,
        updatedAt: now,
      });
    }

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

  /**
   * Get the default presentation ID
   */
  getDefaultPresentationId(): string {
    return DEFAULT_PRESENTATION_ID;
  }
}

