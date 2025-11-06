/**
 * Demo Data for TripAI Travel Planning App
 * This file contains sample data to populate the database for demonstration purposes
 */

export interface DemoTrip {
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
  interests: string[];
  group_size: number;
  accommodation_type?: string;
  transportation?: string;
  status: string;
}

export interface DemoItinerary {
  trip_id: string;
  title: string;
  description: string;
  ai_generated: boolean;
  daily_plans: any[];
  total_cost_estimate?: number;
}

export interface DemoExpense {
  trip_id: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  receipt_url?: string;
  is_recurring: boolean;
}

export interface DemoBudgetCategory {
  trip_id: string;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  currency: string;
}

// Sample Demo Trips
export const demoTrips: DemoTrip[] = [
  {
    user_id: "demo-user-1", // This will be replaced with actual user ID
    destination: "Paris, France",
    start_date: "2024-07-15",
    end_date: "2024-07-22",
    total_budget: 2500,
    currency: "USD",
    interests: ["Culture & History", "Food & Dining", "Photography", "Museums"],
    group_size: 2,
    accommodation_type: "mid-range",
    transportation: "flight",
    status: "planned"
  },
  {
    user_id: "demo-user-1",
    destination: "Tokyo, Japan",
    start_date: "2024-09-01",
    end_date: "2024-09-10",
    total_budget: 3500,
    currency: "USD",
    interests: ["Culture & History", "Food & Dining", "Adventure & Outdoors", "Nightlife & Entertainment"],
    group_size: 1,
    accommodation_type: "budget",
    transportation: "flight",
    status: "ongoing"
  },
  {
    user_id: "demo-user-1",
    destination: "Barcelona, Spain",
    start_date: "2024-05-10",
    end_date: "2024-05-17",
    total_budget: 1800,
    currency: "USD",
    interests: ["Culture & History", "Food & Dining", "Beach", "Nightlife & Entertainment"],
    group_size: 3,
    accommodation_type: "mid-range",
    transportation: "flight",
    status: "completed"
  }
];

