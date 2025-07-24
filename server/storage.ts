import {
  users, books, userBooks, reviews, readingSessions, userPreferences,
  type User, type InsertUser,
  type Book, type InsertBook,
  type UserBook, type InsertUserBook,
  type Review, type InsertReview,
  type ReadingSession, type InsertReadingSession,
  type UserPreferences, type InsertUserPreferences,
  type BookWithUserData, type ReviewWithUser, type ReadingStats, type RecommendationWithMatch
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Books
  getBooks(limit?: number, offset?: number): Promise<Book[]>;
  getBook(id: number): Promise<Book | undefined>;
  searchBooks(query: string): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: number, updates: Partial<Book>): Promise<Book | undefined>;

  // User Books
  getUserBooks(userId: number, status?: string): Promise<BookWithUserData[]>;
  getUserBook(userId: number, bookId: number): Promise<UserBook | undefined>;
  addUserBook(userBook: InsertUserBook): Promise<UserBook>;
  updateUserBook(userId: number, bookId: number, updates: Partial<UserBook>): Promise<UserBook | undefined>;

  // Reviews
  getReviews(bookId?: number, userId?: number, limit?: number): Promise<ReviewWithUser[]>;
  getReview(id: number): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;

  // Reading Sessions
  getReadingSessions(userId: number, date?: Date): Promise<ReadingSession[]>;
  createReadingSession(session: InsertReadingSession): Promise<ReadingSession>;
  updateReadingSession(id: number, updates: Partial<ReadingSession>): Promise<ReadingSession | undefined>;

  // User Preferences
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: number, updates: Partial<UserPreferences>): Promise<UserPreferences | undefined>;

  // Analytics
  getReadingStats(userId: number): Promise<ReadingStats>;
  getRecommendations(userId: number, limit?: number): Promise<RecommendationWithMatch[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private books: Map<number, Book>;
  private userBooks: Map<string, UserBook>; // key: `${userId}-${bookId}`
  private reviews: Map<number, Review>;
  private readingSessions: Map<number, ReadingSession>;
  private userPreferences: Map<number, UserPreferences>;
  private currentId: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.userBooks = new Map();
    this.reviews = new Map();
    this.readingSessions = new Map();
    this.userPreferences = new Map();
    this.currentId = {
      users: 1,
      books: 1,
      userBooks: 1,
      reviews: 1,
      readingSessions: 1,
      userPreferences: 1
    };

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user
    const sampleUser: User = {
      id: 1,
      username: "sarah_m",
      password: "password123",
      email: "sarah@example.com",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&h=100",
      createdAt: new Date()
    };
    this.users.set(1, sampleUser);
    this.currentId.users = 2;

    // Create sample books
    const sampleBooks: Book[] = [
      {
        id: 1,
        title: "The Midnight Library",
        author: "Matt Haig",
        isbn: "9780525559474",
        coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        description: "Between life and death there is a library, and within that library, the shelves go on forever.",
        totalPages: 300,
        publishedYear: 2020,
        genres: ["Fiction", "Philosophy", "Contemporary"],
        averageRating: "4.2",
        createdAt: new Date()
      },
      {
        id: 2,
        title: "Atomic Habits",
        author: "James Clear",
        isbn: "9780735211292",
        coverImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones",
        totalPages: 320,
        publishedYear: 2018,
        genres: ["Self-Help", "Psychology", "Productivity"],
        averageRating: "4.6",
        createdAt: new Date()
      },
      {
        id: 3,
        title: "Where the Crawdads Sing",
        author: "Delia Owens",
        isbn: "9780735219090",
        coverImage: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        description: "A mystery, a love story, and a coming-of-age tale all at once.",
        totalPages: 384,
        publishedYear: 2018,
        genres: ["Fiction", "Mystery", "Literary Fiction"],
        averageRating: "4.5",
        createdAt: new Date()
      },
      {
        id: 4,
        title: "Project Hail Mary",
        author: "Andy Weir",
        isbn: "9780593135204",
        coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=300",
        description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller.",
        totalPages: 496,
        publishedYear: 2021,
        genres: ["Science Fiction", "Thriller", "Space Opera"],
        averageRating: "4.8",
        createdAt: new Date()
      }
    ];

    sampleBooks.forEach(book => this.books.set(book.id, book));
    this.currentId.books = 5;

    // Create sample user books (currently reading)
    const userBook1: UserBook = {
      id: 1,
      userId: 1,
      bookId: 1,
      status: "reading",
      currentPage: 204,
      startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      completedAt: null,
      rating: null,
      createdAt: new Date()
    };

    const userBook2: UserBook = {
      id: 2,
      userId: 1,
      bookId: 2,
      status: "reading",
      currentPage: 65,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      completedAt: null,
      rating: null,
      createdAt: new Date()
    };

    this.userBooks.set("1-1", userBook1);
    this.userBooks.set("1-2", userBook2);
    this.currentId.userBooks = 3;

    // Create sample user preferences
    const preferences: UserPreferences = {
      id: 1,
      userId: 1,
      favoriteGenres: ["Fiction", "Science Fiction", "Self-Help"],
      readingGoal: 30,
      reminderSettings: { enabled: true, time: "20:00", frequency: "daily" },
      createdAt: new Date()
    };
    this.userPreferences.set(1, preferences);
    this.currentId.userPreferences = 2;
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId.users++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  // Books
  async getBooks(limit = 20, offset = 0): Promise<Book[]> {
    const allBooks = Array.from(this.books.values());
    return allBooks.slice(offset, offset + limit);
  }

  async getBook(id: number): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async searchBooks(query: string): Promise<Book[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.books.values()).filter(book =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.genres?.some(genre => genre.toLowerCase().includes(searchTerm))
    );
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = this.currentId.books++;
    const book: Book = { ...insertBook, id, averageRating: "0", createdAt: new Date() };
    this.books.set(id, book);
    return book;
  }

  async updateBook(id: number, updates: Partial<Book>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    const updatedBook = { ...book, ...updates };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  // User Books
  async getUserBooks(userId: number, status?: string): Promise<BookWithUserData[]> {
    const userBooksArray = Array.from(this.userBooks.values()).filter(ub =>
      ub.userId === userId && (!status || ub.status === status)
    );

    const booksWithData: BookWithUserData[] = [];
    for (const userBook of userBooksArray) {
      const book = this.books.get(userBook.bookId);
      if (book) {
        booksWithData.push({
          ...book,
          userBook,
          userRating: userBook.rating || undefined,
          progress: userBook.currentPage && book.totalPages
            ? Math.round((userBook.currentPage / book.totalPages) * 100)
            : 0
        });
      }
    }
    return booksWithData;
  }

  async getUserBook(userId: number, bookId: number): Promise<UserBook | undefined> {
    return this.userBooks.get(`${userId}-${bookId}`);
  }

  async addUserBook(insertUserBook: InsertUserBook): Promise<UserBook> {
    const id = this.currentId.userBooks++;
    const userBook: UserBook = { ...insertUserBook, id, createdAt: new Date() };
    this.userBooks.set(`${userBook.userId}-${userBook.bookId}`, userBook);
    return userBook;
  }

  async updateUserBook(userId: number, bookId: number, updates: Partial<UserBook>): Promise<UserBook | undefined> {
    const key = `${userId}-${bookId}`;
    const userBook = this.userBooks.get(key);
    if (!userBook) return undefined;
    const updatedUserBook = { ...userBook, ...updates };
    this.userBooks.set(key, updatedUserBook);
    return updatedUserBook;
  }

  // Reviews
  async getReviews(bookId?: number, userId?: number, limit = 20): Promise<ReviewWithUser[]> {
    let reviewsArray = Array.from(this.reviews.values());

    if (bookId) reviewsArray = reviewsArray.filter(r => r.bookId === bookId);
    if (userId) reviewsArray = reviewsArray.filter(r => r.userId === userId);

    reviewsArray = reviewsArray.slice(0, limit);

    const reviewsWithUser: ReviewWithUser[] = [];
    for (const review of reviewsArray) {
      const user = this.users.get(review.userId);
      const book = this.books.get(review.bookId);
      if (user && book) {
        reviewsWithUser.push({
          ...review,
          user: { id: user.id, username: user.username, avatar: user.avatar },
          book: { id: book.id, title: book.title, author: book.author, coverImage: book.coverImage }
        });
      }
    }
    return reviewsWithUser;
  }

  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = this.currentId.reviews++;
    const review: Review = { ...insertReview, id, likesCount: 0, createdAt: new Date() };
    this.reviews.set(id, review);
    return review;
  }

  async updateReview(id: number, updates: Partial<Review>): Promise<Review | undefined> {
    const review = this.reviews.get(id);
    if (!review) return undefined;
    const updatedReview = { ...review, ...updates };
    this.reviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.reviews.delete(id);
  }

  // Reading Sessions
  async getReadingSessions(userId: number, date?: Date): Promise<ReadingSession[]> {
    let sessions = Array.from(this.readingSessions.values()).filter(s => s.userId === userId);
    if (date) {
      const targetDate = date.toDateString();
      sessions = sessions.filter(s => s.scheduledDate.toDateString() === targetDate);
    }
    return sessions;
  }

  async createReadingSession(insertSession: InsertReadingSession): Promise<ReadingSession> {
    const id = this.currentId.readingSessions++;
    const session: ReadingSession = {
      ...insertSession,
      id,
      isCompleted: false,
      reminderSent: false,
      createdAt: new Date()
    };
    this.readingSessions.set(id, session);
    return session;
  }

  async updateReadingSession(id: number, updates: Partial<ReadingSession>): Promise<ReadingSession | undefined> {
    const session = this.readingSessions.get(id);
    if (!session) return undefined;
    const updatedSession = { ...session, ...updates };
    this.readingSessions.set(id, updatedSession);
    return updatedSession;
  }

  // User Preferences
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(userId);
  }

  async createUserPreferences(insertPreferences: InsertUserPreferences): Promise<UserPreferences> {
    const id = this.currentId.userPreferences++;
    const preferences: UserPreferences = { ...insertPreferences, id, createdAt: new Date() };
    this.userPreferences.set(preferences.userId, preferences);
    return preferences;
  }

  async updateUserPreferences(userId: number, updates: Partial<UserPreferences>): Promise<UserPreferences | undefined> {
    const preferences = this.userPreferences.get(userId);
    if (!preferences) return undefined;
    const updatedPreferences = { ...preferences, ...updates };
    this.userPreferences.set(userId, updatedPreferences);
    return updatedPreferences;
  }

  // Analytics
  async getReadingStats(userId: number): Promise<ReadingStats> {
    const userBooksArray = Array.from(this.userBooks.values()).filter(ub => ub.userId === userId);
    const currentYear = new Date().getFullYear();
    
    const booksReadThisYear = userBooksArray.filter(ub =>
      ub.status === 'completed' && ub.completedAt?.getFullYear() === currentYear
    ).length;

    // Calculate reading streak (simplified)
    const currentStreak = Math.floor(Math.random() * 20) + 1; // Mock streak

    const totalPages = userBooksArray.reduce((total, ub) => {
      if (ub.status === 'completed') {
        const book = this.books.get(ub.bookId);
        return total + (book?.totalPages || 0);
      }
      return total;
    }, 0);

    const ratingsArray = userBooksArray.filter(ub => ub.rating).map(ub => ub.rating!);
    const averageRating = ratingsArray.length > 0
      ? ratingsArray.reduce((sum, rating) => sum + rating, 0) / ratingsArray.length
      : 0;

    const preferences = await this.getUserPreferences(userId);
    const favoriteGenre = preferences?.favoriteGenres?.[0] || 'Fiction';

    return {
      booksReadThisYear: booksReadThisYear || 24, // Mock data if no completed books
      currentStreak,
      totalPages,
      averageRating,
      favoriteGenre
    };
  }

  async getRecommendations(userId: number, limit = 6): Promise<RecommendationWithMatch[]> {
    const preferences = await this.getUserPreferences(userId);
    const userBooksArray = Array.from(this.userBooks.values()).filter(ub => ub.userId === userId);
    const readBookIds = new Set(userBooksArray.map(ub => ub.bookId));

    const allBooks = Array.from(this.books.values()).filter(book => !readBookIds.has(book.id));
    
    // Simple recommendation algorithm based on genre preferences
    const recommendations: RecommendationWithMatch[] = allBooks.map(book => {
      let matchScore = 50; // Base score
      
      if (preferences?.favoriteGenres) {
        const genreMatch = book.genres?.some(genre => 
          preferences.favoriteGenres.includes(genre)
        );
        if (genreMatch) matchScore += 30;
      }

      // Add some randomness for variety
      matchScore += Math.floor(Math.random() * 20);
      matchScore = Math.min(99, Math.max(60, matchScore)); // Keep between 60-99

      return {
        ...book,
        matchPercentage: matchScore,
        reason: `Based on your interest in ${preferences?.favoriteGenres?.[0] || 'great books'}`
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage).slice(0, limit);

    return recommendations;
  }
}

export const storage = new MemStorage();
