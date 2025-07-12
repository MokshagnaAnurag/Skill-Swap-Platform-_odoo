import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Clock, 
  Star,
  MessageSquare,
  Filter,
  Users,
  Calendar,
  CheckCircle,
  X,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/ui/animated-footer";
import { dataManager, type User, type SwapRequest, type ActiveSwap } from "@/lib/data";

const SkillSwap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userRequests, setUserRequests] = useState<SwapRequest[]>([]);
  const [userSwaps, setUserSwaps] = useState<ActiveSwap[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load user data
    const currentUser = dataManager.getUserById(parsedUser.id);
    if (currentUser) {
      setUser(currentUser);
    }
    
    // Load user's requests and swaps
    const requests = dataManager.getRequestsForUser(parsedUser.id);
    const swaps = dataManager.getSwapsForUser(parsedUser.id);
    setUserRequests(requests);
    setUserSwaps(swaps);
    
    // Get all public users except current user
    const allUsers = dataManager.getUsers().filter(u => u.id !== parsedUser.id);
    setFilteredUsers(allUsers);
  }, [navigate]);

  const categories = [
    "all", "Technology", "Design", "Languages", "Music", "Fitness", "Cooking", "Other"
  ];

  // Filter users based on search and category
  useEffect(() => {
    const users = dataManager.searchUsers(searchTerm, selectedCategory);
    setFilteredUsers(users.filter(u => u.id !== user?.id));
  }, [searchTerm, selectedCategory, user]);

  const handleSendRequest = (targetUser: User) => {
    if (!user) return;

    // Check if user has skills to offer
    if (user.skillsOffered.length === 0) {
      toast({
        title: "No skills to offer",
        description: "Please add skills you can teach in your profile first.",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, we'll use the first skill offered by current user
    const skillOffered = user.skillsOffered[0];
    const skillWanted = targetUser.skillsOffered[0];

    if (!skillOffered || !skillWanted) {
      toast({
        title: "Cannot send request",
        description: "Both users need to have skills to offer.",
        variant: "destructive",
      });
      return;
    }

    // Create swap request
    dataManager.createSwapRequest({
      fromUserId: user.id,
      toUserId: targetUser.id,
      skillOffered: skillOffered,
      skillWanted: skillWanted,
      message: `Hi ${targetUser.name}! I'd love to learn ${skillWanted} from you. I can teach you ${skillOffered} in return.`,
      status: "pending"
    });

    // Refresh requests
    const updatedRequests = dataManager.getRequestsForUser(user.id);
    setUserRequests(updatedRequests);

    toast({
      title: "Request sent!",
      description: `Your swap request has been sent to ${targetUser.name}.`,
    });
  };

  const handleAcceptRequest = (requestId: string) => {
    dataManager.updateSwapRequest(requestId, 'accepted');
    
    // Refresh data
    if (user) {
      const updatedRequests = dataManager.getRequestsForUser(user.id);
      const updatedSwaps = dataManager.getSwapsForUser(user.id);
      setUserRequests(updatedRequests);
      setUserSwaps(updatedSwaps);
    }

    toast({
      title: "Request accepted!",
      description: "You can now coordinate your skill swap sessions.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    dataManager.updateSwapRequest(requestId, 'rejected');
    
    // Refresh data
    if (user) {
      const updatedRequests = dataManager.getRequestsForUser(user.id);
      setUserRequests(updatedRequests);
    }

    toast({
      title: "Request declined",
      description: "The request has been politely declined.",
    });
  };

  const handleCompleteSwap = (swapId: string) => {
    dataManager.completeSwap(swapId);
    
    // Refresh data
    if (user) {
      const updatedSwaps = dataManager.getSwapsForUser(user.id);
      setUserSwaps(updatedSwaps);
    }

    toast({
      title: "Swap completed!",
      description: "Don't forget to leave a rating for your partner.",
    });
  };

  if (!user) return null;

  const receivedRequests = userRequests.filter(req => req.toUserId === user.id && req.status === 'pending');
  const sentRequests = userRequests.filter(req => req.fromUserId === user.id);
  const activeSwapsForUser = userSwaps.filter(swap => swap.status === 'active');

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">SkillSwap Platform</h1>
          <p className="text-neutral-300">Connect with others and exchange skills</p>
        </div>

        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white/10 border-white/10">
            <TabsTrigger value="browse" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <Search className="w-4 h-4" />
              Browse
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <MessageSquare className="w-4 h-4" />
              Requests ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <Clock className="w-4 h-4" />
              Sent ({sentRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <Calendar className="w-4 h-4" />
              Active ({activeSwapsForUser.length})
            </TabsTrigger>
          </TabsList>

          {/* Browse Tab */}
          <TabsContent value="browse" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <Input
                      placeholder="Search skills or people..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-neutral-400" />
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant={selectedCategory === category ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category)}
                          className={selectedCategory === category 
                            ? "bg-white text-black hover:bg-neutral-100" 
                            : "text-white border-white/20 hover:bg-white/10"
                          }
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredUsers.map((targetUser) => (
                <Card key={targetUser.id} className="bg-white/10 backdrop-blur-sm border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-white/20 text-white font-semibold">
                          {targetUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-white">{targetUser.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-neutral-300">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {targetUser.location || "Location not set"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400" />
                            {targetUser.rating.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm text-neutral-300 mb-2">Skills Offered</h4>
                      <div className="flex flex-wrap gap-1">
                        {targetUser.skillsOffered.slice(0, 3).map((skill) => (
                          <Badge key={skill} className="bg-green-500/20 text-green-400 border-green-500/30">
                            {skill}
                          </Badge>
                        ))}
                        {targetUser.skillsOffered.length > 3 && (
                          <Badge className="bg-neutral-500/20 text-neutral-400 border-neutral-500/30">
                            +{targetUser.skillsOffered.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm text-neutral-300 mb-2">Skills Wanted</h4>
                      <div className="flex flex-wrap gap-1">
                        {targetUser.skillsWanted.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                            {skill}
                          </Badge>
                        ))}
                        {targetUser.skillsWanted.length > 3 && (
                          <Badge variant="outline" className="border-neutral-500/30 text-neutral-400">
                            +{targetUser.skillsWanted.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1 text-sm text-neutral-400">
                        <Clock className="w-4 h-4" />
                        {targetUser.availability || "Flexible"}
                      </div>
                      
                      <Button
                        onClick={() => handleSendRequest(targetUser)}
                        className="bg-white text-black hover:bg-neutral-100"
                        disabled={user.skillsOffered.length === 0}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Send Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-neutral-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No results found</h3>
                <p className="text-neutral-400">Try adjusting your search terms or filters</p>
              </div>
            )}
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => {
                const fromUser = dataManager.getUserById(request.fromUserId);
                return (
                  <Card key={request.id} className="bg-white/10 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-white/20 text-white">
                              {fromUser?.name.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-white">{fromUser?.name || 'Unknown User'}</CardTitle>
                            <p className="text-sm text-neutral-400">{request.timestamp}</p>
                          </div>
                        </div>
                        <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">Offers:</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{request.skillOffered}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">Wants:</span>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">{request.skillWanted}</Badge>
                          </div>
                        </div>
                        
                        <p className="text-neutral-300 bg-white/5 p-3 rounded-lg border border-white/10">{request.message}</p>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleAcceptRequest(request.id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Accept
                          </Button>
                          <Button 
                            onClick={() => handleRejectRequest(request.id)}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Decline
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-neutral-400 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">No received requests</h3>
                <p className="text-neutral-400">When others send you swap requests, they'll appear here.</p>
              </div>
            )}
          </TabsContent>

          {/* Sent Tab */}
          <TabsContent value="sent" className="space-y-4">
            {sentRequests.length > 0 ? (
              sentRequests.map((request) => {
                const toUser = dataManager.getUserById(request.toUserId);
                return (
                  <Card key={request.id} className="bg-white/10 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-white/20 text-white">
                              {toUser?.name.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-white">{toUser?.name || 'Unknown User'}</CardTitle>
                            <p className="text-sm text-neutral-400">{request.timestamp}</p>
                          </div>
                        </div>
                        <Badge className={request.status === "accepted" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}>
                          {request.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">You offer:</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{request.skillOffered}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">You want:</span>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">{request.skillWanted}</Badge>
                          </div>
                        </div>
                        
                        <p className="text-neutral-300 bg-white/5 p-3 rounded-lg border border-white/10">{request.message}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-neutral-400 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">No sent requests</h3>
                <p className="text-neutral-400">Start browsing skills to send swap requests to others.</p>
              </div>
            )}
          </TabsContent>

          {/* Active Tab */}
          <TabsContent value="active" className="space-y-4">
            {activeSwapsForUser.length > 0 ? (
              activeSwapsForUser.map((swap) => {
                const partnerId = swap.user1Id === user.id ? swap.user2Id : swap.user1Id;
                const partner = dataManager.getUserById(partnerId);
                return (
                  <Card key={swap.id} className="bg-white/10 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback className="bg-white/20 text-white">
                              {partner?.name.split(' ').map(n => n[0]).join('') || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-white">{partner?.name || 'Partner'}</CardTitle>
                            <p className="text-sm text-neutral-400">Started {swap.startDate}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                          {swap.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">You teach:</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {swap.user1Id === user.id ? swap.skill1Offered : swap.skill2Offered}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">You learn:</span>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                              {swap.user1Id === user.id ? swap.skill2Offered : swap.skill1Offered}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-neutral-300">
                            <span>Progress</span>
                            <span>{swap.sessionsCompleted}/{swap.totalSessions} sessions</span>
                          </div>
                          <div className="w-full bg-white/20 rounded-full h-2">
                            <div 
                              className="bg-white h-2 rounded-full" 
                              style={{ width: `${(swap.sessionsCompleted / swap.totalSessions) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleCompleteSwap(swap.id)}
                            className="bg-white text-black hover:bg-neutral-100"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Complete
                          </Button>
                          <Button 
                            variant="outline"
                            className="text-white border-white/20 hover:bg-white/10"
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-neutral-400 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">No active swaps</h3>
                <p className="text-neutral-400">Accept some swap requests to start learning!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer
        leftLinks={[
          { href: "/terms", label: "Terms & policies" },
          { href: "/privacy-policy", label: "Privacy policy" },
        ]}
        rightLinks={[]}
        copyrightText="SkillSpark 2025. All Rights Reserved"
        barCount={23}
      />
    </div>
  );
};

export default SkillSwap; 