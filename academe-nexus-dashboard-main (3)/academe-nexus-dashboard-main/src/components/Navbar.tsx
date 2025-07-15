import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut, Home, Calendar, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import universityLogo from "@/assets/university-logo.png";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Navigate to login page
    navigate("/login");
  };

  const navigationItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/meetings", label: "Meetings", icon: Users },
    { href: "/study-plans", label: "Study Plans", icon: BookOpen },
  ];

  return (
    <nav className="academic-gradient sticky top-0 z-50 shadow-academic">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <img 
              src={universityLogo} 
              alt="University Logo" 
              className="h-10 w-auto"
            />
            <span className="text-white font-semibold text-xl">University ERP</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden py-3 border-t border-white/20">
          <div className="flex justify-around">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};