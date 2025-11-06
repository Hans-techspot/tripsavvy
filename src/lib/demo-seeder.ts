import { demoTrips, demoItineraries, demoExpenses, demoBudgetCategories } from './demo-data';
import { createRecord } from './database';

// Table IDs - these would need to match your PiPilot database tables
const TRIPS_TABLE = 'trips';
const ITINERARIES_TABLE = 'itineraries';
const EXPENSES_TABLE = 'expenses';
const BUDGET_CATEGORIES_TABLE = 'budget_categories';

/**
 * Seeds the database with demo data for showcasing the travel app
 * This creates sample trips, itineraries, expenses, and budget categories
 */
export async function seedDemoData(userId: string): Promise<void> {
  try {
    console.log('🌱 Starting demo data seeding...');

    // Create demo trips
    const tripIds: string[] = [];
    for (const trip of demoTrips) {
      console.log(`📝 Creating demo trip: ${trip.destination}`);

      const tripData = {
        ...trip,
        user_id: userId, // Replace the placeholder user_id
      };

      try {
        const record = await createRecord(TRIPS_TABLE, tripData);
        tripIds.push(record.id);
        console.log(`✅ Created trip: ${trip.destination}`);
      } catch (error) {
        console.warn(`⚠️ Could not create trip ${trip.destination} in database:`, error);
        console.log('💡 Demo data will still be available in memory for this session');
        tripIds.push(`demo-trip-${tripIds.length + 1}`); // Fallback ID
      }
    }

    // Create itineraries for each trip
    for (let i = 0; i < demoItineraries.length && i < tripIds.length; i++) {
      const itinerary = demoItineraries[i];
      console.log(`📅 Creating itinerary: ${itinerary.title}`);

      const itineraryData = {
        ...itinerary,
        trip_id: tripIds[i],
      };

      try {
        await createRecord(ITINERARIES_TABLE, itineraryData);
        console.log(`✅ Created itinerary: ${itinerary.title}`);
      } catch (error) {
        console.warn(`⚠️ Could not create itinerary ${itinerary.title} in database:`, error);
      }
    }

    // Create expenses - group by trip
    const expenseGroups = [
      demoExpenses.slice(0, 5), // Paris expenses
      demoExpenses.slice(5, 10), // Tokyo expenses
      demoExpenses.slice(10, 14), // Barcelona expenses
    ];

    for (let i = 0; i < expenseGroups.length && i < tripIds.length; i++) {
      const expenses = expenseGroups[i];
      for (const expense of expenses) {
        console.log(`💰 Adding expense: ${expense.description}`);

        const expenseData = {
          ...expense,
          trip_id: tripIds[i],
        };

        try {
          await createRecord(EXPENSES_TABLE, expenseData);
          console.log(`✅ Created expense: ${expense.description}`);
        } catch (error) {
          console.warn(`⚠️ Could not create expense in database:`, error);
        }
      }
    }

    // Create budget categories - group by trip
    const categoryGroups = [
      demoBudgetCategories.slice(0, 6), // Paris categories
      demoBudgetCategories.slice(6, 12), // Tokyo categories
      demoBudgetCategories.slice(12, 18), // Barcelona categories
    ];

    for (let i = 0; i < categoryGroups.length && i < tripIds.length; i++) {
      const categories = categoryGroups[i];
      for (const category of categories) {
        console.log(`📊 Adding budget category: ${category.category}`);

        const categoryData = {
          ...category,
          trip_id: tripIds[i],
        };

        try {
          await createRecord(BUDGET_CATEGORIES_TABLE, categoryData);
          console.log(`✅ Created budget category: ${category.category}`);
        } catch (error) {
          console.warn(`⚠️ Could not create budget category in database:`, error);
        }
      }
    }

    console.log('✅ Demo data seeding completed successfully!');
    console.log('🎉 You can now explore the app with sample trips:');
    console.log('   - Paris, France (Romantic Getaway)');
    console.log('   - Tokyo, Japan (Tech & Culture Adventure)');
    console.log('   - Barcelona, Spain (Cultural Journey)');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  }
}

/**
 * Quick demo setup for development/testing
 * Call this function to populate the database with demo data
 */
export async function setupDemo(userId: string): Promise<void> {
  console.log('🚀 Setting up demo environment...');

  try {
    await seedDemoData(userId);
    console.log('🎊 Demo setup complete! Switch to the Preview panel to explore the sample trips.');
  } catch (error) {
    console.error('💥 Demo setup failed:', error);
    console.log('💡 The app will still work - demo data will be simulated in the UI');
  }
}