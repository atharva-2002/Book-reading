import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ReadingSession } from "@shared/schema";

export default function ReadingCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading } = useQuery<ReadingSession[]>({
    queryKey: ["/api/reading-sessions"],
    queryFn: async () => {
      const response = await fetch("/api/reading-sessions");
      return response.json();
    }
  });

  const selectedDateSessions = sessions.filter(session => 
    selectedDate && 
    new Date(session.scheduledDate).toDateString() === selectedDate.toDateString()
  );

  const modifiers = {
    hasSession: sessions.map(session => new Date(session.scheduledDate)),
    completed: sessions
      .filter(session => session.isCompleted)
      .map(session => new Date(session.scheduledDate)),
  };

  const modifiersStyles = {
    hasSession: { 
      backgroundColor: 'hsl(142, 71%, 45%)', 
      color: 'white',
      borderRadius: '50%' 
    },
    completed: { 
      backgroundColor: 'hsl(0, 84.2%, 60.2%)', 
      color: 'white',
      borderRadius: '50%' 
    },
  };

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
        <div className="h-32 bg-gray-200 rounded-xl"></div>
      </div>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Reading Calendar</h3>
          <p className="text-gray-600 mt-1">Your scheduled reading sessions and reminders</p>
        </div>
        <Button className="bg-red-500 hover:bg-red-600">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Reading
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              modifiers={modifiers}
              modifiersStyles={modifiersStyles}
              className="rounded-md border"
            />
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Reading Session</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-gray-600">Completed</span>
                  </div>
                </div>
                <div className="text-gray-600">
                  Next: {sessions.length > 0 ? "Today 8:00 PM" : "No sessions scheduled"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateSessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No reading sessions scheduled</p>
                <Button size="sm" className="bg-red-500 hover:bg-red-600">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Session
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-sm">
                          {new Date(session.scheduledDate).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {session.isCompleted && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                      </div>
                      {session.duration && (
                        <p className="text-xs text-gray-500">{session.duration} minutes</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