// Sample Demo Itineraries
export const demoItineraries: DemoItinerary[] = [
  {
    trip_id: "demo-trip-1", // This will be replaced with actual trip ID
    title: "Romantic Paris Getaway",
    description: "A 7-day romantic journey through the City of Light, featuring iconic landmarks, fine dining, and cultural experiences.",
    ai_generated: true,
    daily_plans: [
      {
        day: 1,
        date: "2024-07-15",
        title: "Arrival & Eiffel Tower Magic",
        activities: [
          {
            time: "14:00",
            activity: "Check into hotel in Le Marais",
            description: "Comfortable boutique hotel with Parisian charm",
            cost: 180,
            category: "accommodation"
          },
          {
            time: "16:00",
            activity: "Visit Eiffel Tower",
            description: "Iconic landmark with stunning city views",
            cost: 85,
            category: "activities"
          },
          {
            time: "19:00",
            activity: "Dinner at Le Jules Verne",
            description: "Fine dining with Eiffel Tower views",
            cost: 250,
            category: "food"
          }
        ],
        meals: [
          { type: "Breakfast", suggestion: "Hotel breakfast", cost: 25 },
          { type: "Lunch", suggestion: "Café near Eiffel Tower", cost: 45 },
          { type: "Dinner", suggestion: "Le Jules Verne", cost: 250 }
        ],
        total_cost: 585
      },
      {
        day: 2,
        date: "2024-07-16",
        title: "Art & Montmartre",
        activities: [
          {
            time: "10:00",
            activity: "Louvre Museum",
            description: "World's largest art museum featuring the Mona Lisa",
            cost: 65,
            category: "activities"
          },
          {
            time: "15:00",
            activity: "Montmartre & Sacré-Cœur",
            description: "Artists' quarter and stunning basilica views",
            cost: 0,
            category: "activities"
          },
          {
            time: "19:00",
            activity: "Dinner in Montmartre",
            description: "Traditional French bistro cuisine",
            cost: 120,
            category: "food"
          }
        ],
        meals: [
          { type: "Breakfast", suggestion: "Hotel breakfast", cost: 25 },
          { type: "Lunch", suggestion: "Café in Louvre area", cost: 35 },
          { type: "Dinner", suggestion: "Montmartre bistro", cost: 120 }
        ],
        total_cost: 245
      },
      {
        day: 3,
        date: "2024-07-17",
        title: "Seine River Cruise",
        activities: [
          {
            time: "14:00",
            activity: "Seine River Cruise",
            description: "Scenic boat tour of Paris landmarks",
            cost: 75,
            category: "activities"
          },
          {
            time: "18:00",
            activity: "Latin Quarter Exploration",
            description: "Historic student district with cafés and bookstores",
            cost: 0,
            category: "activities"
          },
          {
            time: "20:00",
            activity: "Dinner at a local bistro",
            description: "Authentic French cuisine in the Latin Quarter",
            cost: 95,
            category: "food"
          }
        ],
        meals: [
          { type: "Breakfast", suggestion: "Hotel breakfast", cost: 25 },
          { type: "Lunch", suggestion: "Seine-side café", cost: 40 },
          { type: "Dinner", suggestion: "Latin Quarter bistro", cost: 95 }
        ],
        total_cost: 235
      }
    ],
    total_cost_estimate: 1500
  },
  {
    trip_id: "demo-trip-2",
    title: "Tokyo Adventure",
    description: "A 10-day exploration of Japan's vibrant capital, blending traditional culture with modern innovation.",
    ai_generated: true,
    daily_plans: [
      {
        day: 1,
        date: "2024-09-01",
        title: "Arrival & Shibuya Crossing",
        activities: [
          {
            time: "15:00",
            activity: "Check into capsule hotel in Shibuya",
            description: "Modern capsule hotel with all amenities",
            cost: 45,
            category: "accommodation"
          },
          {
            time: "17:00",
            activity: "Shibuya Crossing Experience",
            description: "World's busiest pedestrian crossing",
            cost: 0,
            category: "activities"
          },
          {
            time: "19:00",
            activity: "Dinner at Ichiran Ramen",
            description: "Famous tonkotsu ramen restaurant",
            cost: 25,
            category: "food"
          }
        ],
        meals: [
          { type: "Breakfast", suggestion: "Hotel breakfast", cost: 15 },
          { type: "Lunch", suggestion: "Airport meal", cost: 20 },
          { type: "Dinner", suggestion: "Ichiran Ramen", cost: 25 }
        ],
        total_cost: 105
      },
      {
        day: 2,
        date: "2024-09-02",
        title: "Traditional Tokyo",
        activities: [
          {
            time: "09:00",
            activity: "Senso-ji Temple",
            description: "Tokyo's oldest temple in Asakusa",
            cost: 0,
            category: "activities"
          },
          {
            time: "13:00",
            activity: "Tokyo Skytree",
            description: "Tallest structure in Japan with panoramic views",
            cost: 35,
            category: "activities"
          },
          {
            time: "18:00",
            activity: "Dinner in Ginza",
            description: "Upscale dining district",
            cost: 80,
            category: "food"
          }
        ],
        meals: [
          { type: "Breakfast", suggestion: "Hotel breakfast", cost: 15 },
          { type: "Lunch", suggestion: "Street food in Asakusa", cost: 25 },
          { type: "Dinner", suggestion: "Ginza restaurant", cost: 80 }
        ],
        total_cost: 155
      }
    ],
    total_cost_estimate: 2200
  },
  {
    trip_id: "demo-trip-3",
    title: "Barcelona Cultural Journey",
    description: "A vibrant 7-day exploration of Catalonia's capital, featuring Gaudí architecture and Mediterranean culture.",
    ai_generated: true,
    daily_plans: [
      {
        day: 1,
        date: "2024-05-10",
        title: "Arrival & Gothic Quarter",
        activities: [
          {
            time: "14:00",
            activity: "Check into hotel in Eixample",
            description: "Modern hotel in the heart of the city",
            cost: 120,
            category: "accommodation"
          },
          {
            time: "16:00",
            activity: "Gothic Quarter Exploration",
            description: "Medieval streets and historic architecture",
            cost: 0,
            category: "activities"
          },
          {
            time: "19:00",
            activity: "Tapas dinner",
            description: "Traditional Spanish small plates",
            cost: 65,
            category: "food"
          }
        ],
        meals: [
          { type: "Breakfast", suggestion: "Hotel breakfast", cost: 20 },
          { type: "Lunch", suggestion: "Café in Gothic Quarter", cost: 30 },
          { type: "Dinner", suggestion: "Tapas restaurant", cost: 65 }
        ],
        total_cost: 235
      }
    ],
    total_cost_estimate: 1200
  }
];

// Sample Demo Expenses
export const demoExpenses: DemoExpense[] = [
  // Paris Trip Expenses
  {
    trip_id: "demo-trip-1",
    category: "transportation",
    description: "Round-trip flights from NYC to Paris",
    amount: 850,
    currency: "USD",
    date: "2024-07-15",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-1",
    category: "accommodation",
    description: "7 nights at Hotel Le Marais",
    amount: 1260,
    currency: "USD",
    date: "2024-07-15",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-1",
    category: "food",
    description: "Dinner at Le Jules Verne",
    amount: 250,
    currency: "USD",
    date: "2024-07-15",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-1",
    category: "activities",
    description: "Louvre Museum tickets",
    amount: 65,
    currency: "USD",
    date: "2024-07-16",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-1",
    category: "activities",
    description: "Seine River cruise",
    amount: 75,
    currency: "USD",
    date: "2024-07-17",
    is_recurring: false
  },

  // Tokyo Trip Expenses
  {
    trip_id: "demo-trip-2",
    category: "transportation",
    description: "Round-trip flights from NYC to Tokyo",
    amount: 1200,
    currency: "USD",
    date: "2024-09-01",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-2",
    category: "accommodation",
    description: "Capsule hotel in Shibuya",
    amount: 45,
    currency: "USD",
    date: "2024-09-01",
    is_recurring: true
  },
  {
    trip_id: "demo-trip-2",
    category: "food",
    description: "Ichiran Ramen dinner",
    amount: 25,
    currency: "USD",
    date: "2024-09-01",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-2",
    category: "activities",
    description: "Tokyo Skytree observation deck",
    amount: 35,
    currency: "USD",
    date: "2024-09-02",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-2",
    category: "shopping",
    description: "Electronics and souvenirs",
    amount: 150,
    currency: "USD",
    date: "2024-09-03",
    is_recurring: false
  },

  // Barcelona Trip Expenses
  {
    trip_id: "demo-trip-3",
    category: "transportation",
    description: "Round-trip flights from NYC to Barcelona",
    amount: 600,
    currency: "USD",
    date: "2024-05-10",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-3",
    category: "accommodation",
    description: "7 nights at Hotel Arts",
    amount: 980,
    currency: "USD",
    date: "2024-05-10",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-3",
    category: "food",
    description: "Tapas and paella dinners",
    amount: 180,
    currency: "USD",
    date: "2024-05-11",
    is_recurring: false
  },
  {
    trip_id: "demo-trip-3",
    category: "activities",
    description: "Park Güell and Sagrada Familia",
    amount: 90,
    currency: "USD",
    date: "2024-05-12",
    is_recurring: false
  }
];

