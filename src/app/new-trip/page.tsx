'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Calendar, Users, DollarSign, Sparkles } from 'lucide-react';
import { generateItinerary } from '@/lib/ai';
import { createRecord } from '@/lib/database';

export default function NewTripPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    interests: [] as string[],
    groupSize: '1',
    accommodationType: '',
    transportation: '',
    customInterests: ''
  });

  const interestOptions = [
    'Culture & History', 'Food & Dining', 'Adventure & Outdoors',
    'Relaxation & Wellness', 'Nightlife & Entertainment', 'Shopping',
    'Nature & Wildlife', 'Sports & Activities'
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Combine interests
      const allInterests = [...formData.interests];
      if (formData.customInterests.trim()) {
        allInterests.push(...formData.customInterests.split(',').map(i => i.trim()));
      }

      // Generate itinerary with AI
      const tripDetails = {
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: parseFloat(formData.budget),
        interests: allInterests,
        groupSize: parseInt(formData.groupSize),
        accommodationType: formData.accommodationType,
        transportation: formData.transportation
      };

      const itinerary = await generateItinerary(tripDetails);

      // Save trip to database
      const tripData = {
        user_id: user?.id,
        destination: formData.destination,
        start_date: formData.startDate,
        end_date: formData.endDate,
        total_budget: parseFloat(formData.budget),
        currency: 'USD',
        interests: allInterests,
        group_size: parseInt(formData.groupSize),
        accommodation_type: formData.accommodationType || null,
        transportation: formData.transportation || null,
        status: 'planned'
      };

      const tripRecord = await createRecord('trips', tripData);

      // Save itinerary
      const itineraryData = {
        trip_id: tripRecord.id,
        title: itinerary.title,
        description: itinerary.description,
        ai_generated: true,
        daily_plans: itinerary.dailyPlans,
        total_cost_estimate: itinerary.totalCostEstimate
      };

      await createRecord('itineraries', itineraryData);

      // Create budget categories
      const categories = ['accommodation', 'transportation', 'food', 'activities', 'shopping', 'misc'];
      for (const category of categories) {
        await createRecord('budget_categories', {
          trip_id: tripRecord.id,
          category,
          allocated_amount: 0,
          spent_amount: 0,
          currency: 'USD'
        });
      }

      router.push(`/trips/${tripRecord.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      alert('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">Create New Trip</h1>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Trip Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Trip Details
              </CardTitle>
              <CardDescription>
                Tell us about your destination and travel dates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Paris, France"
                    value={formData.destination}
                    onChange={(e) => setFormData(prev => ({ ...prev, destination: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="budget">Total Budget (USD)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 2000"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="groupSize">Group Size</Label>
                  <Select value={formData.groupSize} onValueChange={(value) => setFormData(prev => ({ ...prev, groupSize: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Solo</SelectItem>
                      <SelectItem value="2">Couple</SelectItem>
                      <SelectItem value="3">Small Group (3)</SelectItem>
                      <SelectItem value="4">Family (4)</SelectItem>
                      <SelectItem value="5">Group (5+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Travel Preferences
              </CardTitle>
              <CardDescription>
                Help us customize your perfect itinerary
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Interests (select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {interestOptions.map((interest) => (
                    <Button
                      key={interest}
                      type="button"
                      variant={formData.interests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleInterestToggle(interest)}
                      className="justify-start"
                    >
                      {interest}
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customInterests">Custom Interests (comma-separated)</Label>
                  <Input
                    id="customInterests"
                    placeholder="e.g., Photography, Wine tasting, Museums"
                    value={formData.customInterests}
                    onChange={(e) => setFormData(prev => ({ ...prev, customInterests: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation Type</Label>
                  <Select value={formData.accommodationType} onValueChange={(value) => setFormData(prev => ({ ...prev, accommodationType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="budget">Budget (Hostel/Apartment)</SelectItem>
                      <SelectItem value="mid-range">Mid-range (Hotel)</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transportation">Transportation</Label>
                  <Select value={formData.transportation} onValueChange={(value) => setFormData(prev => ({ ...prev, transportation: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flight">Flight</SelectItem>
                      <SelectItem value="train">Train</SelectItem>
                      <SelectItem value="car">Car Rental</SelectItem>
                      <SelectItem value="bus">Bus/Coach</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="min-w-32">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Create Trip
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}