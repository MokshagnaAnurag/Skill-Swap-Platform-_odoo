"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock, 
  User, 
  MessageSquare, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Users,
  Award,
  Settings,
  Bell,
  Plus,
  ArrowRight,
  Eye,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// Border Trail Component
interface BorderTrailProps {
  className?: string;
  size?: number;
  transition?: any;
  delay?: number;
  onAnimationComplete?: () => void;
  style?: React.CSSProperties;
}

const BorderTrail: React.FC<BorderTrailProps> = ({
  className,
  size = 60,
  transition,
  delay,
  onAnimationComplete,
  style,
}) => {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: 5,
    ease: 'linear',
  };

  return (
    <div className='pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]'>
      <motion.div
        className={cn('absolute aspect-square bg-zinc-500', className)}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          ...(transition ?? BASE_TRANSITION),
          delay: delay,
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
};

// Types
interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  location?: string;
  avatar?: string;
  bio?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  rating: number;
  completedSwaps: number;
  isPublic: boolean;
  joinedDate: string;
  lastActive: string;
}

interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  offeredSkill: string;
  requestedSkill: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface Feedback {
  id: string;
  swapId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// Sample Data
const sampleUsers: User[] = [
  {
    id: "1",
    name: "Sarah Chen",
    username: "sarahc",
    email: "sarah@example.com",
    location: "San Francisco, CA",
    avatar: "/api/placeholder/150/150",
    bio: "Full-stack developer passionate about teaching and learning new technologies.",
    skillsOffered: ["React", "Node.js", "Python", "UI/UX Design"],
    skillsWanted: ["Machine Learning", "DevOps", "Mobile Development"],
    availability: ["Weekends", "Evenings"],
    rating: 4.8,
    completedSwaps: 12,
    isPublic: true,
    joinedDate: "2023-01-15",
    lastActive: "2 hours ago"
  },
  {
    id: "2",
    name: "Marcus Johnson",
    username: "marcusj",
    email: "marcus@example.com",
    location: "New York, NY",
    avatar: "/api/placeholder/150/150",
    bio: "Data scientist with expertise in ML and analytics.",
    skillsOffered: ["Machine Learning", "Data Analysis", "Python", "SQL"],
    skillsWanted: ["React", "Frontend Development", "Design"],
    availability: ["Weekdays", "Evenings"],
    rating: 4.9,
    completedSwaps: 8,
    isPublic: true,
    joinedDate: "2023-03-20",
    lastActive: "1 day ago"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    username: "emilyr",
    email: "emily@example.com",
    location: "Austin, TX",
    avatar: "/api/placeholder/150/150",
    bio: "Creative designer and photographer looking to expand technical skills.",
    skillsOffered: ["Graphic Design", "Photography", "Adobe Creative Suite"],
    skillsWanted: ["Web Development", "JavaScript", "WordPress"],
    availability: ["Weekends"],
    rating: 4.7,
    completedSwaps: 15,
    isPublic: true,
    joinedDate: "2022-11-10",
    lastActive: "30 minutes ago"
  }
];

const sampleSwapRequests: SwapRequest[] = [
  {
    id: "1",
    fromUserId: "1",
    toUserId: "2",
    fromUser: sampleUsers[0],
    toUser: sampleUsers[1],
    offeredSkill: "React",
    requestedSkill: "Machine Learning",
    status: "pending",
    message: "Hi! I'd love to learn ML from you in exchange for React tutoring.",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    fromUserId: "3",
    toUserId: "1",
    fromUser: sampleUsers[2],
    toUser: sampleUsers[0],
    offeredSkill: "Graphic Design",
    requestedSkill: "React",
    status: "accepted",
    message: "I can help you with design in exchange for React lessons!",
    createdAt: "2024-01-14T15:30:00Z",
    updatedAt: "2024-01-14T16:00:00Z"
  }
];

// User Profile Component
const UserProfile: React.FC<{ user: User; onEdit?: () => void }> = ({ user, onEdit }) => {
  const [isPublic, setIsPublic] = useState(user.isPublic);

  return (
    <Card className="relative overflow-hidden">
      <BorderTrail
        className="bg-gradient-to-l from-blue-300 via-blue-500 to-blue-300 opacity-60"
        size={100}
        transition={{
          ease: [0, 0.5, 0.8, 0.5],
          duration: 6,
          repeat: Infinity,
        }}
      />
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-2xl">{user.name}</CardTitle>
        <p className="text-muted-foreground">@{user.username}</p>
        {user.location && (
          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {user.location}
          </div>
        )}
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{user.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className="w-4 h-4 text-green-600" />
            <span className="text-sm">{user.completedSwaps} swaps</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.bio && (
          <p className="text-sm text-center text-muted-foreground">{user.bio}</p>
        )}
        
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm mb-2">Skills Offered</h4>
            <div className="flex flex-wrap gap-1">
              {user.skillsOffered.map((skill, index) => (
                <Badge key={index} variant="default" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Skills Wanted</h4>
            <div className="flex flex-wrap gap-1">
              {user.skillsWanted.map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-sm mb-2">Availability</h4>
            <div className="flex flex-wrap gap-1">
              {user.availability.map((time, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {time}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="text-sm">Public Profile</span>
          </div>
          <Switch
            checked={isPublic}
            onCheckedChange={setIsPublic}
          />
        </div>

        {onEdit && (
          <Button onClick={onEdit} className="w-full">
            <Settings className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

// User Search Component
const UserSearch: React.FC<{ users: User[]; onUserSelect: (user: User) => void }> = ({ 
  users, 
  onUserSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(users);

  const allSkills = Array.from(
    new Set(users.flatMap(user => [...user.skillsOffered, ...user.skillsWanted]))
  );

  useEffect(() => {
    let filtered = users.filter(user => user.isPublic);
    
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        user.skillsWanted.some(skill => 
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    if (selectedSkill) {
      filtered = filtered.filter(user =>
        user.skillsOffered.includes(selectedSkill)
      );
    }
    
    setFilteredUsers(filtered);
  }, [searchQuery, selectedSkill, users]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search users or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              {selectedSkill || "All Skills"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedSkill("")}>
              All Skills
            </DropdownMenuItem>
            {allSkills.map((skill) => (
              <DropdownMenuItem 
                key={skill} 
                onClick={() => setSelectedSkill(skill)}
              >
                {skill}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ScrollArea className="h-96">
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => onUserSelect(user)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{user.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{user.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">@{user.username}</p>
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-1">
                        {user.skillsOffered.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="default" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {user.skillsOffered.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{user.skillsOffered.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

// Swap Request Component
const SwapRequestCard: React.FC<{ 
  request: SwapRequest; 
  currentUserId: string;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}> = ({ request, currentUserId, onAccept, onReject, onCancel }) => {
  const isIncoming = request.toUserId === currentUserId;
  const otherUser = isIncoming ? request.fromUser : request.toUser;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback>{otherUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{otherUser.name}</h3>
              <p className="text-sm text-muted-foreground">@{otherUser.username}</p>
            </div>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {request.status}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Offering:</span>
            <Badge variant="default">{request.offeredSkill}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">Requesting:</span>
            <Badge variant="outline">{request.requestedSkill}</Badge>
          </div>
        </div>
        
        {request.message && (
          <div className="bg-muted p-3 rounded-md mb-3">
            <p className="text-sm">{request.message}</p>
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span>{new Date(request.createdAt).toLocaleDateString()}</span>
          <span>{isIncoming ? 'Incoming' : 'Outgoing'}</span>
        </div>
        
        {request.status === 'pending' && (
          <div className="flex gap-2">
            {isIncoming ? (
              <>
                <Button 
                  size="sm" 
                  onClick={() => onAccept?.(request.id)}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Accept
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onReject?.(request.id)}
                  className="flex-1"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onCancel?.(request.id)}
                className="w-full"
              >
                Cancel Request
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Skill Swap Platform Component
const SkillSwapPlatform: React.FC = () => {
  const [currentUser] = useState<User>(sampleUsers[0]);
  const [users] = useState<User[]>(sampleUsers);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(sampleSwapRequests);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("profile");

  const handleAcceptRequest = (requestId: string) => {
    setSwapRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'accepted' as const } : req
      )
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setSwapRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
  };

  const handleCancelRequest = (requestId: string) => {
    setSwapRequests(prev => 
      prev.map(req => 
        req.id === requestId ? { ...req, status: 'cancelled' as const } : req
      )
    );
  };

  const pendingRequests = swapRequests.filter(req => req.status === 'pending');
  const activeSwaps = swapRequests.filter(req => req.status === 'accepted');

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">SkillSwap</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
              </Button>
              <Avatar>
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="browse">Browse Users</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="swaps">Active Swaps</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="max-w-md mx-auto">
              <UserProfile user={currentUser} onEdit={() => {}} />
            </div>
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <UserSearch 
                users={users.filter(u => u.id !== currentUser.id)} 
                onUserSelect={setSelectedUser}
              />
            </div>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Swap Requests</h2>
                <Badge variant="secondary">
                  {pendingRequests.length} pending
                </Badge>
              </div>
              <div className="space-y-4">
                {swapRequests.map((request) => (
                  <SwapRequestCard
                    key={request.id}
                    request={request}
                    currentUserId={currentUser.id}
                    onAccept={handleAcceptRequest}
                    onReject={handleRejectRequest}
                    onCancel={handleCancelRequest}
                  />
                ))}
                {swapRequests.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No requests yet</h3>
                      <p className="text-muted-foreground">
                        Browse users to start making skill swap requests!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="swaps" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Active Swaps</h2>
                <Badge variant="secondary">
                  {activeSwaps.length} active
                </Badge>
              </div>
              <div className="space-y-4">
                {activeSwaps.map((swap) => (
                  <SwapRequestCard
                    key={swap.id}
                    request={swap}
                    currentUserId={currentUser.id}
                  />
                ))}
                {activeSwaps.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No active swaps</h3>
                      <p className="text-muted-foreground">
                        Accept some requests to start your skill exchanges!
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <UserProfile user={selectedUser} />
              <Button className="w-full">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Swap Request
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillSwapPlatform; 