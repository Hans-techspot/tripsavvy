'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, DollarSign, Clock, Users, Star, Plus, Edit } from 'lucide-react';
import { getRecords } from '@/lib/database';

interface Trip {
  id: string;
  destination: string;
  start_date: string;
  end_date: string;
  total_budget: number;
  currency: string;
  status: string;
  interests: string[];
  group_size: number;
}

interface Itinerary {
  id: string;
  title: string;
  description: string;
  daily_plans: any[];
  total_cost_estimate: number;
}

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export default function TripDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [budgetCategories, setBudgetCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && id) {
      fetchTripData();
    }
  }, [user, id]);

  const fetchTripData = async () => {
    try {
      // Fetch trip
      const trips = await getRecords('trips');
      const tripData = trips.find((t: any) => t.id === id);
      if (!tripData) {
        router.push('/');
        return;
      }
      setTrip(tripData);

      // Fetch itinerary
      const itineraries = await getRecords('itineraries');
      const itineraryData = itineraries.find((i: any) => i.trip_id === id);
      setItinerary(itineraryData);

      // Fetch expenses
      const expensesData = await getRecords('expenses');
      setExpenses(expensesData.filter((e: any) => e.trip_id === id));

      // Fetch budget categories
      const budgetData = await getRecords('budget_categories');
      setBudgetCategories(budgetData.filter((b: any) => b.trip_id === id));
    } catch (error) {
      console.error('Error fetching trip data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalSpent = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategorySpent = (category: string) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h2>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const totalSpent = calculateTotalSpent();
  const remainingBudget = trip.total_budget - totalSpent;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => router.back()} className="mr-4">
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{trip.destination}</h1>
                <p className="text-gray-600">
                  {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={trip.status === 'completed' ? 'default' : 'secondary'}>
                {trip.status}
              </Badge>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Trip
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${trip.total_budget.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${remainingBudget < 0 ? 'text-red-600' : 'text-green-600'}`}>
                ${remainingBudget.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="itinerary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>

          {/* Itinerary Tab */}
          <TabsContent value="itinerary" className="space-y-6">
            {itinerary ? (
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>{itinerary.title}</CardTitle>
                    <CardDescription>{itinerary.description}</CardDescription>
                  </CardHeader>
                </Card>

                <div className="space-y-4">
                  {itinerary.daily_plans.map((day: any, index: number) => (
                    <Card key={index}>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="h-5 w-5 mr-2" />
                          Day {day.day}: {new Date(day.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Activities */}
                        <div>
                          <h4 className="font-semibold mb-2">Activities</h4>
                          <div className="space-y-2">
                            {day.activities.map((activity: any, actIndex: number) => (
                              <div key={actIndex} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                <Clock className="h-4 w-4 mt-0.5 text-gray-500" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{activity.time} - {activity.activity}</span>
                                    {activity.cost && (
                                      <Badge variant="outline">${activity.cost}</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Meals */}
                        {day.meals && day.meals.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Meals</h4>
                            <div className="space-y-2">
                              {day.meals.map((meal: any, mealIndex: number) => (
                                <div key={mealIndex} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span>{meal.type}: {meal.suggestion}</span>
                                  {meal.cost && <Badge variant="outline">${meal.cost}</Badge>}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {day.notes && (
                          <div>
                            <h4 className="font-semibold mb-2">Notes</h4>
                            <p className="text-sm text-gray-600">{day.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No itinerary yet</h3>
                  <p className="text-gray-500">Itinerary is being generated...</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {budgetCategories.map((category) => {
                const spent = getCategorySpent(category.category);
                const percentage = category.allocated_amount > 0 ? (spent / category.allocated_amount) * 100 : 0;

                return (
                  <Card key={category.id}>
                    <CardHeader>
                      <CardTitle className="capitalize">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span>Allocated: ${category.allocated_amount}</span>
                        <span>Spent: ${spent}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${percentage > 100 ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {percentage.toFixed(1)}% used
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Expenses</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>

            {expenses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
                  <p className="text-gray-500">Start tracking your trip expenses</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <Card key={expense.id}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{expense.description}</h4>
                          <p className="text-sm text-gray-600 capitalize">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${expense.amount}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}