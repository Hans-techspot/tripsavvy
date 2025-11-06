# TripAI Demo Data

This document explains how to use the demo functionality in the TripAI travel planning app.

## Overview

The demo system provides realistic sample data to help users explore all features of the TripAI application. It includes complete trips with AI-generated itineraries, budget tracking, and expense management.

## Demo Data Included

### Sample Trips
- **Paris, France** (7 days, $2,500 budget) - Romantic getaway with cultural highlights
- **Tokyo, Japan** (10 days, $3,500 budget) - Modern city exploration
- **Barcelona, Spain** (7 days, $1,800 budget) - Completed trip for reference

### Features Demonstrated
- ✅ AI-generated itineraries with daily activities
- ✅ Budget category allocation and tracking
- ✅ Expense logging with categorization
- ✅ Trip status management (planned, ongoing, completed)
- ✅ Multi-day itinerary with meals and activities

## How to Use Demo Data

### Method 1: Demo Page (Recommended)
1. Navigate to `/demo` in your browser
2. Review the sample trips preview
3. Click "Populate Demo Data" to create sample trips
4. You'll be automatically redirected to view the first trip

### Method 2: API Endpoint
```bash
POST /api/demo
```
This endpoint will populate demo data and return the created trip IDs.

### Method 3: Programmatic Usage
```typescript
import { populateDemoData } from '@/lib/demo-data';

// Populate demo data for a specific user
const tripIds = await populateDemoData('user-id');
```

## Demo Data Structure

### Trips Table
Each demo trip includes:
- Destination and dates
- Budget allocation
- Travel preferences (interests, group size, accommodation type)
- Trip status

### Itineraries Table
AI-generated itineraries with:
- Day-by-day breakdown
- Activities with times, descriptions, and costs
- Meal suggestions with pricing
- Total cost estimates

### Expenses Table
Realistic expenses across categories:
- Transportation (flights, local transit)
- Accommodation (hotels, stays)
- Food & dining (meals, restaurants)
- Activities (tours, attractions)
- Shopping (souvenirs, gifts)

### Budget Categories Table
Budget allocation and spending tracking for:
- Accommodation
- Transportation
- Food
- Activities
- Shopping
- Miscellaneous

## Resetting Demo Data

To reset demo data:
1. Delete trips through the UI
2. Or manually delete records from the database tables
3. Re-run the demo population

## Customization

The demo data is fully customizable. Edit `src/lib/demo-data.ts` to:
- Modify trip destinations and details
- Adjust budget amounts and allocations
- Change itinerary activities and costs
- Update expense entries

## Database Requirements

Ensure your PiPilot database has the following tables created:
- `trips`
- `itineraries`
- `expenses`
- `budget_categories`

Use the schema prompts in `database_schema_prompts.md` to create these tables.

## Support

For issues with demo data:
1. Check browser console for errors
2. Verify database connection and API keys
3. Ensure all required tables exist
4. Check that the user is authenticated

## Files Involved

- `src/lib/demo-data.ts` - Demo data definitions
- `src/app/demo/page.tsx` - Demo UI page
- `src/app/api/demo/route.ts` - Demo API endpoint
- `DEMO_README.md` - This documentation