
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle,
  XCircle,
  Download,
  Send,
  Ban,
  Shield,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/ui/animated-footer";
import { dataManager, type User, type Report, type PlatformMessage } from "@/lib/data";
import Breadcrumb from "@/components/ui/breadcrumb";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [platformMessages, setPlatformMessages] = useState<PlatformMessage[]>([]);
  const [newMessage, setNewMessage] = useState({ title: "", content: "" });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSwaps: 0,
    pendingReports: 0,
    completedSwaps: 0,
    totalRatings: 0,
    averageRating: 0
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setCurrentUser(parsedUser);
    
    if (!parsedUser.isAdmin) {
      navigate("/dashboard");
      return;
    }

    // Load admin data
    const allUsers = dataManager.getUsers();
    const allReports = dataManager.getReports();
    const allMessages = dataManager.getPlatformMessages();
    const adminStats = dataManager.getStats();
    
    setUsers(allUsers);
    setReports(allReports);
    setPlatformMessages(allMessages);
    setStats(adminStats);
  }, [navigate]);

  const handleBanUser = (userId: string) => {
    dataManager.updateUser(userId, { isPublic: false });
    
    // Refresh data
    const allUsers = dataManager.getUsers();
    setUsers(allUsers);
    
    toast({
      title: "User banned",
      description: "User has been banned from the platform.",
      variant: "destructive",
    });
  };

  const handleUnbanUser = (userId: string) => {
    dataManager.updateUser(userId, { isPublic: true });
    
    // Refresh data
    const allUsers = dataManager.getUsers();
    setUsers(allUsers);
    
    toast({
      title: "User unbanned",
      description: "User has been unbanned from the platform.",
    });
  };

  const handleResolveReport = (reportId: string) => {
    dataManager.updateReport(reportId, 'resolved');
    
    // Refresh data
    const allReports = dataManager.getReports();
    setReports(allReports);
    
    toast({
      title: "Report resolved",
      description: "The report has been marked as resolved.",
    });
  };

  const handleDismissReport = (reportId: string) => {
    dataManager.updateReport(reportId, 'dismissed');
    
    // Refresh data
    const allReports = dataManager.getReports();
    setReports(allReports);
    
    toast({
      title: "Report dismissed",
      description: "The report has been dismissed.",
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.title.trim() || !newMessage.content.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in both title and content.",
        variant: "destructive",
      });
      return;
    }

    dataManager.createPlatformMessage({
      title: newMessage.title,
      content: newMessage.content,
      sentBy: currentUser?.name || "Admin"
    });

    // Refresh data
    const allMessages = dataManager.getPlatformMessages();
    setPlatformMessages(allMessages);
    setNewMessage({ title: "", content: "" });

    toast({
      title: "Message sent!",
      description: "Platform message has been sent to all users.",
    });
  };

  const handleExportData = () => {
    const data = dataManager.exportUserActivity();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'skillspark-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: "Platform data has been downloaded.",
    });
  };

  if (!currentUser?.isAdmin) {
    return <div>Access denied</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Admin Dashboard" }]} />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-neutral-300">Manage platform users, reports, and send announcements</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400">Active Swaps</p>
                  <p className="text-2xl font-bold text-white">{stats.activeSwaps}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400">Pending Reports</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingReports}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400">Completed Swaps</p>
                  <p className="text-2xl font-bold text-white">{stats.completedSwaps}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400">Total Ratings</p>
                  <p className="text-2xl font-bold text-white">{stats.totalRatings}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-400">Avg Rating</p>
                  <p className="text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 bg-white/10 border-white/10">
            <TabsTrigger value="users" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <Users className="w-4 h-4" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <AlertTriangle className="w-4 h-4" />
              Reports ({reports.length})
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <MessageSquare className="w-4 h-4" />
              Messages ({platformMessages.length})
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-4">
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id} className="bg-white/10 backdrop-blur-sm border-white/10">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback className="bg-white/20 text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg text-white">{user.name}</CardTitle>
                          <p className="text-sm text-neutral-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={user.isPublic ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                          {user.isPublic ? "Active" : "Banned"}
                        </Badge>
                        {user.isAdmin && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-neutral-300">
                        <p>Rating: {user.rating.toFixed(1)} ⭐</p>
                        <p>Completed swaps: {user.completedSwaps}</p>
                        <p>Member since: {new Date(user.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {user.isPublic ? (
                          <Button 
                            onClick={() => handleBanUser(user.id)}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Ban className="w-4 h-4 mr-2" />
                            Ban User
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleUnbanUser(user.id)}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <Shield className="w-4 h-4 mr-2" />
                            Unban User
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Management */}
          <TabsContent value="reports" className="space-y-4">
            {reports.length > 0 ? (
              reports.map((report) => {
                const reporter = dataManager.getUserById(report.reporterId);
                const reportedUser = dataManager.getUserById(report.reportedUserId);
                
                return (
                  <Card key={report.id} className="bg-white/10 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg text-white">Report #{report.id}</CardTitle>
                          <p className="text-sm text-neutral-400">Reported by {reporter?.name || 'Unknown'}</p>
                        </div>
                        <Badge className={report.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-green-500/20 text-green-400 border-green-500/30"}>
                          {report.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-neutral-400">Reporter:</span>
                            <span className="text-white ml-2">{reporter?.name || 'Unknown'}</span>
                          </div>
                          <div>
                            <span className="text-neutral-400">Reported User:</span>
                            <span className="text-white ml-2">{reportedUser?.name || 'Unknown'}</span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-neutral-400">Reason:</span>
                          <p className="text-white mt-1">{report.reason}</p>
                        </div>
                        
                        <div>
                          <span className="text-neutral-400">Description:</span>
                          <p className="text-neutral-300 mt-1 bg-white/5 p-3 rounded-lg border border-white/10">
                            {report.description}
                          </p>
                        </div>
                        
                        <p className="text-sm text-neutral-400">Reported on {report.timestamp}</p>
                        
                        {report.status === "pending" && (
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleResolveReport(report.id)}
                              className="bg-green-500 hover:bg-green-600 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Resolve
                            </Button>
                            <Button 
                              onClick={() => handleDismissReport(report.id)}
                              variant="outline"
                              className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Dismiss
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-neutral-400 opacity-50" />
                <h3 className="text-lg font-medium text-white mb-2">No reports</h3>
                <p className="text-neutral-400">All clear! No reports to review.</p>
              </div>
            )}
          </TabsContent>

          {/* Platform Messages */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Send Platform Message</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-white">Title</label>
                  <Input
                    value={newMessage.title}
                    onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                    placeholder="Message title..."
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-white">Content</label>
                  <Textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                    placeholder="Message content..."
                    className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                    rows={4}
                  />
                </div>
                <Button onClick={handleSendMessage} className="bg-white text-black hover:bg-neutral-100">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Recent Messages</h3>
              {platformMessages.length > 0 ? (
                platformMessages.map((message) => (
                  <Card key={message.id} className="bg-white/10 backdrop-blur-sm border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-white">{message.title}</CardTitle>
                        <p className="text-sm text-neutral-400">{message.timestamp}</p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-300">{message.content}</p>
                      <p className="text-sm text-neutral-400 mt-2">Sent by {message.sentBy}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-neutral-400 opacity-50" />
                  <p className="text-neutral-400">No platform messages sent yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Data Export */}
          <TabsContent value="export" className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Export Platform Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-300 mb-4">
                  Download comprehensive platform data including user activity, swap statistics, 
                  feedback logs, and administrative reports.
                </p>
                <Button onClick={handleExportData} className="bg-white text-black hover:bg-neutral-100">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
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

export default AdminDashboard;