// Sample Demo Budget Categories
export const demoBudgetCategories: DemoBudgetCategory[] = [
  // Paris Trip Budget
  {
    trip_id: "demo-trip-1",
    category: "accommodation",
    allocated_amount: 1400,
    spent_amount: 1260,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-1",
    category: "transportation",
    allocated_amount: 900,
    spent_amount: 850,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-1",
    category: "food",
    allocated_amount: 600,
    spent_amount: 515,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-1",
    category: "activities",
    allocated_amount: 400,
    spent_amount: 225,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-1",
    category: "shopping",
    allocated_amount: 150,
    spent_amount: 0,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-1",
    category: "misc",
    allocated_amount: 50,
    spent_amount: 0,
    currency: "USD"
  },

  // Tokyo Trip Budget
  {
    trip_id: "demo-trip-2",
    category: "accommodation",
    allocated_amount: 500,
    spent_amount: 225,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-2",
    category: "transportation",
    allocated_amount: 1300,
    spent_amount: 1200,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-2",
    category: "food",
    allocated_amount: 800,
    spent_amount: 405,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-2",
    category: "activities",
    allocated_amount: 600,
    spent_amount: 35,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-2",
    category: "shopping",
    allocated_amount: 200,
    spent_amount: 150,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-2",
    category: "misc",
    allocated_amount: 100,
    spent_amount: 0,
    currency: "USD"
  },

  // Barcelona Trip Budget
  {
    trip_id: "demo-trip-3",
    category: "accommodation",
    allocated_amount: 1000,
    spent_amount: 980,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-3",
    category: "transportation",
    allocated_amount: 650,
    spent_amount: 600,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-3",
    category: "food",
    allocated_amount: 400,
    spent_amount: 180,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-3",
    category: "activities",
    allocated_amount: 300,
    spent_amount: 90,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-3",
    category: "shopping",
    allocated_amount: 100,
    spent_amount: 0,
    currency: "USD"
  },
  {
    trip_id: "demo-trip-3",
    category: "misc",
    allocated_amount: 50,
    spent_amount: 0,
    currency: "USD"
  }
];

/**
 * Helper function to populate demo data
 * Note: This should only be used for development/demo purposes
 */
export async function populateDemoData(userId: string) {
  const { createRecord } = await import('./database');

  try {
    // Create trips
    const tripIds: string[] = [];
    for (const trip of demoTrips) {
      const tripData = { ...trip, user_id: userId };
      const record = await createRecord('trips', tripData);
      tripIds.push(record.id);
    }

    // Create itineraries
    for (let i = 0; i < demoItineraries.length; i++) {
      const itinerary = demoItineraries[i];
      const itineraryData = { ...itinerary, trip_id: tripIds[i] };
      await createRecord('itineraries', itineraryData);
    }

    // Create expenses
    const expenseMappings = [
      { tripIndex: 0, expenses: demoExpenses.slice(0, 5) },
      { tripIndex: 1, expenses: demoExpenses.slice(5, 10) },
      { tripIndex: 2, expenses: demoExpenses.slice(10, 14) }
    ];

    for (const mapping of expenseMappings) {
      for (const expense of mapping.expenses) {
        const expenseData = { ...expense, trip_id: tripIds[mapping.tripIndex] };
        await createRecord('expenses', expenseData);
      }
    }

    // Create budget categories
    const categoryMappings = [
      { tripIndex: 0, categories: demoBudgetCategories.slice(0, 6) },
      { tripIndex: 1, categories: demoBudgetCategories.slice(6, 12) },
      { tripIndex: 2, categories: demoBudgetCategories.slice(12, 18) }
    ];

    for (const mapping of categoryMappings) {
      for (const category of mapping.categories) {
        const categoryData = { ...category, trip_id: tripIds[mapping.tripIndex] };
        await createRecord('budget_categories', categoryData);
      }
    }

    console.log('Demo data populated successfully!');
    return tripIds;
  } catch (error) {
    console.error('Error populating demo data:', error);
    throw error;
  }
}