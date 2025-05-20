
import HeroSection from "@/components/home/HeroSection";
import FeatureCard from "@/components/home/FeatureCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ImageIcon, Users, Calendar, Share, Sparkles, ArrowRight } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";

const Index = () => {
  return (
    <PageContainer className="p-0">
      <main>
        <HeroSection />

        {/* Features Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-invitation-purple to-invitation-purple-dark">
                Tout ce dont vous avez besoin pour vos invitations
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Des outils puissants et intuitifs pour créer, personnaliser et gérer vos invitations pour tous types d'événements.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<ImageIcon className="w-8 h-8" />}
                title="Éditeur visuel"
                description="Personnalisez facilement vos invitations avec notre éditeur intuitif. Ajoutez du texte, des images et des formes."
              />
              <FeatureCard 
                icon={<Users className="w-8 h-8" />}
                title="Gestion des invités"
                description="Gérez votre liste d'invités, suivez leurs réponses et attribuez-leur des tables en quelques clics."
              />
              <FeatureCard 
                icon={<Calendar className="w-8 h-8" />}
                title="Types d'événements"
                description="Des modèles adaptés à tous les événements : mariages, anniversaires, baptêmes, conférences, et plus encore."
              />
              <FeatureCard 
                icon={<Share className="w-8 h-8" />}
                title="Partage facile"
                description="Partagez vos invitations personnalisées via des liens uniques ou par email directement depuis l'application."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-invitation-purple/5 to-invitation-cream/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 mb-6 rounded-full bg-invitation-purple/10 text-invitation-purple border border-invitation-purple/20">
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="font-medium">Commencez dès maintenant</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">Prêt à créer votre première invitation ?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Créez un compte gratuit dès maintenant et commencez à concevoir des invitations qui impressionneront vos invités.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?mode=signup">
                  <Button size="lg" className="bg-invitation-purple hover:bg-invitation-purple-dark gap-2 shadow-lg shadow-invitation-purple/20">
                    S'inscrire gratuitement
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/auth?mode=login">
                  <Button size="lg" variant="outline" className="border-invitation-purple/20 text-invitation-purple">
                    Connexion
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Event Types Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-invitation-purple to-invitation-purple-dark">
                Pour tous vos événements spéciaux
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Que vous organisiez un mariage intime ou une conférence professionnelle, nous avons les outils qu'il vous faut.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-500 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Mariages</h3>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-muted-foreground mb-4">
                    Des invitations élégantes pour votre jour spécial, avec gestion des tables et des réponses.
                  </p>
                  <Link to="/designs?category=mariage">
                    <Button variant="outline" className="w-full">
                      Voir les modèles
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-500 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Anniversaires</h3>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-muted-foreground mb-4">
                    Des designs festifs et colorés pour célébrer un nouvel an de vie en beauté.
                  </p>
                  <Link to="/designs?category=anniversaire">
                    <Button variant="outline" className="w-full">
                      Voir les modèles
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-teal-500 opacity-90"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">Conférences</h3>
                  </div>
                </div>
                <div className="p-6 bg-white">
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
    </PageContainer>
  );
};

export default Index;
