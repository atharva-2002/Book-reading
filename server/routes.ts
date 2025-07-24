import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookSchema, insertUserBookSchema, insertReviewSchema, insertReadingSessionSchema, insertUserPreferencesSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const currentUserId = 1; // Mock authenticated user

  // Books endpoints
  app.get("/api/books", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const books = await storage.getBooks(limit, offset);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch books" });
    }
  });

  app.get("/api/books/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const books = await storage.searchBooks(query);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to search books" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const book = await storage.getBook(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
      res.json(book);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch book" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const validatedData = insertBookSchema.parse(req.body);
      const book = await storage.createBook(validatedData);
      res.status(201).json(book);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid book data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create book" });
    }
  });

  // User Books endpoints
  app.get("/api/user/books", async (req, res) => {
    try {
      const status = req.query.status as string;
      const books = await storage.getUserBooks(currentUserId, status);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user books" });
    }
  });

  app.post("/api/user/books", async (req, res) => {
    try {
      const validatedData = insertUserBookSchema.parse({
        ...req.body,
        userId: currentUserId
      });
      const userBook = await storage.addUserBook(validatedData);
      res.status(201).json(userBook);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user book data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add book to library" });
    }
  });

  app.put("/api/user/books/:bookId", async (req, res) => {
    try {
      const bookId = parseInt(req.params.bookId);
      const updates = req.body;
      const userBook = await storage.updateUserBook(currentUserId, bookId, updates);
      if (!userBook) {
        return res.status(404).json({ message: "User book not found" });
      }
      res.json(userBook);
    } catch (error) {
      res.status(500).json({ message: "Failed to update book progress" });
    }
  });

  // Reviews endpoints
  app.get("/api/reviews", async (req, res) => {
    try {
      const bookId = req.query.bookId ? parseInt(req.query.bookId as string) : undefined;
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const limit = parseInt(req.query.limit as string) || 20;
      const reviews = await storage.getReviews(bookId, userId, limit);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse({
        ...req.body,
        userId: currentUserId
      });
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  app.put("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const review = await storage.updateReview(id, updates);
      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ message: "Failed to update review" });
    }
  });

  app.delete("/api/reviews/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteReview(id);
      if (!success) {
        return res.status(404).json({ message: "Review not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete review" });
    }
  });

  // Reading Sessions endpoints
  app.get("/api/reading-sessions", async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const sessions = await storage.getReadingSessions(currentUserId, date);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reading sessions" });
    }
  });

  app.post("/api/reading-sessions", async (req, res) => {
    try {
      const validatedData = insertReadingSessionSchema.parse({
        ...req.body,
        userId: currentUserId,
        scheduledDate: new Date(req.body.scheduledDate)
      });
      const session = await storage.createReadingSession(validatedData);
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid session data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create reading session" });
    }
  });

  app.put("/api/reading-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateReadingSession(id, updates);
      if (!session) {
        return res.status(404).json({ message: "Reading session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to update reading session" });
    }
  });

  // User Preferences endpoints
  app.get("/api/user/preferences", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences(currentUserId);
      if (!preferences) {
        return res.status(404).json({ message: "User preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user preferences" });
    }
  });

  app.put("/api/user/preferences", async (req, res) => {
    try {
      const updates = req.body;
      const preferences = await storage.updateUserPreferences(currentUserId, updates);
      if (!preferences) {
        return res.status(404).json({ message: "User preferences not found" });
      }
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user preferences" });
    }
  });

  // Analytics endpoints
  app.get("/api/user/stats", async (req, res) => {
    try {
      const stats = await storage.getReadingStats(currentUserId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reading stats" });
    }
  });

  app.get("/api/recommendations", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 6;
      const recommendations = await storage.getRecommendations(currentUserId, limit);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
