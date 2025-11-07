// Re-export IndexedDB database functions for demo mode
export {
  indexedDatabase,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getTripsByUser,
  getTripById,
  getItineraryByTripId,
  getBudgetCategoriesByTripId,
  type Trip,
  type Itinerary,
  type BudgetCategory
} from './indexedDatabase';