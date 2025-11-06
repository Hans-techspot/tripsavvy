'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, MapPin, Calendar, DollarSign, TrendingUp, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { setupDemo } from '@/lib/demo-seeder';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch user's trips
      // For now, empty array
    }
  }, [user]);

  const handleDemoSetup = async () => {
    setIsLoadingDemo(true);
    try {
      await setupDemo(user!.id);
      // Refresh the page to show the new trips
      window.location.reload();
    } catch (error) {
      console.error('Demo setup failed:', error);
      alert('Demo setup failed. Please try again.');
    } finally {
      setIsLoadingDemo(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome to TripAI</CardTitle>
            <CardDescription>
              AI-powered travel planning with smart budget tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/signup">
              <Button className="w-full" size="lg">
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full" size="lg">
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-2xl font-bold text-gray-900">TripAI</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.full_name}</span>
              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Plan Your Next Adventure
          </h2>
          <p className="text-gray-600">
            Let AI create personalized itineraries and track your budget effortlessly.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/new-trip">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Trip
                </CardTitle>
                <CardDescription>
                  Start planning with AI-generated itineraries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Budget Tracker
              </CardTitle>
              <CardDescription>
                Monitor expenses and stay within budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Budgets
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                My Trips
              </CardTitle>
              <CardDescription>
                Manage and view your travel plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Trips
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-purple-700">
                <Sparkles className="h-5 w-5 mr-2" />
                Try Demo
              </CardTitle>
              <CardDescription>
                Explore sample trips with AI itineraries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                onClick={handleDemoSetup}
                disabled={isLoadingDemo}
              >
                {isLoadingDemo ? 'Loading...' : 'Load Demo Data'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Trips</h3>
          {trips.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">
                  No trips yet
                </h4>
                <p className="text-gray-500 mb-4">
                  Start your first adventure by creating a new trip plan or try our demo data.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleDemoSetup} disabled={isLoadingDemo}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isLoadingDemo ? 'Loading...' : 'Try Demo'}
                  </Button>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Trip
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trip cards would go here */}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}