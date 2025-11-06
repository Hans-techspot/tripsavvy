# Database Schema Prompts for Travel Planning App

Please create the following tables in your Pipilot database using these exact prompts. Copy and paste each prompt into the Pipilot schema generator.

## 1. Trips Table
```
Create a table named "trips" with the following fields:
- id: UUID, primary key, auto-generated
- user_id: UUID, foreign key to users table (required)
- destination: TEXT, required
- start_date: DATE, required
- end_date: DATE, required
- total_budget: DECIMAL(10,2), required, default 0.00
- currency: TEXT, required, default 'USD'
- interests: TEXT[], optional (array of strings)
- group_size: INTEGER, optional, default 1
- accommodation_type: TEXT, optional (hotel, apartment, hostel, etc.)
- transportation: TEXT, optional (flight, train, car, etc.)
- status: TEXT, required, default 'planned' (planned, ongoing, completed)
- created_at: TIMESTAMP WITH TIME ZONE, auto-generated
- updated_at: TIMESTAMP WITH TIME ZONE, auto-generated

Add indexes on:
- user_id
- start_date
- status
```

## 2. Itineraries Table
```
Create a table named "itineraries" with the following fields:
- id: UUID, primary key, auto-generated
- trip_id: UUID, foreign key to trips table (required)
- title: TEXT, required
- description: TEXT, optional
- ai_generated: BOOLEAN, required, default true
- daily_plans: JSONB, required (array of daily activities)
- total_cost_estimate: DECIMAL(10,2), optional
- created_at: TIMESTAMP WITH TIME ZONE, auto-generated
- updated_at: TIMESTAMP WITH TIME ZONE, auto-generated

Add indexes on:
- trip_id
```

## 3. Expenses Table
```
Create a table named "expenses" with the following fields:
- id: UUID, primary key, auto-generated
- trip_id: UUID, foreign key to trips table (required)
- category: TEXT, required (accommodation, transportation, food, activities, shopping, misc)
- description: TEXT, required
- amount: DECIMAL(10,2), required
- currency: TEXT, required, default 'USD'
- date: DATE, required
- receipt_url: TEXT, optional (for uploaded receipts)
- is_recurring: BOOLEAN, default false
- created_at: TIMESTAMP WITH TIME ZONE, auto-generated
- updated_at: TIMESTAMP WITH TIME ZONE, auto-generated

Add indexes on:
- trip_id
- category
- date
```

## 4. Budget Categories Table
```
Create a table named "budget_categories" with the following fields:
- id: UUID, primary key, auto-generated
- trip_id: UUID, foreign key to trips table (required)
- category: TEXT, required (accommodation, transportation, food, activities, shopping, misc)
- allocated_amount: DECIMAL(10,2), required, default 0.00
- spent_amount: DECIMAL(10,2), required, default 0.00
- currency: TEXT, required, default 'USD'
- created_at: TIMESTAMP WITH TIME ZONE, auto-generated
- updated_at: TIMESTAMP WITH TIME ZONE, auto-generated

Add indexes on:
- trip_id
- category
```

## Foreign Key Constraints
Ensure all foreign key relationships are properly set up with CASCADE delete where appropriate.

## Notes
- The users table is automatically created by the authentication system
- All monetary fields use DECIMAL(10,2) for precision
- JSONB fields allow flexible storage of itinerary data
- Indexes are crucial for performance on common query patterns