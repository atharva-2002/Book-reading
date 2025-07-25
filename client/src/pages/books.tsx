import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import BookCard from "@/components/book/book-card";
import AddBookDialog from "@/components/book/add-book-dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, BookOpen } from "lucide-react";
import type { BookWithUserData } from "@shared/schema";

export default function Books() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const { data: allBooks = [], isLoading } = useQuery<BookWithUserData[]>({
  queryKey: ["/api/user/books", activeTab],
  queryFn: async () => {
    const endpoint =
      activeTab === "all"
        ? "https://book-reading-hy4n.onrender.com/api/user/books"
        : `https://book-reading-hy4n.onrender.com/api/user/books?status=${activeTab}`;

    const response = await fetch(endpoint, {
      credentials: "include", // Add this if your backend uses cookies/sessions
    });
    return response.json();
  }
});

  const filteredBooks = allBooks.filter(book =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[hsl(247,40%,97%)]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded-lg"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
            <p className="text-gray-600 mt-2">Manage your reading collection</p>
          </div>
          <AddBookDialog>
            <Button className="bg-red-500 hover:bg-red-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </Button>
          </AddBookDialog>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search books, authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="reading">Reading</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="want-to-read">Want to Read</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-8">
            {filteredBooks.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchQuery ? "No books found" : "No books in your library"}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery 
                    ? "Try adjusting your search terms" 
                    : "Start building your reading collection by adding some books"
                  }
                </p>
                <AddBookDialog>
                  <Button className="bg-red-500 hover:bg-red-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Book
                  </Button>
                </AddBookDialog>
              </Card>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} showProgress={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
