// Data management system for SkillSpark

export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  bio?: string;
  availability?: string;
  isPublic: boolean;
  isAdmin: boolean;
  rating: number;
  completedSwaps: number;
  skillsOffered: string[];
  skillsWanted: string[];
  joinDate: string;
  lastActive: string;
  profilePhoto?: string;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
}

export interface ActiveSwap {
  id: string;
  user1Id: string;
  user2Id: string;
  skill1Offered: string;
  skill2Offered: string;
  startDate: string;
  status: 'active' | 'completed';
  sessionsCompleted: number;
  totalSessions: number;
  rating1?: number;
  rating2?: number;
  feedback1?: string;
  feedback2?: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reason: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface PlatformMessage {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  sentBy: string;
}

export interface SwapRating {
  id: string;
  swapId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  feedback: string;
  timestamp: string;
}

// Sample data with Indian names
export const sampleUsers: User[] = [
  {
    id: "1",
    name: "Priya Sharma",
    email: "priya@example.com",
    location: "Mumbai, Maharashtra",
    bio: "Full-stack developer passionate about teaching and learning new technologies.",
    availability: "Weekends",
    isPublic: true,
    isAdmin: false,
    rating: 4.8,
    completedSwaps: 12,
    skillsOffered: ["React", "Node.js", "Python", "UI/UX Design"],
    skillsWanted: ["Machine Learning", "DevOps", "Mobile Development"],
    joinDate: "2024-01-15",
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Rahul Patel",
    email: "rahul@example.com",
    location: "Bangalore, Karnataka",
    bio: "Music producer and guitarist looking to expand my skills.",
    availability: "Evenings",
    isPublic: true,
    isAdmin: false,
    rating: 4.7,
    completedSwaps: 8,
    skillsOffered: ["Guitar", "Music Theory", "Recording"],
    skillsWanted: ["Spanish", "Cooking", "Photography"],
    joinDate: "2024-02-20",
    lastActive: "1 day ago"
  },
  {
    id: "3",
    name: "Anjali Singh",
    email: "anjali@example.com",
    location: "Delhi, NCR",
    bio: "Yoga instructor and wellness coach.",
    availability: "Mornings",
    isPublic: true,
    isAdmin: false,
    rating: 4.8,
    completedSwaps: 15,
    skillsOffered: ["Yoga", "Meditation", "Nutrition"],
    skillsWanted: ["Web Design", "Marketing", "Writing"],
    joinDate: "2024-01-10",
    lastActive: "30 minutes ago"
  },
  {
    id: "4",
    name: "Arjun Kumar",
    email: "arjun@example.com",
    location: "Hyderabad, Telangana",
    bio: "Data scientist and machine learning enthusiast.",
    availability: "Flexible",
    isPublic: true,
    isAdmin: false,
    rating: 4.6,
    completedSwaps: 6,
    skillsOffered: ["Python", "Data Science", "Machine Learning"],
    skillsWanted: ["Japanese", "Cooking", "Gardening"],
    joinDate: "2024-03-01",
    lastActive: "3 hours ago"
  },
  {
    id: "5",
    name: "Meera Reddy",
    email: "meera@example.com",
    location: "Chennai, Tamil Nadu",
    bio: "Creative designer and photographer looking to expand technical skills.",
    availability: "Weekends",
    isPublic: true,
    isAdmin: false,
    rating: 4.7,
    completedSwaps: 9,
    skillsOffered: ["Graphic Design", "Photography", "Adobe Creative Suite"],
    skillsWanted: ["Web Development", "JavaScript", "WordPress"],
    joinDate: "2024-02-15",
    lastActive: "1 hour ago"
  },
  {
    id: "6",
    name: "Vikram Malhotra",
    email: "vikram@example.com",
    location: "Pune, Maharashtra",
    bio: "Language tutor and cultural exchange enthusiast.",
    availability: "Evenings",
    isPublic: true,
    isAdmin: false,
    rating: 4.9,
    completedSwaps: 18,
    skillsOffered: ["Hindi", "English", "French"],
    skillsWanted: ["German", "Cooking", "Music"],
    joinDate: "2024-01-05",
    lastActive: "2 hours ago"
  },
  {
    id: "7",
    name: "Sanjay Verma",
    email: "sanjay@example.com",
    location: "Kolkata, West Bengal",
    bio: "Finance expert and chess enthusiast.",
    availability: "Weekdays",
    isPublic: true,
    isAdmin: false,
    rating: 4.5,
    completedSwaps: 7,
    skillsOffered: ["Finance", "Chess", "Excel"],
    skillsWanted: ["Public Speaking", "Cooking", "Digital Marketing"],
    joinDate: "2024-03-10",
    lastActive: "4 hours ago"
  },
  {
    id: "admin",
    name: "Admin User",
    email: "admin@skillspark.com",
    location: "Mumbai, Maharashtra",
    bio: "Platform administrator",
    availability: "Weekdays",
    isPublic: false,
    isAdmin: true,
    rating: 5.0,
    completedSwaps: 0,
    skillsOffered: ["Platform Management"],
    skillsWanted: [],
    joinDate: "2024-01-01",
    lastActive: "1 hour ago"
  }
];

export const sampleSwapRequests: SwapRequest[] = [
  {
    id: "1",
    fromUserId: "2",
    toUserId: "1",
    skillOffered: "Guitar",
    skillWanted: "JavaScript",
    message: "Hi Priya! I'd love to learn JavaScript from you. I can teach you advanced guitar techniques in return.",
    timestamp: "2 hours ago",
    status: "pending"
  },
  {
    id: "2",
    fromUserId: "3",
    toUserId: "1",
    skillOffered: "Yoga",
    skillWanted: "React",
    message: "Your React skills look amazing! I'd love to trade yoga sessions for React tutoring.",
    timestamp: "3 hours ago",
    status: "pending"
  },
  {
    id: "3",
    fromUserId: "1",
    toUserId: "4",
    skillOffered: "Web Design",
    skillWanted: "Python",
    message: "Hi Arjun! I saw you're looking to learn web design. I can help with that in exchange for Python tutoring.",
    timestamp: "2 days ago",
    status: "accepted"
  },
  {
    id: "4",
    fromUserId: "5",
    toUserId: "6",
    skillOffered: "Photography",
    skillWanted: "Hindi",
    message: "Hi Vikram! I'd love to learn Hindi from you. I can teach you photography techniques in return.",
    timestamp: "1 day ago",
    status: "pending"
  }
];

export const sampleActiveSwaps: ActiveSwap[] = [
  {
    id: "1",
    user1Id: "1",
    user2Id: "4",
    skill1Offered: "Web Design",
    skill2Offered: "Python",
    startDate: "Last week",
    status: "active",
    sessionsCompleted: 2,
    totalSessions: 4
  },
  {
    id: "2",
    user1Id: "3",
    user2Id: "5",
    skill1Offered: "Yoga",
    skill2Offered: "Graphic Design",
    startDate: "3 days ago",
    status: "active",
    sessionsCompleted: 1,
    totalSessions: 6
  }
];

export const sampleSwapRatings: SwapRating[] = [
  {
    id: "1",
    swapId: "completed_swap_1",
    fromUserId: "1",
    toUserId: "4",
    rating: 5,
    feedback: "Excellent teaching style! Arjun was very patient and explained complex concepts clearly.",
    timestamp: "1 week ago"
  },
  {
    id: "2",
    swapId: "completed_swap_1",
    fromUserId: "4",
    toUserId: "1",
    rating: 4,
    feedback: "Great learning experience. Priya is knowledgeable and organized.",
    timestamp: "1 week ago"
  }
];

export const sampleReports: Report[] = [
  {
    id: "1",
    reporterId: "1",
    reportedUserId: "spam",
    reason: "Inappropriate skill description",
    description: "User has listed skills that seem inappropriate for the platform",
    timestamp: "2 hours ago",
    status: "pending"
  },
  {
    id: "2",
    reporterId: "2",
    reportedUserId: "fake",
    reason: "No-show for scheduled session",
    description: "User did not show up for agreed skill swap session without notice",
    timestamp: "1 day ago",
    status: "pending"
  }
];

// Data management functions
export class DataManager {
  private static instance: DataManager;
  private users: User[] = [];
  private swapRequests: SwapRequest[] = [];
  private activeSwaps: ActiveSwap[] = [];
  private reports: Report[] = [];
  private platformMessages: PlatformMessage[] = [];
  private swapRatings: SwapRating[] = [];

