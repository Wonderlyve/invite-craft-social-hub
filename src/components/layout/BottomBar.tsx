
import { Link, useLocation } from "react-router-dom";
import { Home, Album, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
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
      label: "Profil",
      icon: User,
      href: "/auth",
    },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 md:hidden bg-background border-t border-border">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = 
            (item.href === "/" && currentPath === "/") ||
            (item.href !== "/" && currentPath.startsWith(item.href));
            
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center p-3 flex-1",
                isActive ? "text-invitation-purple" : "text-muted-foreground"
              )}
            >
              <item.icon 
                className={cn(
                  "h-5 w-5",
                  isActive ? "text-invitation-purple" : "text-muted-foreground"
                )}
              />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;
