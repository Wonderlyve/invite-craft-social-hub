
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
    <nav className="w-full py-4 border-b border-border bg-background/95 backdrop-blur-sm fixed top-0 z-20">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-invitation-purple to-invitation-purple-dark">Invitari</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground hover:text-invitation-purple transition-colors">
            Accueil
          </Link>
          <Link to="/designs" className="text-foreground hover:text-invitation-purple transition-colors">
            Modèles
          </Link>
          <Link to="/events" className="text-foreground hover:text-invitation-purple transition-colors">
            Mes Événements
          </Link>
          <Link to="/about" className="text-foreground hover:text-invitation-purple transition-colors">
            À propos
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/auth?mode=login">
                <Button variant="outline" className="hidden md:inline-flex">
                  Connexion
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button className="bg-invitation-purple hover:bg-invitation-purple-dark">
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 bg-background z-10 md:hidden">
          <div className="flex flex-col p-4">
            <Link 
              to="/" 
              className="px-4 py-3 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Accueil
            </Link>
            <Link 
              to="/designs" 
              className="px-4 py-3 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Modèles
            </Link>
            <Link 
              to="/events" 
              className="px-4 py-3 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              Mes Événements
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-3 hover:bg-muted rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              À propos
            </Link>
            
            {user ? (
              <Button 
                variant="ghost" 
                className="flex justify-start px-4 py-3 hover:bg-muted rounded-md mt-2 text-destructive"
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
                  <Button variant="outline" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="bg-invitation-purple hover:bg-invitation-purple-dark w-full">
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
