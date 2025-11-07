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

// Helper function to extract JSON from AI response text
function extractJsonFromText(text: string): any {
  // Try direct parsing first
  try {
    return JSON.parse(text);
  } catch {
    // If direct parsing fails, try to extract JSON from text
    // Look for JSON object/array patterns
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // If still fails, try to clean up the JSON
        const cleanedJson = jsonMatch[0]
          .replace(/[\u201C\u201D]/g, '"') // Smart quotes
          .replace(/[\u2018\u2019]/g, "'") // Smart apostrophes
          .replace(/\n/g, ' ') // Remove newlines within strings
          .replace(/\s+/g, ' '); // Normalize whitespace
        return JSON.parse(cleanedJson);
      }
    }
    throw new Error('No valid JSON found in response');
  }
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
- Balance between popular attractions and hidden gems

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON.`;

  const response = await fetch('https://api.a0.dev/ai/llm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'You are a travel planning expert. Generate detailed, realistic itineraries based on user preferences. Always respond with valid JSON only.'
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
    return extractJsonFromText(content);
  } catch (error) {
    console.error('AI Response Content:', content);
    throw new Error('Invalid AI response format');
  }
}