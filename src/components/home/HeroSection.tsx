
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Paintbrush2, ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Cercles décoratifs avec dégradés */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20 blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-indigo-500/20 blur-3xl animate-pulse delay-1000"></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 border border-purple-200 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Une nouvelle façon de créer des invitations</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 leading-tight">
            Créez des invitations
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
              qui impressionnent
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
            Invitari vous permet de concevoir et gérer des invitations professionnelles pour tous vos événements.
            Mariages, anniversaires, conférences — nous avons tout ce dont vous avez besoin.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {user ? (
              <Link to="/events">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2 shadow-xl shadow-purple-500/25 px-8 py-4 text-lg">
                  Mes Événements
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2 shadow-xl shadow-purple-500/25 px-8 py-4 text-lg">
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            )}
            <Link to="/designs">
              <Button size="lg" variant="outline" className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 gap-2 px-8 py-4 text-lg">
                <Paintbrush2 className="w-5 h-5" />
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
