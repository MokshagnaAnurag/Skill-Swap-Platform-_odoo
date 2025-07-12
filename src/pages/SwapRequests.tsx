
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  X, 
  Clock, 
  MessageSquare, 
  Star,
  Trash2,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/ui/animated-footer";
import { dataManager, type User, type SwapRequest, type ActiveSwap } from "@/lib/data";
import RatingModal from "@/components/ui/rating-modal";
import Breadcrumb from "@/components/ui/breadcrumb";

const SwapRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [activeSwaps, setActiveSwaps] = useState<ActiveSwap[]>([]);
  const [ratingModal, setRatingModal] = useState({
    isOpen: false,
    swapId: "",
    partnerName: "",
    skillLearned: ""
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Load user's requests and swaps
    const userRequests = dataManager.getRequestsForUser(parsedUser.id);
    const userSwaps = dataManager.getSwapsForUser(parsedUser.id);
    
    setRequests(userRequests);
    setActiveSwaps(userSwaps);
  }, [navigate]);

  const receivedRequests = requests.filter(req => req.toUserId === user?.id && req.status === 'pending');
  const sentRequests = requests.filter(req => req.fromUserId === user?.id);
  const activeSwapsForUser = activeSwaps.filter(swap => swap.status === 'active');
  const completedSwapsForUser = activeSwaps.filter(swap => swap.status === 'completed');

  const handleAcceptRequest = (requestId: string) => {
    dataManager.updateSwapRequest(requestId, 'accepted');
    
    // Refresh data
    if (user) {
      const userRequests = dataManager.getRequestsForUser(user.id);
      const userSwaps = dataManager.getSwapsForUser(user.id);
      setRequests(userRequests);
      setActiveSwaps(userSwaps);
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
      const userRequests = dataManager.getRequestsForUser(user.id);
      setRequests(userRequests);
    }

    toast({
      title: "Request declined",
      description: "The request has been politely declined.",
    });
  };

  const handleDeleteRequest = (requestId: string) => {
    dataManager.deleteSwapRequest(requestId);
    
    // Refresh data
    if (user) {
      const userRequests = dataManager.getRequestsForUser(user.id);
      setRequests(userRequests);
    }

    toast({
      title: "Request deleted",
      description: "Your swap request has been deleted.",
      variant: "destructive",
    });
  };

  const handleCompleteSwap = (swapId: string) => {
    const swap = activeSwaps.find(s => s.id === swapId);
    if (!swap) return;

    const partnerId = swap.user1Id === user?.id ? swap.user2Id : swap.user1Id;
    const partner = dataManager.getUserById(partnerId);
    const skillLearned = swap.user1Id === user?.id ? swap.skill2Offered : swap.skill1Offered;

    setRatingModal({
      isOpen: true,
      swapId,
      partnerName: partner?.name || "Partner",
      skillLearned
    });
  };

  const handleRatingSubmit = (rating: number, feedback: string) => {
    const swap = activeSwaps.find(s => s.id === ratingModal.swapId);
    if (!swap || !user) return;

    // Complete the swap with rating
    dataManager.completeSwap(ratingModal.swapId, rating, undefined, feedback, "");
    
    // Refresh data
    const userSwaps = dataManager.getSwapsForUser(user.id);
    setActiveSwaps(userSwaps);

    toast({
      title: "Swap completed!",
      description: "Thank you for your feedback.",
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Swap Requests" }]} />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Swap Requests</h1>
          <p className="text-neutral-300">Manage your skill exchange requests and active swaps</p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white/10 border-white/10">
            <TabsTrigger value="received" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <MessageSquare className="w-4 h-4" />
              Received ({receivedRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <Clock className="w-4 h-4" />
              Sent ({sentRequests.length})
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <Calendar className="w-4 h-4" />
              Active ({activeSwapsForUser.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <Check className="w-4 h-4" />
              Completed ({completedSwapsForUser.length})
            </TabsTrigger>
          </TabsList>

          {/* Received Requests */}
          <TabsContent value="received" className="space-y-4">
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
                            <Check className="w-4 h-4 mr-2" />
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

          {/* Sent Requests */}
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
                        
                        {request.status === "pending" && (
                          <Button 
                            onClick={() => handleDeleteRequest(request.id)}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Request
                          </Button>
                        )}
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

          {/* Active Swaps */}
          <TabsContent value="active" className="space-y-4">
            {activeSwapsForUser.length > 0 ? (
              activeSwapsForUser.map((swap) => {
                const partnerId = swap.user1Id === user?.id ? swap.user2Id : swap.user1Id;
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
                              {swap.user1Id === user?.id ? swap.skill1Offered : swap.skill2Offered}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">You learn:</span>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                              {swap.user1Id === user?.id ? swap.skill2Offered : swap.skill1Offered}
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
                            <Check className="w-4 h-4 mr-2" />
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

          {/* Completed Swaps */}
          <TabsContent value="completed" className="space-y-4">
            {completedSwapsForUser.length > 0 ? (
              completedSwapsForUser.map((swap) => {
                const partnerId = swap.user1Id === user?.id ? swap.user2Id : swap.user1Id;
                const partner = dataManager.getUserById(partnerId);
                const userRating = swap.user1Id === user?.id ? swap.rating1 : swap.rating2;
                const userFeedback = swap.user1Id === user?.id ? swap.feedback1 : swap.feedback2;
                
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
                            <p className="text-sm text-neutral-400">Completed {swap.startDate}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                          Completed
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">You taught:</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              {swap.user1Id === user?.id ? swap.skill1Offered : swap.skill2Offered}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">You learned:</span>
                            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
                              {swap.user1Id === user?.id ? swap.skill2Offered : swap.skill1Offered}
                            </Badge>
                          </div>
                        </div>
                        
                        {userRating && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-white">Your Rating:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= userRating
                                      ? "text-yellow-400 fill-current"
                                      : "text-neutral-400"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {userFeedback && (
                          <div>
                            <span className="font-medium text-white">Your Feedback:</span>
                            <p className="text-neutral-300 mt-1 bg-white/5 p-3 rounded-lg border border-white/10">
                              {userFeedback}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <Check className="w-16 h-16 mx-auto mb-4 text-neutral-400 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">No completed swaps</h3>
                <p className="text-neutral-400">Complete some swaps to see them here!</p>
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

      <RatingModal
        isOpen={ratingModal.isOpen}
        onClose={() => setRatingModal({ isOpen: false, swapId: "", partnerName: "", skillLearned: "" })}
        onSubmit={handleRatingSubmit}
        partnerName={ratingModal.partnerName}
        skillLearned={ratingModal.skillLearned}
      />
    </div>
  );
};

export default SwapRequests;
