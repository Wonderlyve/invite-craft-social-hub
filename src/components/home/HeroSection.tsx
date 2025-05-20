
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="bg-invitation-purple/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Créez des invitations qui impressionnent
          </h1>
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Invitari vous permet de concevoir et gérer des invitations pour tous vos événements.
            Mariages, anniversaires, conférences — nous avons tout ce dont vous avez besoin.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/events">
                <Button size="lg" className="bg-invitation-purple hover:bg-invitation-purple-dark">
                  Mes Événements
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="lg" className="bg-invitation-purple hover:bg-invitation-purple-dark">
                  Commencer gratuitement
                </Button>
              </Link>
            )}
            <Link to="/designs">
              <Button size="lg" variant="outline">
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