  private constructor() {
    this.loadData();
  }

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private loadData() {
    // Load from localStorage or use sample data
    const storedUsers = localStorage.getItem('skillspark_users');
    const storedRequests = localStorage.getItem('skillspark_requests');
    const storedSwaps = localStorage.getItem('skillspark_swaps');
    const storedReports = localStorage.getItem('skillspark_reports');
    const storedMessages = localStorage.getItem('skillspark_messages');
    const storedRatings = localStorage.getItem('skillspark_ratings');

    this.users = storedUsers ? JSON.parse(storedUsers) : sampleUsers;
    this.swapRequests = storedRequests ? JSON.parse(storedRequests) : sampleSwapRequests;
    this.activeSwaps = storedSwaps ? JSON.parse(storedSwaps) : sampleActiveSwaps;
    this.reports = storedReports ? JSON.parse(storedReports) : sampleReports;
    this.platformMessages = storedMessages ? JSON.parse(storedMessages) : [];
    this.swapRatings = storedRatings ? JSON.parse(storedRatings) : sampleSwapRatings;
  }

  private saveData() {
    localStorage.setItem('skillspark_users', JSON.stringify(this.users));
    localStorage.setItem('skillspark_requests', JSON.stringify(this.swapRequests));
    localStorage.setItem('skillspark_swaps', JSON.stringify(this.activeSwaps));
    localStorage.setItem('skillspark_reports', JSON.stringify(this.reports));
    localStorage.setItem('skillspark_messages', JSON.stringify(this.platformMessages));
    localStorage.setItem('skillspark_ratings', JSON.stringify(this.swapRatings));
  }

