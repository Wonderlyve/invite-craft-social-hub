
import HeroSection from "@/components/home/HeroSection";
import FeatureCard from "@/components/home/FeatureCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ImageIcon, Users, Calendar, Share, Sparkles, ArrowRight } from "lucide-react";
import PageContainer from "@/components/layout/PageContainer";
import AnimatedSidebar from "@/components/layout/AnimatedSidebar";

const Index = () => {
  return (
    <>
      <AnimatedSidebar />
      <PageContainer className="p-0 ml-0 md:ml-16">
        <main>
          <HeroSection />

          {/* Features Section */}
          <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Tout ce dont vous avez besoin pour vos invitations
                </h2>
                <p className="text-gray-600 text-xl max-w-3xl mx-auto">
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
          <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="inline-flex items-center px-6 py-3 mb-8 rounded-full bg-white/10 text-white border border-white/20">
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span className="font-medium text-lg">Commencez dès maintenant</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Prêt à créer votre première invitation ?
                </h2>
                <p className="text-blue-100 text-xl mb-10 max-w-3xl mx-auto">
                  Créez un compte gratuit dès maintenant et commencez à concevoir des invitations qui impressionneront vos invités.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/auth?mode=signup">
                    <Button size="lg" className="bg-white text-purple-700 hover:bg-gray-100 gap-2 shadow-lg px-8 py-4 text-lg font-semibold">
                      S'inscrire gratuitement
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/auth?mode=login">
                    <Button size="lg" variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg">
                      Connexion
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Event Types Section */}
          <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                  Pour tous vos événements spéciaux
                </h2>
                <p className="text-gray-600 text-xl max-w-3xl mx-auto">
                  Que vous organisiez un mariage intime ou une conférence professionnelle, nous avons les outils qu'il vous faut.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-600 opacity-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-white">Mariages</h3>
                    </div>
                  </div>
                  <div className="p-8 bg-white">
                    <p className="text-gray-600 mb-6 text-lg">
                      Des invitations élégantes pour votre jour spécial, avec gestion des tables et des réponses.
                    </p>
                    <Link to="/designs?category=mariage">
                      <Button variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50">
                        Voir les modèles
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-600 opacity-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-white">Anniversaires</h3>
                    </div>
                  </div>
                  <div className="p-8 bg-white">
                    <p className="text-gray-600 mb-6 text-lg">
                      Des designs festifs et colorés pour célébrer un nouvel an de vie en beauté.
                    </p>
                    <Link to="/designs?category=anniversaire">
                      <Button variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-50">
                        Voir les modèles
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="relative h-48 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-600 opacity-90"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-3xl font-bold text-white">Conférences</h3>
                    </div>
                  </div>
                  <div className="p-8 bg-white">
                    <p className="text-gray-600 mb-6 text-lg">
                      Des invitations professionnelles pour vos événements d'entreprise et séminaires.
                    </p>
                    <Link to="/designs?category=conference">
                      <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
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
    </>
  );
};

export default Index;
