import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { BookWithUserData } from "@shared/schema";

interface ProgressTrackerProps {
  book: BookWithUserData;
}

export default function ProgressTracker({ book }: ProgressTrackerProps) {
  const [currentPage, setCurrentPage] = useState(book.userBook?.currentPage || 0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateProgressMutation = useMutation({
    mutationFn: async (newPage: number) => {
      const response = await apiRequest(
        "PUT",
        `/api/user/books/${book.id}`,
        { currentPage: newPage }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/books"] });
      toast({
        title: "Progress updated",
        description: `Updated to page ${currentPage} of ${book.totalPages}`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update progress",
        variant: "destructive",
      });
    }
  });

  const progress = Math.round((currentPage / book.totalPages) * 100);

  const handleUpdateProgress = () => {
    if (currentPage >= 0 && currentPage <= book.totalPages) {
      updateProgressMutation.mutate(currentPage);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">{book.title}</h3>
            <p className="text-gray-600 text-sm">by {book.author}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progress}% ({currentPage}/{book.totalPages} pages)</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="current-page">Current Page</Label>
            <div className="flex space-x-2">
              <Input
                id="current-page"
                type="number"
                min="0"
                max={book.totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value) || 0)}
                className="flex-1"
              />
              <Button 
                onClick={handleUpdateProgress}
                disabled={updateProgressMutation.isPending}
                className="bg-red-500 hover:bg-red-600"
              >
                {updateProgressMutation.isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>

          {progress === 100 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-medium">🎉 Congratulations!</p>
              <p className="text-green-700 text-sm">You've finished reading this book!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
