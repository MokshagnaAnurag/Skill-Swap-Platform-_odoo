
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  User, 
  Search, 
  MessageSquare, 
  Settings,
  LogOut,
  Users
} from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Dashboard" },
    { path: "/browse", icon: Search, label: "Browse Skills" },
    { path: "/skillswap", icon: Users, label: "SkillSwap" },
    { path: "/requests", icon: MessageSquare, label: "Swap Requests" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  if (user.isAdmin) {
    navItems.push({ path: "/admin", icon: Settings, label: "Admin" });
  }

  return (
    <nav className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="w-10 h-10 flex items-center justify-center rounded bg-white shadow-md overflow-hidden">
              <img src="/logo.svg" alt="SkillSpark Logo" className="w-8 h-8 object-contain" />
            </div>
            <span className="text-xl font-bold text-white">
              SkillSpark
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? "default" : "ghost"}
                  size="sm"
                  className={location.pathname === item.path 
                    ? "bg-white text-black hover:bg-neutral-100" 
                    : "text-white hover:bg-white/10 border-white/20"
                  }
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-white hover:bg-red-500/20 hover:text-red-400"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
