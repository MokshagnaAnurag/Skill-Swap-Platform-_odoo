
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  MapPin, 
  Clock, 
  Star,
  MessageSquare,
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/ui/animated-footer";
import { dataManager, type User } from "@/lib/data";
import Breadcrumb from "@/components/ui/breadcrumb";

const BrowseSkills = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(6);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setCurrentUser(parsedUser);
    
    // Get all public users except current user
    const allUsers = dataManager.getUsers().filter(user => user.id !== parsedUser.id);
    setFilteredUsers(allUsers);
  }, [navigate]);

  const categories = [
    "all", "Technology", "Design", "Languages", "Music", "Fitness", "Cooking", "Other"
  ];

  // Filter users based on search and category
  useEffect(() => {
    const users = dataManager.searchUsers(searchTerm, selectedCategory);
    setFilteredUsers(users.filter(user => user.id !== currentUser?.id));
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, selectedCategory, currentUser]);

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleSendRequest = (user: User) => {
    if (!currentUser) return;

    // Check if user has skills to offer
    if (currentUser.skillsOffered.length === 0) {
      toast({
        title: "No skills to offer",
        description: "Please add skills you can teach in your profile first.",
        variant: "destructive",
      });
      return;
    }

    // For demo purposes, we'll use the first skill offered by current user
    // In a real app, you'd have a modal to select which skill to offer
    const skillOffered = currentUser.skillsOffered[0];
    const skillWanted = user.skillsOffered[0]; // First skill from target user

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
      fromUserId: currentUser.id,
      toUserId: user.id,
      skillOffered: skillOffered,
      skillWanted: skillWanted,
      message: `Hi ${user.name}! I'd love to learn ${skillWanted} from you. I can teach you ${skillOffered} in return.`,
      status: "pending"
    });

    toast({
      title: "Request sent!",
      description: `Your swap request has been sent to ${user.name}.`,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Browse Skills" }]} />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Browse Skills</h1>
          <p className="text-neutral-300">Discover amazing people and their skills in your community</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
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
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral-300">
            Showing {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
          </p>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {currentUsers.map((user) => (
            <Card key={user.id} className="bg-white/10 backdrop-blur-sm border-white/10 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-white/20 text-white font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-white">{user.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-neutral-300">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {user.location || "Location not set"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        {user.rating.toFixed(1)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-neutral-300 mb-2">Skills Offered</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsOffered.slice(0, 3).map((skill) => (
                      <Badge key={skill} className="bg-green-500/20 text-green-400 border-green-500/30">
                        {skill}
                      </Badge>
                    ))}
                    {user.skillsOffered.length > 3 && (
                      <Badge className="bg-neutral-500/20 text-neutral-400 border-neutral-500/30">
                        +{user.skillsOffered.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-neutral-300 mb-2">Skills Wanted</h4>
                  <div className="flex flex-wrap gap-1">
                    {user.skillsWanted.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                        {skill}
                      </Badge>
                    ))}
                    {user.skillsWanted.length > 3 && (
                      <Badge variant="outline" className="border-neutral-500/30 text-neutral-400">
                        +{user.skillsWanted.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1 text-sm text-neutral-400">
                    <Clock className="w-4 h-4" />
                    {user.availability || "Flexible"}
                  </div>
                  
                  <Button
                    onClick={() => handleSendRequest(user)}
                    className="bg-white text-black hover:bg-neutral-100"
                    disabled={!currentUser || currentUser.skillsOffered.length === 0}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage 
                    ? "bg-white text-black hover:bg-neutral-100" 
                    : "text-white border-white/20 hover:bg-white/10"
                  }
                >
                  {page}
                </Button>
              ))}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="text-white border-white/20 hover:bg-white/10 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
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

export default BrowseSkills;
