import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import RecommendationGrid from "@/components/recommendations/recommendation-grid";
import ReviewCard from "@/components/review/review-card";
import ReadingCalendar from "@/components/calendar/reading-calendar";
import AddBookDialog from "@/components/book/add-book-dialog";
import { BookOpen, Target, TrendingUp, Calendar as CalendarIcon, Plus } from "lucide-react";
import type { BookWithUserData, ReviewWithUser, ReadingStats } from "@shared/schema";

export default function Dashboard() {
  const { data: currentlyReading = [], isLoading: loadingBooks } = useQuery<BookWithUserData[]>({
    queryKey: ["/api/user/books"],
    queryFn: async () => {
      const response = await fetch("https://book-reading-hy4n.onrender.com/api/user/books?status=reading");
      return response.json();
    }
  });

  const { data: stats, isLoading: loadingStats } = useQuery<ReadingStats>({
    queryKey: ["/api/user/stats"],
    queryFn: async () => {
      const response = await fetch("https://book-reading-hy4n.onrender.com/api/user/stats");
      return response.json();
    }
  });

  const { data: recentReviews = [], isLoading: loadingReviews } = useQuery<ReviewWithUser[]>({
    queryKey: ["/api/reviews"],
    queryFn: async () => {
      const response = await fetch("https://book-reading-hy4n.onrender.com/api/reviews?limit=2");
      return response.json();
    }
  });

  if (loadingBooks || loadingStats || loadingReviews) {
    return (
      <div className="min-h-screen bg-[hsl(247,40%,97%)]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-48 bg-gray-200 rounded-2xl"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-32 bg-gray-200 rounded-xl"></div>
              <div className="h-32 bg-gray-200 rounded-xl"></div>
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
        {/* Hero Section */}
        <section className="mb-12">
          <div className="gradient-bg rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><g fill="white"><circle cx="10" cy="10" r="1"/><circle cx="50" cy="30" r="1"/><circle cx="90" cy="20" r="1"/><circle cx="30" cy="70" r="1"/><circle cx="70" cy="90" r="1"/></g></svg>')`,
                backgroundSize: '100px 100px'
              }}></div>
            </div>
            
            <div className="relative z-10 max-w-4xl">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome back to your reading journey</h2>
              <p className="text-xl mb-6 text-gray-100">Track your progress, discover new books, and join a community of passionate readers.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 border-0 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-100">Books Read This Year</span>
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold">{stats?.booksReadThisYear || 0}</div>
                </Card>
                
                <Card className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 border-0 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-100">Reading Streak</span>
                    <Target className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold">{stats?.currentStreak || 0} days</div>
                </Card>
                
                <Card className="bg-white bg-opacity-10 backdrop-blur rounded-xl p-4 border-0 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-100">Next Goal</span>
                    <BookOpen className="w-5 h-5 text-red-400" />
                  </div>
                  <div className="text-3xl font-bold">30 books</div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Currently Reading */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Currently Reading</h3>
            <Button variant="ghost" className="text-red-500 hover:text-red-600">View All</Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentlyReading.length === 0 ? (
              <Card className="p-8 text-center col-span-full">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">No books currently reading</h4>
                <p className="text-gray-500 mb-4">Start your reading journey by adding a book to your library.</p>
                <AddBookDialog>
                  <Button className="bg-red-500 hover:bg-red-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Book
                  </Button>
                </AddBookDialog>
              </Card>
            ) : (
              currentlyReading.map((book) => (
                <Card key={book.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex space-x-4">
                    <img 
                      src={book.coverImage || 'https://via.placeholder.com/80x112?text=No+Cover'} 
                      alt={`${book.title} cover`} 
                      className="w-20 h-28 rounded-lg shadow-sm object-cover"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-lg font-semibold text-gray-900 mb-1 truncate">{book.title}</h4>
                      <p className="text-gray-600 mb-3">{book.author}</p>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {book.progress}% ({book.userBook?.currentPage || 0}/{book.totalPages} pages)
                          </span>
                        </div>
                        <Progress value={book.progress || 0} className="h-2" />
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 p-0">
                          <Plus className="w-4 h-4 mr-1" />
                          Update Progress
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-800 p-0">
                          <BookOpen className="w-4 h-4 mr-1" />
                          Bookmark
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Recommendations */}
        <RecommendationGrid />

        {/* Recent Reviews */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-semibold">Recent Reviews</h3>
            <Button variant="ghost" className="text-red-500 hover:text-red-600">Write a Review</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentReviews.length === 0 ? (
              <Card className="p-8 text-center col-span-full">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-600 mb-2">No reviews yet</h4>
                <p className="text-gray-500">Share your thoughts about books you've read.</p>
              </Card>
            ) : (
              recentReviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </div>
        </section>

        {/* Reading Calendar */}
        <ReadingCalendar />
      </main>

      {/* Floating Action Button */}
      <AddBookDialog>
        <Button 
          size="lg"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-red-500 hover:bg-red-600 transition-all duration-300"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </AddBookDialog>
    </div>
  );
}
