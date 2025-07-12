
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/ui/animated-footer";
import { dataManager } from "@/lib/data";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      // Check if user exists in our data manager
      const user = dataManager.getUserByEmail(loginData.email);
      
      if (user) {
        // In a real app, you'd verify the password
        // For demo purposes, we'll accept any password
        localStorage.setItem("user", JSON.stringify(user));
        toast({
          title: "Welcome back!",
          description: "Successfully logged in.",
        });
        navigate("/dashboard");
      } else {
        toast({
          title: "Login failed",
          description: "User not found. Please check your email or sign up.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords don't match.",
        variant: "destructive",
      });
      return;
    }
    if (signupData.name && signupData.email && signupData.password) {
      // Check if user already exists
      const existingUser = dataManager.getUserByEmail(signupData.email);
      if (existingUser) {
        toast({
          title: "Account exists",
          description: "An account with this email already exists. Please log in instead.",
          variant: "destructive",
        });
        return;
      }

      // Create new user
      const newUser = dataManager.createUser({
        name: signupData.name,
        email: signupData.email,
        location: "",
        bio: "",
        availability: "",
        isPublic: true,
        isAdmin: false,
        skillsOffered: [],
        skillsWanted: []
      });

      localStorage.setItem("user", JSON.stringify(newUser));
      toast({
        title: "Welcome to SkillSpark!",
        description: "Account created successfully.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 flex flex-col justify-between">
      {/* Header */}
      <header className="w-full z-20 container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 flex items-center justify-center rounded bg-white shadow-md overflow-hidden">
            <img src="/logo.svg" alt="SkillSpark Logo" className="w-8 h-8 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white">SkillSpark</h1>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/">
            <Button variant="outline" className="hover:bg-neutral-800 bg-white/80 text-black border-neutral-700">
              Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 items-center justify-center py-8">
        <div className="w-full max-w-md">
          <div className="flex items-center mb-8">
            <Link to="/" className="flex items-center text-neutral-400 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to home
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-4">
              SkillSpark
            </h1>
            <p className="text-neutral-300">Join the community of skill sharing</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/10 border-white/10">
            <CardHeader>
              <CardTitle className="text-center text-white">Welcome</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-white">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-100">
                      Sign In
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Full Name</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={signupData.name}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-white">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-white">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a password"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="bg-white/10 border-white/20 text-white placeholder:text-neutral-400"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-white text-black hover:bg-neutral-100">
                      Create Account
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="text-center mt-6 text-sm text-neutral-400">
            <p>Demo accounts:</p>
            <p>• priya@example.com (regular user)</p>
            <p>• rahul@example.com (regular user)</p>
            <p>• anjali@example.com (regular user)</p>
            <p>• admin@skillspark.com (admin access)</p>
            <p>• Any password will work for demo</p>
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

export default Login;
