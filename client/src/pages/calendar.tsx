import Header from "@/components/layout/header";
import ReadingCalendar from "@/components/calendar/reading-calendar";

export default function Calendar() {
  return (
    <div className="min-h-screen bg-[hsl(247,40%,97%)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reading Calendar</h1>
          <p className="text-gray-600 mt-2">Schedule your reading sessions and track your progress</p>
        </div>
        
        <ReadingCalendar />
      </main>
    </div>
  );
}
