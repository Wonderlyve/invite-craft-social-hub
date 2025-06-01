
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, LogOut } from "lucide-react";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="w-full py-4 border-b border-border bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 backdrop-blur-sm fixed top-0 z-20 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white drop-shadow-lg">
            Invitari
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">
            Accueil
          </Link>
          <Link to="/designs" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">
            Modèles
          </Link>
          <Link to="/events" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">
            Mes Événements
          </Link>
          <Link to="/about" className="text-white/90 hover:text-white transition-colors duration-200 font-medium">
            À propos
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/auth?mode=login">
                <Button variant="outline" className="hidden md:inline-flex bg-white/10 border-white/20 text-white hover:bg-white/20">
                  Connexion
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-white text-purple-700 hover:bg-white/90 font-semibold">
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-gradient-to-b from-purple-900/95 to-purple-800/95 backdrop-blur-sm z-10 md:hidden animate-fade-in">
          <div className="flex flex-col p-4">
            <Link 
              to="/" 
              className="px-4 py-3 hover:bg-white/10 rounded-md text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/designs" 
              className="px-4 py-3 hover:bg-white/10 rounded-md text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Modèles
            </Link>
            <Link 
              to="/events" 
              className="px-4 py-3 hover:bg-white/10 rounded-md text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mes Événements
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-3 hover:bg-white/10 rounded-md text-white transition-colors duration-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            
            {user ? (
              <Button 
                variant="ghost" 
                className="flex justify-start px-4 py-3 hover:bg-white/10 rounded-md mt-2 text-red-300"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            ) : (
              <div className="flex flex-col gap-2 mt-4">
                <Link to="/auth?mode=login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-white text-purple-700 hover:bg-white/90 w-full font-semibold">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
