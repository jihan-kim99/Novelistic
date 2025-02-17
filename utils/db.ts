import { Novel, NovelImage, Episode } from "../types/database";

const DB_NAME = "novelisticDB";
const DB_VERSION = 2;

export class NovelisticDB {
  private db: IDBDatabase | null = null;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    // Return existing initialization if in progress
    if (this.initPromise) return this.initPromise;

    // Create new initialization promise
    this.initPromise = new Promise((resolve, reject) => {
      console.log("Initializing database...");
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error("Database initialization failed:", request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        this.initialized = true;
        console.log("Database initialized successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        console.log("Database upgrade needed");
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("novels")) {
          const novelStore = db.createObjectStore("novels", {
            keyPath: "id",
            autoIncrement: true,
          });
          novelStore.createIndex("title", "title", { unique: false });
          novelStore.createIndex("updatedAt", "updatedAt", { unique: false });

          // Add default empty notes structure when creating new novels
          novelStore.createIndex("notes", "notes", { unique: false });
        }

        if (!db.objectStoreNames.contains("episodes")) {
          const episodeStore = db.createObjectStore("episodes", {
            keyPath: "id",
            autoIncrement: true,
          });
          episodeStore.createIndex("novelId", "novelId", { unique: false });
          episodeStore.createIndex("order", "order", { unique: false });
          episodeStore.createIndex("title", "title", { unique: false });
        }

        if (!db.objectStoreNames.contains("images")) {
          const imageStore = db.createObjectStore("images", {
            keyPath: "id",
            autoIncrement: true,
          });
          imageStore.createIndex("novelId", "novelId", { unique: false });
        }
      };
    });

    return this.initPromise;
  }

  private ensureInitialized() {
    if (!this.initialized || !this.db) {
      throw new Error(
        "Database not initialized. Call init() first and await its completion."
      );
    }
  }

  async saveNovel(novel: Novel): Promise<number> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["novels"], "readwrite");
      const store = transaction.objectStore("novels");
      const request = store.put(novel);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getNovel(id: number): Promise<Novel | null> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["novels"], "readonly");
      const store = transaction.objectStore("novels");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllNovels(): Promise<Novel[]> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["novels"], "readonly");
      const store = transaction.objectStore("novels");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveImage(image: NovelImage): Promise<number> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["images"], "readwrite");
      const store = transaction.objectStore("images");
      const request = store.put(image);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getNovelImages(novelId: number): Promise<NovelImage[]> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["images"], "readonly");
      const store = transaction.objectStore("images");
      const index = store.index("novelId");
      const request = index.getAll(novelId);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveEpisode(episode: Episode): Promise<number> {
    this.ensureInitialized();

    // Ensure notes structure exists
    const episodeWithNotes: Episode = {
      ...episode,
      notes: episode.notes || {
        characters: [],
        settings: [],
        plotPoints: [],
        style: "",
      },
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["episodes"], "readwrite");
      const store = transaction.objectStore("episodes");
      const request = store.put(episodeWithNotes);

      request.onsuccess = () => resolve(request.result as number);
      request.onerror = () => reject(request.error);
    });
  }

  async getEpisode(id: number): Promise<Episode | null> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["episodes"], "readonly");
      const store = transaction.objectStore("episodes");
      const request = store.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getNovelEpisodes(novelId: number): Promise<Episode[]> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["episodes"], "readonly");
      const store = transaction.objectStore("episodes");
      const index = store.index("novelId");
      const request = index.getAll(novelId);

      request.onsuccess = () => {
        const episodes = request.result || [];
        resolve(episodes.sort((a, b) => a.order - b.order));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async deleteEpisode(id: number): Promise<void> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["episodes"], "readwrite");
      const store = transaction.objectStore("episodes");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteNovel(id: number): Promise<void> {
    this.ensureInitialized();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(
        ["novels", "images", "episodes"],
        "readwrite"
      );

      // Delete the novel
      const novelStore = transaction.objectStore("novels");
      novelStore.delete(id);

      // Delete associated episodes
      const episodeStore = transaction.objectStore("episodes");
      const episodeIndex = episodeStore.index("novelId");
      const episodeRequest = episodeIndex.getAllKeys(id);

      episodeRequest.onsuccess = () => {
        const episodeKeys = episodeRequest.result;
        episodeKeys.forEach((key) => {
          episodeStore.delete(key);
        });
      };

      // Delete associated images
      const imageStore = transaction.objectStore("images");
      const imageIndex = imageStore.index("novelId");
      const imageRequest = imageIndex.getAllKeys(id);

      imageRequest.onsuccess = () => {
        const imageKeys = imageRequest.result;
        imageKeys.forEach((key) => {
          imageStore.delete(key);
        });
      };

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }
}

export const db = new NovelisticDB();
// Export initialization promise for external use
export const dbInitialized = db.init().catch((err) => {
  console.error("Failed to initialize database:", err);
  throw err;
});
