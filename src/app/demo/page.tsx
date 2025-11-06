'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Sparkles, DollarSign, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function DemoPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; tripIds?: string[] } | null>(null);
  const router = useRouter();

  const handlePopulateDemo = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult(data);

      if (data.success && data.tripIds && data.tripIds.length > 0) {
        // Redirect to the first trip after a short delay
        setTimeout(() => {
          router.push(`/trips/${data.tripIds[0]}`);
        }, 2000);
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to connect to demo API',
      });
    } finally {
      setLoading(false);
    }
  };

  const demoTrips = [
    {
      destination: 'Paris, France',
      duration: '7 days',
      budget: '$2,500',
      status: 'planned',
      highlights: ['Eiffel Tower', 'Louvre Museum', 'Seine Cruise']
    },
    {
      destination: 'Tokyo, Japan',
      duration: '10 days',
      budget: '$3,500',
      status: 'ongoing',
      highlights: ['Shibuya Crossing', 'Senso-ji Temple', 'Tokyo Skytree']
    },
    {
      destination: 'Barcelona, Spain',
      duration: '7 days',
      budget: '$1,800',
      status: 'completed',
      highlights: ['Park Güell', 'Sagrada Familia', 'Gothic Quarter']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TripAI Demo</h1>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to App
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Experience TripAI with Sample Data
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Populate your account with realistic demo trips, itineraries, and expenses to explore all features.
          </p>
        </div>

        {/* Demo Trips Preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {demoTrips.map((trip, index) => (
            <Card key={index} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                    {trip.destination}
                  </CardTitle>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trip.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : trip.status === 'ongoing'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {trip.status}
                  </span>
                </div>
                <CardDescription className="flex items-center space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {trip.duration}
                  </span>
                  <span className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {trip.budget}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Highlights:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {trip.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-3 w-3 mr-2 text-green-500" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Card */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Sparkles className="h-6 w-6 mr-2 text-blue-600" />
              Generate Demo Data
            </CardTitle>
            <CardDescription>
              This will create 3 sample trips with complete itineraries, expenses, and budget tracking data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                3 Sample Trips
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                AI Itineraries
              </span>
              <span className="flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                Budget Tracking
              </span>
            </div>

            {result && (
              <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={result.success ? 'text-green-800' : 'text-red-800'}>
                  {result.message}
                  {result.success && result.tripIds && (
                    <div className="mt-2">
                      <p className="text-sm">Created {result.tripIds.length} trips. Redirecting to first trip...</p>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handlePopulateDemo}
              disabled={loading}
              size="lg"
              className="min-w-48"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Demo Data...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Populate Demo Data
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Features List */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            What You'll Get
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">✈️ Complete Trip Management</h4>
              <p className="text-sm text-gray-600">View trip details, itineraries, and manage all aspects of your travel planning.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">🤖 AI-Generated Itineraries</h4>
              <p className="text-sm text-gray-600">See how our AI creates personalized day-by-day plans with activities and meals.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">💰 Budget Tracking</h4>
              <p className="text-sm text-gray-600">Experience full budget management with category breakdowns and spending analytics.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-800">📊 Expense Management</h4>
              <p className="text-sm text-gray-600">Add, edit, and track expenses with detailed categorization and receipt uploads.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}