export interface TripDetails {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
  groupSize: number;
  accommodationType?: string;
  transportation?: string;
}

export interface DailyPlan {
  day: number;
  date: string;
  activities: {
    time: string;
    activity: string;
    description: string;
    cost?: number;
    category: string;
  }[];
  meals: {
    type: string;
    suggestion: string;
    cost?: number;
  }[];
  notes?: string;
}

export interface ItineraryResponse {
  title: string;
  description: string;
  dailyPlans: DailyPlan[];
  totalCostEstimate: number;
  tips: string[];
}

export async function generateItinerary(tripDetails: TripDetails): Promise<ItineraryResponse> {
  const prompt = `Generate a detailed travel itinerary for a trip to ${tripDetails.destination} from ${tripDetails.startDate} to ${tripDetails.endDate}.

Trip Details:
- Budget: $${tripDetails.budget}
- Group size: ${tripDetails.groupSize} people
- Interests: ${tripDetails.interests.join(', ')}
- Accommodation preference: ${tripDetails.accommodationType || 'flexible'}
- Transportation: ${tripDetails.transportation || 'flexible'}

Please provide a JSON response with the following structure:
{
  "title": "Trip title",
  "description": "Brief description of the itinerary",
  "dailyPlans": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "HH:MM",
          "activity": "Activity name",
          "description": "Detailed description",
          "cost": 50,
          "category": "activities"
        }
      ],
      "meals": [
        {
          "type": "breakfast",
          "suggestion": "Restaurant or food suggestion",
          "cost": 15
        }
      ],
      "notes": "Optional notes for the day"
    }
  ],
  "totalCostEstimate": 1500,
  "tips": ["Tip 1", "Tip 2"]
}

Focus on:
- Realistic costs within the budget
- Activities matching interests
- Local experiences and culture
- Weather-appropriate activities
- Group size considerations
- Balance between popular attractions and hidden gems`;

  const response = await fetch('https://api.a0.dev/ai/llm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are a travel planning expert. Generate detailed, realistic itineraries based on user preferences.'
        },
        {
          role: 'user',
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`AI API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.completion;
  if (!content) {
    throw new Error('Failed to generate itinerary');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Invalid AI response format');
  }
}