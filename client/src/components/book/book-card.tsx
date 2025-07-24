import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import type { BookWithUserData, RecommendationWithMatch } from "@shared/schema";

interface BookCardProps {
  book: BookWithUserData | RecommendationWithMatch;
  showProgress?: boolean;
  showMatch?: boolean;
}

export default function BookCard({ book, showProgress = false, showMatch = false }: BookCardProps) {
  const isRecommendation = 'matchPercentage' in book;
  const rating = parseFloat(book.averageRating || '0');

  return (
    <Card className="hover:shadow-md transition-all cursor-pointer group">
      <CardContent className="p-4">
        <img 
          src={book.coverImage || 'https://via.placeholder.com/200x300?text=No+Cover'} 
          alt={`${book.title} cover`} 
          className="w-full h-32 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
        />
        
        <h4 className="font-semibold text-sm text-gray-900 mb-1 truncate">{book.title}</h4>
        <p className="text-xs text-gray-600 mb-2 truncate">{book.author}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs">
            <div className="flex text-yellow-400 mr-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'stroke-current fill-none'}`} 
                />
              ))}
            </div>
            <span className="text-gray-600">{rating.toFixed(1)}</span>
          </div>
          
          {showMatch && isRecommendation && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
              {book.matchPercentage}% match
            </Badge>
          )}
        </div>

        {showProgress && 'progress' in book && book.progress && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{book.progress}%</span>
            </div>
            <Progress value={book.progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
