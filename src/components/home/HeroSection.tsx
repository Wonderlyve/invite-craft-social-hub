
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-background pt-16 md:pt-20 lg:pt-24">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-invitation-purple/10 to-transparent"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Créez des invitations <span className="text-invitation-purple">inoubliables</span> pour vos événements
            </h1>
            <p className="text-xl text-muted-foreground">
              Concevez, personnalisez et partagez facilement des invitations pour tous vos événements spéciaux. Mariages, anniversaires, conférences, et plus encore.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-invitation-purple hover:bg-invitation-purple-dark">
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/designs">
                <Button size="lg" variant="outline">
                  Découvrir les modèles
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative lg:h-[600px] flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute top-0 -left-4 w-72 h-72 bg-invitation-purple-light rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
              <div className="absolute top-0 -right-4 w-72 h-72 bg-invitation-cream rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute -bottom-8 left-20 w-72 h-72 bg-invitation-peach rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
              <div className="relative">
                <img 
                  src="/placeholder.svg" 
                  alt="Exemple d'invitation" 
                  className="rounded-lg shadow-xl transform rotate-3 scale-110"
                />
                <img 
                  src="/placeholder.svg" 
                  alt="Exemple d'invitation" 
                  className="absolute -bottom-10 -left-10 rounded-lg shadow-xl w-2/3 transform -rotate-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
