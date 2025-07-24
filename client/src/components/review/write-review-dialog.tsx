import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BookWithUserData } from "@shared/schema";

interface WriteReviewDialogProps {
  children: React.ReactNode;
}

export default function WriteReviewDialog({ children }: WriteReviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userBooks = [] } = useQuery<BookWithUserData[]>({
    queryKey: ["/api/user/books"],
    queryFn: async () => {
      const response = await fetch("/api/user/books");
      return response.json();
    }
  });

  const createReviewMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reviews", {
        bookId: parseInt(selectedBookId),
        title: title || undefined,
        content,
        rating,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Review posted",
        description: "Your review has been shared successfully",
      });
      setOpen(false);
      // Reset form
      setSelectedBookId("");
      setTitle("");
      setContent("");
      setRating(0);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post review",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBookId && content && rating > 0) {
      createReviewMutation.mutate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="book">Select Book *</Label>
            <Select value={selectedBookId} onValueChange={setSelectedBookId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a book to review" />
              </SelectTrigger>
              <SelectContent>
                {userBooks.map((book) => (
                  <SelectItem key={book.id} value={book.id.toString()}>
                    {book.title} by {book.author}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Rating *</Label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none"
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Review Title (optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your review a title"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Review *</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts about this book..."
              rows={6}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createReviewMutation.isPending || !selectedBookId || !content || rating === 0}
              className="bg-red-500 hover:bg-red-600"
            >
              {createReviewMutation.isPending ? "Posting..." : "Post Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
