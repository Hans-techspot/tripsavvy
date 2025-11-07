import { openDB, type IDBPDatabase } from 'idb';

interface Trip {
  id?: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
  interests: string[];
  group_size: number;
  accommodation_type?: string | null;
  transportation?: string | null;
  status: string;
  created_at?: Date;
}

interface Itinerary {
  id?: string;
  trip_id: string;
  title: string;
  description: string;
  ai_generated: boolean;
  daily_plans: any;
  total_cost_estimate: number;
  created_at?: Date;
}

interface BudgetCategory {
  id?: string;
  trip_id: string;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  currency: string;
  created_at?: Date;
}

class IndexedDatabase {
  private _db: Promise<IDBPDatabase<any>> | null = null;

  constructor() {}

  private get db(): Promise<IDBPDatabase<any>> {
    if (this._db) return this._db;

    if (typeof window === 'undefined') {
      throw new Error('IndexedDB is not available on server-side');
    }

    this._db = openDB('TripAI_Demo', 2, {
      upgrade(db, oldVersion, newVersion) {
        // Users store (already exists from auth)
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
        }

        // Trips store
        if (!db.objectStoreNames.contains('trips')) {
          const tripStore = db.createObjectStore('trips', { keyPath: 'id' });
          tripStore.createIndex('user_id', 'user_id');
          tripStore.createIndex('destination', 'destination');
        }

        // Itineraries store
        if (!db.objectStoreNames.contains('itineraries')) {
          const itineraryStore = db.createObjectStore('itineraries', { keyPath: 'id' });
          itineraryStore.createIndex('trip_id', 'trip_id');
        }

        // Budget categories store
        if (!db.objectStoreNames.contains('budget_categories')) {
          const budgetStore = db.createObjectStore('budget_categories', { keyPath: 'id' });
          budgetStore.createIndex('trip_id', 'trip_id');
          budgetStore.createIndex('category', 'category');
        }
      },
    });

    return this._db;
  }

  async getRecords(tableId: string, filters?: any): Promise<{ records: any[] }> {
    const db = await this.db;
    const tx = db.transaction(tableId, 'readonly');
    const store = tx.objectStore(tableId);

    let records: any[] = [];

    if (filters && filters.user_id) {
      // Use index for user_id queries
      const index = store.index('user_id');
      records = await index.getAll(filters.user_id);
    } else if (filters && filters.trip_id) {
      // Use index for trip_id queries
      const index = store.index('trip_id');
      records = await index.getAll(filters.trip_id);
    } else {
      // Get all records
      records = await store.getAll();
    }

    return { records };
  }

  async createRecord(tableId: string, data: any): Promise<any> {
    const db = await this.db;
    const tx = db.transaction(tableId, 'readwrite');
    const store = tx.objectStore(tableId);

    // Generate ID if not provided
    if (!data.id) {
      data.id = crypto.randomUUID();
    }

    // Add timestamp
    if (!data.created_at) {
      data.created_at = new Date();
    }

    // For API compatibility, wrap data in data_json field
    const record = {
      id: data.id,
      data_json: data,
      created_at: data.created_at
    };

    await store.add(record);

    return record;
  }

  async updateRecord(tableId: string, recordId: string, data: any): Promise<any> {
    const db = await this.db;
    const tx = db.transaction(tableId, 'readwrite');
    const store = tx.objectStore(tableId);

    const existing = await store.get(recordId);
    if (!existing) {
      throw new Error('Record not found');
    }

    // Merge existing data with updates
    const updatedData = {
      ...existing.data_json,
      ...data,
      id: recordId,
      updated_at: new Date()
    };

    const record = {
      id: recordId,
      data_json: updatedData,
      created_at: existing.created_at,
      updated_at: updatedData.updated_at
    };

    await store.put(record);

    return record;
  }

  async deleteRecord(tableId: string, recordId: string): Promise<any> {
    const db = await this.db;
    const tx = db.transaction(tableId, 'readwrite');
    const store = tx.objectStore(tableId);

    const existing = await store.get(recordId);
    if (!existing) {
      throw new Error('Record not found');
    }

    await store.delete(recordId);

    return { success: true };
  }

  // Trip-specific methods for convenience
  async getTripsByUser(userId: string): Promise<Trip[]> {
    const { records } = await this.getRecords('trips', { user_id: userId });
    return records.map(r => r.data_json);
  }

  async getTripById(tripId: string): Promise<Trip | null> {
    const db = await this.db;
    const tx = db.transaction('trips', 'readonly');
    const store = tx.objectStore('trips');
    const record = await store.get(tripId);
    return record ? record.data_json : null;
  }

  async getItineraryByTripId(tripId: string): Promise<Itinerary | null> {
    const { records } = await this.getRecords('itineraries', { trip_id: tripId });
    return records.length > 0 ? records[0].data_json : null;
  }

  async getBudgetCategoriesByTripId(tripId: string): Promise<BudgetCategory[]> {
    const { records } = await this.getRecords('budget_categories', { trip_id: tripId });
    return records.map(r => r.data_json);
  }
}

const dbInstance = new IndexedDatabase();

// Export standalone functions for compatibility
export async function getRecords(tableId: string, filters?: any) {
  return dbInstance.getRecords(tableId, filters);
}

export async function createRecord(tableId: string, data: any) {
  return dbInstance.createRecord(tableId, data);
}

export async function updateRecord(tableId: string, recordId: string, data: any) {
  return dbInstance.updateRecord(tableId, recordId, data);
}

export async function deleteRecord(tableId: string, recordId: string) {
  return dbInstance.deleteRecord(tableId, recordId);
}

export async function getTripsByUser(userId: string) {
  return dbInstance.getTripsByUser(userId);
}

export async function getTripById(tripId: string) {
  return dbInstance.getTripById(tripId);
}

export async function getItineraryByTripId(tripId: string) {
  return dbInstance.getItineraryByTripId(tripId);
}

export async function getBudgetCategoriesByTripId(tripId: string) {
  return dbInstance.getBudgetCategoriesByTripId(tripId);
}

export const indexedDatabase = dbInstance;
export type { Trip, Itinerary, BudgetCategory };