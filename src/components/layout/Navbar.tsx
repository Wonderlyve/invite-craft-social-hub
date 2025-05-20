
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full py-4 border-b border-border bg-background/95 backdrop-blur-sm fixed top-0 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-invitation-purple">Invitari</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
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
          <Link to="/login">
            <Button variant="outline" className="hidden md:inline-flex">
              Connexion
            </Button>
          </Link>
          <Link to="/register">
            <Button className="bg-invitation-purple hover:bg-invitation-purple-dark">
              S'inscrire
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
