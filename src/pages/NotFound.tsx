import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Footer from "@/components/ui/animated-footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-neutral-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-white">404</h1>
        <p className="text-xl text-neutral-300 mb-8">Oops! Page not found</p>
        <p className="text-neutral-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button className="bg-white text-black hover:bg-neutral-100">
            <Home className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </Link>
      </div>
      
      <Footer
        leftLinks={[
          { href: "/terms", label: "Terms & policies" },
          { href: "/privacy-policy", label: "Privacy policy" },
        ]}
        rightLinks={[
      
        ]}
        copyrightText="SkillSpark 2025. All Rights Reserved"
        barCount={23}
      />
    </div>
  );
};

export default NotFound;
