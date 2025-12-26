'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Sparkles,
  Plane,
  Clock,
  Target,
  User,
  BarChart3,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { setupDemo } from '@/lib/demo-seeder';

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);

  useEffect(() => {
    if (user) {
      // Simulate loading trips
      const timer = setTimeout(() => {
        setIsLoadingTrips(false);
      }, 1000);
      return () => clearTimeout(timer);
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

  // Mock statistics - in real app, these would come from API
  const stats = {
    totalTrips: trips.length,
    upcomingTrips: 2,
    totalSpent: 2847,
    budgetUtilization: 68
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Plane className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TripAI
            </CardTitle>
            <CardDescription className="text-gray-600">
              AI-powered travel planning with smart budget tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/signup">
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" size="lg">
                <Sparkles className="h-4 w-4 mr-2" />
                Sign Up
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full border-gray-300 hover:bg-gray-50" size="lg">
                Log In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Enhanced Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TripAI
                </h1>
                <p className="text-xs text-gray-500">AI Travel Planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <Avatar className="h-8 w-8 ring-2 ring-blue-100">
                  <AvatarImage src="" alt={user.full_name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                    {user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={logout} className="border-gray-300">
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Welcome back, {user.full_name.split(' ')[0]}! 👋
              </h2>
              <p className="text-gray-600 text-lg">
                Ready to plan your next adventure? Let's explore the world together.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>Last login: Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-700">Total Trips</CardTitle>
                <MapPin className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalTrips}</div>
              <p className="text-xs text-blue-600 mt-1">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-700">Upcoming</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.upcomingTrips}</div>
              <p className="text-xs text-green-600 mt-1">Next: Paris 2024</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-purple-700">Total Spent</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">${stats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-purple-600 mt-1">68% of annual budget</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-700">Budget Usage</CardTitle>
                <Target className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{stats.budgetUtilization}%</div>
              <Progress value={stats.budgetUtilization} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/new-trip">
            <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white">
                  <div className="p-2 bg-white/20 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
                    <Plus className="h-5 w-5" />
                  </div>
                  Create New Trip
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Start planning with AI-generated itineraries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-white">
                <div className="p-2 bg-white/20 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
                  <TrendingUp className="h-5 w-5" />
                </div>
                Budget Tracker
              </CardTitle>
              <CardDescription className="text-emerald-100">
                Monitor expenses and stay within budget
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold">
                View Budgets
              </Button>
            </CardContent>
          </Card>

          <Link href="/trips">
            <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-br from-purple-500 to-purple-600 text-white group">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-white">
                  <div className="p-2 bg-white/20 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
                    <Calendar className="h-5 w-5" />
                  </div>
                  My Trips
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Manage and view your travel plans
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-white text-purple-600 hover:bg-purple-50 font-semibold">
                  View Trips
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-300 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 group">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-purple-700">
                <div className="p-2 bg-purple-100 rounded-lg mr-3 group-hover:bg-purple-200 transition-colors">
                  <Sparkles className="h-5 w-5" />
                </div>
                Try Demo
              </CardTitle>
              <CardDescription className="text-purple-600">
                Explore sample trips with AI itineraries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-purple-300 text-purple-700 hover:bg-purple-100 font-semibold"
                onClick={handleDemoSetup}
                disabled={isLoadingDemo}
              >
                {isLoadingDemo ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Load Demo Data
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Trips */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Recent Trips</h3>
              <p className="text-gray-600 mt-1">Your latest adventures and upcoming plans</p>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              <BarChart3 className="h-3 w-3 mr-1" />
              {trips.length} Active
            </Badge>
          </div>

          {isLoadingTrips ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse"></div>
                  <CardHeader>
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-3 w-full mb-2" />
                    <Skeleton className="h-3 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : trips.length === 0 ? (
            <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
              <CardContent className="py-16 text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
                  <MapPin className="h-10 w-10 text-gray-400" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  No trips yet
                </h4>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Start your first adventure by creating a new trip plan or try our interactive demo to see TripAI in action.
                </p>
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button onClick={handleDemoSetup} disabled={isLoadingDemo} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isLoadingDemo ? 'Loading...' : 'Try Demo'}
                  </Button>
                  <Link href="/new-trip">
                    <Button variant="outline" className="border-gray-300 hover:bg-gray-50">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Trip
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Trip cards would go here */}
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      <Award className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="font-semibold text-lg">Paris Adventure</h4>
                    <p className="text-sm opacity-90">Dec 2024</p>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="group-hover:text-blue-600 transition-colors">Paris 2024</CardTitle>
                      <CardDescription>7 days • $2,450</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      Confirmed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Eiffel Tower, Louvre Museum, Seine River cruise, and more...
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      15 days left
                    </div>
                    <Button size="sm" variant="outline">View Details</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}