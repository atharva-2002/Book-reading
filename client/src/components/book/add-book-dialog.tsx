import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AddBookDialogProps {
  children: React.ReactNode;
}

export default function AddBookDialog({ children }: AddBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState("");
  const [status, setStatus] = useState("want-to-read");
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createBookMutation = useMutation({
    mutationFn: async (bookData: any) => {
      // First create the book
      const bookResponse = await apiRequest("POST", "https://book-reading-hy4n.onrender.com/api/books", {
        title,
        author,
        isbn: isbn || undefined,
        totalPages: parseInt(totalPages),
        publishedYear: publishedYear ? parseInt(publishedYear) : undefined,
        description: description || undefined,
        genres: genres ? genres.split(",").map(g => g.trim()) : [],
      });
      
      const book = await bookResponse.json();
      
      // Then add it to user's library
      const userBookResponse = await apiRequest("POST", "https://book-reading-hy4n.onrender.com/api/user/books", {
        bookId: book.id,
        status,
        currentPage: 0,
      });
      
      return userBookResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "Book added",
        description: `${title} has been added to your library`,
      });
      setOpen(false);
      // Reset form
      setTitle("");
      setAuthor("");
      setIsbn("");
      setTotalPages("");
      setPublishedYear("");
      setDescription("");
      setGenres("");
      setStatus("want-to-read");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add book",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && author && totalPages) {
      createBookMutation.mutate({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="author">Author *</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="totalPages">Total Pages *</Label>
              <Input
                id="totalPages"
                type="number"
                min="1"
                value={totalPages}
                onChange={(e) => setTotalPages(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="publishedYear">Published Year</Label>
            <Input
              id="publishedYear"
              type="number"
              min="1000"
              max={new Date().getFullYear()}
              value={publishedYear}
              onChange={(e) => setPublishedYear(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="genres">Genres (comma-separated)</Label>
            <Input
              id="genres"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="Fiction, Romance, Contemporary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Reading Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="want-to-read">Want to Read</SelectItem>
                <SelectItem value="reading">Currently Reading</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createBookMutation.isPending}
              className="bg-red-500 hover:bg-red-600"
            >
              {createBookMutation.isPending ? "Adding..." : "Add Book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
