import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  isbn: text("isbn"),
  coverImage: text("cover_image"),
  description: text("description"),
  totalPages: integer("total_pages").notNull(),
  publishedYear: integer("published_year"),
  genres: text("genres").array(),
  averageRating: decimal("average_rating", { precision: 3, scale: 2 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userBooks = pgTable("user_books", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  status: text("status").notNull(), // 'reading', 'completed', 'want-to-read', 'dnf'
  currentPage: integer("current_page").default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  rating: integer("rating"), // 1-5 stars
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  content: text("content").notNull(),
  isTrailerStyle: boolean("is_trailer_style").default(false),
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const readingSessions = pgTable("reading_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  bookId: integer("book_id").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  duration: integer("duration"), // in minutes
  isCompleted: boolean("is_completed").default(false),
  reminderSent: boolean("reminder_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  favoriteGenres: text("favorite_genres").array(),
  readingGoal: integer("reading_goal").default(12), // books per year
  reminderSettings: json("reminder_settings"), // notification preferences
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertBookSchema = createInsertSchema(books).omit({
  id: true,
  averageRating: true,
  createdAt: true,
});

export const insertUserBookSchema = createInsertSchema(userBooks).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  likesCount: true,
  createdAt: true,
});

export const insertReadingSessionSchema = createInsertSchema(readingSessions).omit({
  id: true,
  isCompleted: true,
  reminderSent: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

export type InsertUserBook = z.infer<typeof insertUserBookSchema>;
export type UserBook = typeof userBooks.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertReadingSession = z.infer<typeof insertReadingSessionSchema>;
export type ReadingSession = typeof readingSessions.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Extended types for API responses
export type BookWithUserData = Book & {
  userBook?: UserBook;
  userRating?: number;
  progress?: number;
};

export type ReviewWithUser = Review & {
  user: Pick<User, 'id' | 'username' | 'avatar'>;
  book: Pick<Book, 'id' | 'title' | 'author' | 'coverImage'>;
};

export type ReadingStats = {
  booksReadThisYear: number;
  currentStreak: number;
  totalPages: number;
  averageRating: number;
  favoriteGenre: string;
};

export type RecommendationWithMatch = Book & {
  matchPercentage: number;
  reason: string;
};
