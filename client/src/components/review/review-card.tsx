import { Star, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ReviewWithUser } from "@shared/schema";

interface ReviewCardProps {
  review: ReviewWithUser;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - d.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return d.toLocaleDateString();
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img 
            src={review.book.coverImage || 'https://via.placeholder.com/64x96?text=No+Cover'} 
            alt={`${review.book.title} cover`} 
            className="w-16 h-20 rounded-lg shadow-sm object-cover flex-shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900 truncate">{review.book.title}</h4>
              <div className="flex text-yellow-400 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'stroke-current fill-none'}`} 
                  />
                ))}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">by {review.book.author}</p>
            
            <div className="flex items-center space-x-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={review.user.avatar || undefined} />
                <AvatarFallback>{review.user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-600">@{review.user.username}</span>
            </div>
            
            {review.title && (
              <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
            )}
            
            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
              {review.content}
            </p>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{formatDate(review.createdAt!)}</span>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="hover:text-red-500 transition-colors p-0 h-auto">
                  <Heart className="w-4 h-4 mr-1" />
                  {review.likesCount} likes
                </Button>
                <Button variant="ghost" size="sm" className="hover:text-red-500 transition-colors p-0 h-auto">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