  // User management
  getUsers(): User[] {
    return this.users.filter(user => user.isPublic);
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  updateUser(userId: string, updates: Partial<User>): void {
    const userIndex = this.users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updates };
      this.saveData();
    }
  }

  createUser(userData: Omit<User, 'id' | 'joinDate' | 'lastActive' | 'rating' | 'completedSwaps'>): User {
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      joinDate: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      rating: 0,
      completedSwaps: 0
    };
    this.users.push(newUser);
    this.saveData();
    return newUser;
  }

  // Swap request management
  getSwapRequests(): SwapRequest[] {
    return this.swapRequests;
  }

  getRequestsForUser(userId: string): SwapRequest[] {
    return this.swapRequests.filter(request => 
      request.fromUserId === userId || request.toUserId === userId
    );
  }

  createSwapRequest(requestData: Omit<SwapRequest, 'id' | 'timestamp'>): SwapRequest {
    const newRequest: SwapRequest = {
      ...requestData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.swapRequests.push(newRequest);
    this.saveData();
    return newRequest;
  }

  updateSwapRequest(requestId: string, status: SwapRequest['status']): void {
    const requestIndex = this.swapRequests.findIndex(request => request.id === requestId);
    if (requestIndex !== -1) {
      this.swapRequests[requestIndex].status = status;
      
      // If accepted, create an active swap
      if (status === 'accepted') {
        const request = this.swapRequests[requestIndex];
        const newSwap: ActiveSwap = {
          id: Date.now().toString(),
          user1Id: request.fromUserId,
          user2Id: request.toUserId,
          skill1Offered: request.skillOffered,
          skill2Offered: request.skillWanted,
          startDate: new Date().toISOString(),
          status: 'active',
          sessionsCompleted: 0,
          totalSessions: 4
        };
        this.activeSwaps.push(newSwap);
      }
      
      this.saveData();
    }
  }

  deleteSwapRequest(requestId: string): void {
    this.swapRequests = this.swapRequests.filter(request => request.id !== requestId);
    this.saveData();
  }

  // Active swaps management
  getActiveSwaps(): ActiveSwap[] {
    return this.activeSwaps;
  }

  getSwapsForUser(userId: string): ActiveSwap[] {
    return this.activeSwaps.filter(swap => 
      swap.user1Id === userId || swap.user2Id === userId
    );
  }

  updateSwap(swapId: string, updates: Partial<ActiveSwap>): void {
    const swapIndex = this.activeSwaps.findIndex(swap => swap.id === swapId);
    if (swapIndex !== -1) {
      this.activeSwaps[swapIndex] = { ...this.activeSwaps[swapIndex], ...updates };
      this.saveData();
    }
  }

  completeSwap(swapId: string, rating1?: number, rating2?: number, feedback1?: string, feedback2?: string): void {
    const swapIndex = this.activeSwaps.findIndex(swap => swap.id === swapId);
    if (swapIndex !== -1) {
      this.activeSwaps[swapIndex].status = 'completed';
      if (rating1) this.activeSwaps[swapIndex].rating1 = rating1;
      if (rating2) this.activeSwaps[swapIndex].rating2 = rating2;
      if (feedback1) this.activeSwaps[swapIndex].feedback1 = feedback1;
      if (feedback2) this.activeSwaps[swapIndex].feedback2 = feedback2;
      
      // Update user stats
      const swap = this.activeSwaps[swapIndex];
      const user1 = this.getUserById(swap.user1Id);
      const user2 = this.getUserById(swap.user2Id);
      
      if (user1) {
        user1.completedSwaps += 1;
        if (rating1) user1.rating = (user1.rating + rating1) / 2;
      }
      if (user2) {
        user2.completedSwaps += 1;
        if (rating2) user2.rating = (user2.rating + rating2) / 2;
      }
      
      this.saveData();
    }
  }

  // Ratings management
  getSwapRatings(): SwapRating[] {
    return this.swapRatings;
  }

  createSwapRating(ratingData: Omit<SwapRating, 'id' | 'timestamp'>): SwapRating {
    const newRating: SwapRating = {
      ...ratingData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.swapRatings.push(newRating);
    this.saveData();
    return newRating;
  }

  // Reports management
  getReports(): Report[] {
    return this.reports;
  }

  createReport(reportData: Omit<Report, 'id' | 'timestamp'>): Report {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.reports.push(newReport);
    this.saveData();
    return newReport;
  }

  updateReport(reportId: string, status: Report['status']): void {
    const reportIndex = this.reports.findIndex(report => report.id === reportId);
    if (reportIndex !== -1) {
      this.reports[reportIndex].status = status;
      this.saveData();
    }
  }

  // Platform messages
  getPlatformMessages(): PlatformMessage[] {
    return this.platformMessages;
  }

  createPlatformMessage(messageData: Omit<PlatformMessage, 'id' | 'timestamp'>): PlatformMessage {
    const newMessage: PlatformMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    this.platformMessages.push(newMessage);
    this.saveData();
    return newMessage;
  }

  // Statistics
  getStats() {
    return {
      totalUsers: this.users.length,
      activeSwaps: this.activeSwaps.filter(swap => swap.status === 'active').length,
      pendingReports: this.reports.filter(report => report.status === 'pending').length,
      completedSwaps: this.activeSwaps.filter(swap => swap.status === 'completed').length,
      totalRatings: this.swapRatings.length,
      averageRating: this.swapRatings.length > 0 
        ? this.swapRatings.reduce((sum, rating) => sum + rating.rating, 0) / this.swapRatings.length 
        : 0
    };
  }

  // Search and filtering
  searchUsers(query: string, category: string = 'all'): User[] {
    return this.users.filter(user => {
      if (!user.isPublic) return false;
      
      const matchesSearch = query === '' || 
        user.skillsOffered.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(query.toLowerCase())) ||
        user.name.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = category === 'all' || 
        user.skillsOffered.some(skill => skill.toLowerCase().includes(category.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(category.toLowerCase()));
      
      return matchesSearch && matchesCategory;
    });
  }

  // Export data for admin reports
  exportUserActivity() {
    return {
      users: this.users,
      swaps: this.activeSwaps,
      requests: this.swapRequests,
      ratings: this.swapRatings,
      reports: this.reports
    };
  }
}

// Export singleton instance
export const dataManager = DataManager.getInstance(); 