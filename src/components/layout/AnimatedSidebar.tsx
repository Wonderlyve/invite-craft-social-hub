
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Album, 
  Calendar, 
  User, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

const AnimatedSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      label: "Accueil",
      icon: Home,
      href: "/",
    },
    {
      label: "Modèles",
      icon: Album,
      href: "/designs",
    },
    {
      label: "Événements",
      icon: Calendar,
      href: "/events",
    },
    {
      label: "À propos",
      icon: Info,
      href: "/about",
    },
    {
      label: "Profil",
      icon: User,
      href: "/auth",
    },
  ];

  return (
    <div 
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gradient-to-b from-purple-50 to-blue-50 border-r border-purple-200 shadow-lg transition-all duration-300 ease-in-out z-10 hidden md:flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Toggle button */}
      <div className="flex justify-end p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover:bg-purple-100 transition-colors duration-200"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-purple-700" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-purple-700" />
          )}
        </Button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = 
              (item.href === "/" && location.pathname === "/") ||
              (item.href !== "/" && location.pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group",
                    isActive 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md transform scale-105" 
                      : "text-purple-700 hover:bg-purple-100 hover:transform hover:scale-105"
                  )}
                >
                  <item.icon 
                    className={cn(
                      "h-5 w-5 transition-transform duration-200",
                      !isCollapsed && "group-hover:scale-110"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="font-medium transition-all duration-200">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-purple-200">
          <div className="text-xs text-purple-600 text-center">
            <p className="font-semibold">Invitari</p>
            <p>Créez des invitations uniques</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedSidebar;
