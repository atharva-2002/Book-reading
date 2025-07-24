import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import ReviewCard from "@/components/review/review-card";
import WriteReviewDialog from "@/components/review/write-review-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Plus, Search } from "lucide-react";
import type { ReviewWithUser } from "@shared/schema";

export default function Reviews() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: reviews = [], isLoading } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      const response = await fetch("/api/reviews?limit=50");
      return response.json();
    }
  });

  const filteredReviews = reviews.filter(review =>
    review.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(247,40%,97%)]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(247,40%,97%)]">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Book Reviews</h1>
            <p className="text-gray-600 mt-2">Share your thoughts and discover what others are reading</p>
          </div>
          <WriteReviewDialog>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Write Review
            </Button>
          </WriteReviewDialog>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search reviews, books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {searchQuery ? "No reviews found" : "No reviews yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? "Try adjusting your search terms" 
                : "Be the first to share your thoughts about a book you've read"
              }
            </p>
            <WriteReviewDialog>
              <Button className="bg-red-500 hover:bg-red-600">
                <Plus className="w-4 h-4 mr-2" />
                Write First Review
              </Button>
            </WriteReviewDialog>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
