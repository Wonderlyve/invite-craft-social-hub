
import HeroSection from "@/components/home/HeroSection";
import FeatureCard from "@/components/home/FeatureCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ImageIcon, Users, Calendar, Share } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />

        {/* Features Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tout ce dont vous avez besoin pour vos invitations</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Des outils puissants et intuitifs pour créer, personnaliser et gérer vos invitations pour tous types d'événements.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<ImageIcon className="w-6 h-6" />}
                title="Éditeur visuel"
                description="Personnalisez facilement vos invitations avec notre éditeur intuitif. Ajoutez du texte, des images et des formes."
              />
              <FeatureCard 
                icon={<Users className="w-6 h-6" />}
                title="Gestion des invités"
                description="Gérez votre liste d'invités, suivez leurs réponses et attribuez-leur des tables en quelques clics."
              />
              <FeatureCard 
                icon={<Calendar className="w-6 h-6" />}
                title="Types d'événements"
                description="Des modèles adaptés à tous les événements : mariages, anniversaires, baptêmes, conférences, et plus encore."
              />
              <FeatureCard 
                icon={<Share className="w-6 h-6" />}
                title="Partage facile"
                description="Partagez vos invitations personnalisées via des liens uniques ou par email directement depuis l'application."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-invitation-purple/5">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Prêt à créer votre première invitation ?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Créez un compte gratuit dès maintenant et commencez à concevoir des invitations qui impressionneront vos invités.
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-invitation-purple hover:bg-invitation-purple-dark">
                  Commencer gratuitement
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Event Types Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Pour tous vos événements spéciaux</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Que vous organisiez un mariage intime ou une conférence professionnelle, nous avons les outils qu'il vous faut.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-lg overflow-hidden shadow-md">
                <img src="/placeholder.svg" alt="Mariage" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Mariages</h3>
                  <p className="text-muted-foreground mb-4">
                    Des invitations élégantes pour votre jour spécial, avec gestion des tables et des réponses.
                  </p>
                  <Link to="/designs?category=wedding">
                    <Button variant="outline" className="w-full">
                      Voir les modèles
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-md">
                <img src="/placeholder.svg" alt="Anniversaire" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Anniversaires</h3>
                  <p className="text-muted-foreground mb-4">
                    Des designs festifs et colorés pour célébrer un nouvel an de vie en beauté.
                  </p>
                  <Link to="/designs?category=birthday">
                    <Button variant="outline" className="w-full">
                      Voir les modèles
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-md">
                <img src="/placeholder.svg" alt="Conférence" className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Conférences</h3>
                  <p className="text-muted-foreground mb-4">
                    Des invitations professionnelles pour vos événements d'entreprise et séminaires.
                  </p>
                  <Link to="/designs?category=conference">
                    <Button variant="outline" className="w-full">
                      Voir les modèles
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Index;
