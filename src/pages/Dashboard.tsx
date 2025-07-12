
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Users, 
  MessageSquare, 
  Star, 
  TrendingUp,
  Clock,
  CheckCircle,
  X
} from "lucide-react";
import Footer from "@/components/ui/animated-footer";
import { dataManager, type User, type SwapRequest, type ActiveSwap } from "@/lib/data";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState({
    activeSwaps: 0,
    completedSwaps: 0,
    pendingRequests: 0,
    rating: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Calculate user stats
    const userRequests = dataManager.getRequestsForUser(parsedUser.id);
    const userSwaps = dataManager.getSwapsForUser(parsedUser.id);
    
    setUserStats({
      activeSwaps: userSwaps.filter(swap => swap.status === 'active').length,
      completedSwaps: userSwaps.filter(swap => swap.status === 'completed').length,
      pendingRequests: userRequests.filter(req => req.status === 'pending' && req.toUserId === parsedUser.id).length,
      rating: parsedUser.rating || 0
    });

    // Generate recent activity
    const activity = [];
    
    // Add recent requests
    const recentRequests = userRequests
      .filter(req => req.status === 'pending')
      .slice(0, 3)
      .map(req => {
        const fromUser = dataManager.getUserById(req.fromUserId);
        return {
          id: req.id,
          type: "request",
          message: `${fromUser?.name || 'Someone'} wants to swap ${req.skillOffered} for your ${req.skillWanted}`,
          time: req.timestamp,
          status: "pending"
        };
      });
    
    // Add recent completed swaps
    const recentSwaps = userSwaps
      .filter(swap => swap.status === 'completed')
      .slice(0, 2)
      .map(swap => {
        const partnerId = swap.user1Id === parsedUser.id ? swap.user2Id : swap.user1Id;
        const partner = dataManager.getUserById(partnerId);
        return {
          id: swap.id,
          type: "completed",
          message: `Completed swap: ${swap.skill1Offered} for ${swap.skill2Offered} with ${partner?.name || 'partner'}`,
          time: swap.startDate,
          status: "completed"
        };
      });

    setRecentActivity([...recentRequests, ...recentSwaps].slice(0, 5));
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      <Navigation />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white mb-8">Welcome back, {user.name}! 👋</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Active Swaps</span>
              <Users className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{userStats.activeSwaps}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Completed</span>
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{userStats.completedSwaps}</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-white border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Pending Requests</span>
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="text-2xl font-bold">{userStats.pendingRequests}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.length > 0 ? (
                    recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                        <div className="flex-shrink-0">
                          {activity.status === "pending" && <Clock className="w-5 h-5 text-yellow-400" />}
                          {activity.status === "completed" && <CheckCircle className="w-5 h-5 text-green-400" />}
                          {activity.status === "accepted" && <Users className="w-5 h-5 text-blue-400" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-white">{activity.message}</p>
                          <p className="text-xs text-neutral-400 mt-1">{activity.time}</p>
                        </div>
                        <Badge 
                          variant={activity.status === "completed" ? "default" : "secondary"}
                          className={
                            activity.status === "completed" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                            activity.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                            "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          }
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-neutral-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No recent activity</p>
                      <p className="text-sm">Start connecting with others to see activity here!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate("/browse")}
                  className="w-full bg-white text-black hover:bg-neutral-100"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Find Skills to Learn
                </Button>
                <Button 
                  onClick={() => navigate("/profile")}
                  variant="outline" 
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Update Your Profile
                </Button>
                <Button 
                  onClick={() => navigate("/requests")}
                  variant="outline" 
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  View Swap Requests
                </Button>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="text-sm text-white">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>Basic Info</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>Skills Added</span>
                    {user.skillsOffered.length > 0 || user.skillsWanted.length > 0 ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>Profile Photo</span>
                    <X className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-white">
                    <span>Bio</span>
                    {user.bio ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <X className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>{Math.round((user.bio ? 1 : 0 + (user.skillsOffered.length > 0 || user.skillsWanted.length > 0 ? 1 : 0) + 1) / 4 * 100)}% Complete</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-white h-2 rounded-full" 
                      style={{ 
                        width: `${Math.round((user.bio ? 1 : 0 + (user.skillsOffered.length > 0 || user.skillsWanted.length > 0 ? 1 : 0) + 1) / 4 * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
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

export default Dashboard;
