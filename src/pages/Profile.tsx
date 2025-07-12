
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  User as UserIcon, 
  MapPin, 
  Clock, 
  Star,
  Edit,
  Save,
  X,
  Plus,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/ui/animated-footer";
import { dataManager, type User } from "@/lib/data";
import Breadcrumb from "@/components/ui/breadcrumb";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    location: "",
    bio: "",
    availability: "",
    isPublic: false,
    skillsOffered: [] as string[],
    skillsWanted: [] as string[]
  });
  const [newSkill, setNewSkill] = useState({ type: "offered", skill: "" });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setEditData({
      name: parsedUser.name,
      location: parsedUser.location || "",
      bio: parsedUser.bio || "",
      availability: parsedUser.availability || "",
      isPublic: parsedUser.isPublic,
      skillsOffered: [...parsedUser.skillsOffered],
      skillsWanted: [...parsedUser.skillsWanted]
    });
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setEditData({
        name: user.name,
        location: user.location || "",
        bio: user.bio || "",
        availability: user.availability || "",
        isPublic: user.isPublic,
        skillsOffered: [...user.skillsOffered],
        skillsWanted: [...user.skillsWanted]
      });
    }
  };

  const handleSave = () => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...editData
    };

    dataManager.updateUser(user.id, updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);

    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleAddSkill = () => {
    if (!newSkill.skill.trim()) return;

    if (newSkill.type === "offered") {
      if (!editData.skillsOffered.includes(newSkill.skill)) {
        setEditData({
          ...editData,
          skillsOffered: [...editData.skillsOffered, newSkill.skill]
        });
      }
    } else {
      if (!editData.skillsWanted.includes(newSkill.skill)) {
        setEditData({
          ...editData,
          skillsWanted: [...editData.skillsWanted, newSkill.skill]
        });
      }
    }

    setNewSkill({ type: "offered", skill: "" });
  };

  const handleRemoveSkill = (skill: string, type: "offered" | "wanted") => {
    if (type === "offered") {
      setEditData({
        ...editData,
        skillsOffered: editData.skillsOffered.filter(s => s !== skill)
      });
    } else {
      setEditData({
        ...editData,
        skillsWanted: editData.skillsWanted.filter(s => s !== skill)
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Profile" }]} />
        
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Profile</h1>
              <p className="text-neutral-300">Manage your profile and skills</p>
            </div>
            {!isEditing ? (
              <Button onClick={handleEdit} className="bg-white text-black hover:bg-neutral-100">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <Button onClick={handleCancel} variant="outline" className="text-white border-white/20 hover:bg-white/10">
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">Name</Label>
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        className="mt-1 bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-neutral-300 mt-1">{user.name}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-white">Location</Label>
                    {isEditing ? (
                      <Input
                        value={editData.location}
                        onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                        placeholder="City, State"
                        className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                      />
                    ) : (
                      <p className="text-neutral-300 mt-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {user.location || "Not specified"}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label className="text-white">Bio</Label>
                  {isEditing ? (
                    <Textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      placeholder="Tell others about yourself..."
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                      rows={3}
                    />
                  ) : (
                    <p className="text-neutral-300 mt-1">{user.bio || "No bio added yet."}</p>
                  )}
                </div>

                <div>
                  <Label className="text-white">Availability</Label>
                  {isEditing ? (
                    <Input
                      value={editData.availability}
                      onChange={(e) => setEditData({ ...editData, availability: e.target.value })}
                      placeholder="e.g., Weekends, Evenings"
                      className="mt-1 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                    />
                  ) : (
                    <p className="text-neutral-300 mt-1 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {user.availability || "Flexible"}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isEditing ? editData.isPublic : user.isPublic}
                    onCheckedChange={(checked) => setEditData({ ...editData, isPublic: checked })}
                    disabled={!isEditing}
                  />
                  <Label className="text-white">Public Profile</Label>
                </div>
              </CardContent>
            </Card>

            {/* Skills Offered */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Skills You Can Teach</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill.skill}
                        onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                        placeholder="Add a skill you can teach..."
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                      />
                      <Button onClick={handleAddSkill} className="bg-white text-black hover:bg-neutral-100">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editData.skillsOffered.map((skill) => (
                        <Badge key={skill} className="bg-green-500/20 text-green-400 border-green-500/30">
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill, "offered")}
                            className="ml-2 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered.length > 0 ? (
                      user.skillsOffered.map((skill) => (
                        <Badge key={skill} className="bg-green-500/20 text-green-400 border-green-500/30">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-neutral-400">No skills added yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skills Wanted */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Skills You Want to Learn</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={newSkill.skill}
                        onChange={(e) => setNewSkill({ ...newSkill, skill: e.target.value })}
                        placeholder="Add a skill you want to learn..."
                        className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                      />
                      <Button onClick={handleAddSkill} className="bg-white text-black hover:bg-neutral-100">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editData.skillsWanted.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-blue-500/30 text-blue-400">
                          {skill}
                          <button
                            onClick={() => handleRemoveSkill(skill, "wanted")}
                            className="ml-2 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted.length > 0 ? (
                      user.skillsWanted.map((skill) => (
                        <Badge key={skill} variant="outline" className="border-blue-500/30 text-blue-400">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-neutral-400">No skills wanted yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="space-y-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-medium">{user.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Completed Swaps</span>
                  <span className="text-white font-medium">{user.completedSwaps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Member Since</span>
                  <span className="text-white font-medium">{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Last Active</span>
                  <span className="text-white font-medium">{user.lastActive}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={() => navigate("/browse")} 
                  className="w-full bg-white text-black hover:bg-neutral-100"
                >
                  Browse Skills
                </Button>
                <Button 
                  onClick={() => navigate("/swap-requests")} 
                  variant="outline"
                  className="w-full text-white border-white/20 hover:bg-white/10"
                >
                  View Requests
                </Button>
                {user.isAdmin && (
                  <Button 
                    onClick={() => navigate("/admin")} 
                    variant="outline"
                    className="w-full text-white border-white/20 hover:bg-white/10"
                  >
                    Admin Dashboard
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
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

export default Profile;
