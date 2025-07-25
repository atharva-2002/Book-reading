import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookCard from "@/components/book/book-card";
import { RefreshCw, BookOpen } from "lucide-react";
import type { RecommendationWithMatch } from "@shared/schema";

export default function RecommendationGrid() {
  const { data: recommendations = [], isLoading, refetch } = useQuery<RecommendationWithMatch[]>({
    queryKey: ["/api/recommendations"],
    queryFn: async () => {
      const response = await fetch("https://book-reading-hy4n.onrender.com/api/recommendations?limit=6");
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-semibold">Recommended for You</h3>
            <p className="text-gray-600 mt-1">Based on your reading history and preferences</p>
          </div>
          <Button variant="ghost" disabled>
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-semibold">Recommended for You</h3>
          <p className="text-gray-600 mt-1">Based on your reading history and preferences</p>
        </div>
        <Button variant="ghost" onClick={() => refetch()} className="text-red-500 hover:text-red-600">
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>
      
      {recommendations.length === 0 ? (
        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-600 mb-2">No recommendations available</h4>
          <p className="text-gray-500">Add more books to your library to get personalized recommendations.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {recommendations.map((book) => (
            <BookCard key={book.id} book={book} showMatch={true} />
          ))}
        </div>
      )}
    </section>
  );
}
