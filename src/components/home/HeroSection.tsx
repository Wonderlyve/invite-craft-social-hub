
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Paintbrush2, ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-invitation-purple/5 via-white to-invitation-cream/30">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-invitation-purple/10 to-transparent"></div>
      
      {/* Cercles décoratifs */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-invitation-purple/5 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-invitation-cream/30 blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1 mb-6 rounded-full bg-invitation-purple/10 text-invitation-purple border border-invitation-purple/20">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Une nouvelle façon de créer des invitations</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-invitation-purple to-invitation-purple-dark">
            Créez des invitations qui impressionnent
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Invitari vous permet de concevoir et gérer des invitations pour tous vos événements.
            Mariages, anniversaires, conférences — nous avons tout ce dont vous avez besoin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/events">
                <Button size="lg" className="bg-invitation-purple hover:bg-invitation-purple-dark gap-2 shadow-lg shadow-invitation-purple/20">
                  Mes Événements
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-invitation-purple hover:bg-invitation-purple-dark gap-2 shadow-lg shadow-invitation-purple/20">
                  Commencer maintenant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
            <Link to="/designs">
              <Button size="lg" variant="outline" className="border-invitation-purple/20 text-invitation-purple gap-2">
                <Paintbrush2 className="w-4 h-4" />
                Explorer les modèles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
