
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Mail, GitHub, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-invitation-purple to-invitation-purple-dark">
            À propos d'Invitari
          </h1>
          <p className="text-muted-foreground text-lg">
            Découvrez notre histoire et notre mission
          </p>
        </div>

        <div className="prose prose-lg max-w-none mb-12">
          <h2>Notre histoire</h2>
          <p>
            Invitari est né d'une idée simple : rendre la création et la gestion d'invitations plus
            facile, plus intuitive et plus élégante. Notre équipe de designers et de développeurs
            passionnés a travaillé pour créer une plateforme qui combine la puissance des outils
            d'édition graphique avec la simplicité d'utilisation nécessaire pour tous les utilisateurs.
          </p>
          
          <h2>Notre mission</h2>
          <p>
            Notre mission est de permettre à chacun de créer des invitations personnalisées de qualité
            professionnelle sans avoir besoin de compétences en design. Nous croyons que les moments
            importants de la vie méritent des invitations à la hauteur de l'événement, qu'il s'agisse
            d'un mariage somptueux, d'un anniversaire joyeux ou d'une conférence professionnelle.
          </p>
          
          <h2>Nos valeurs</h2>
          <ul>
            <li>
              <strong>Créativité</strong> - Nous encourageons l'expression créative à travers nos outils et modèles.
            </li>
            <li>
              <strong>Simplicité</strong> - Nous concevons des interfaces intuitives qui ne nécessitent pas de formation.
            </li>
            <li>
              <strong>Qualité</strong> - Nous nous efforçons d'offrir des résultats de qualité professionnelle.
            </li>
            <li>
              <strong>Innovation</strong> - Nous améliorons constamment nos outils et fonctionnalités.
            </li>
          </ul>
        </div>

        <div className="bg-invitation-purple/5 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold mb-4">Technologie</h2>
          <p className="mb-6">
            Invitari est construit avec des technologies web modernes pour offrir une expérience
            fluide et réactive. Notre éditeur d'invitation utilise des bibliothèques de manipulation
            graphique avancées qui permettent une personnalisation complète tout en restant simple à utiliser.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">React</span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">TypeScript</span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">Tailwind CSS</span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">Konva.js</span>
            <span className="px-3 py-1 bg-white rounded-full text-sm font-medium shadow-sm">Supabase</span>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="mb-6">
            Des questions ou des suggestions ? N'hésitez pas à nous contacter !
          </p>
          <div className="flex justify-center gap-4">
            <Button variant="outline" className="gap-2">
              <Mail className="h-4 w-4" />
              contact@invitari.com
            </Button>
            <Button variant="outline" className="gap-2">
              <GitHub className="h-4 w-4" />
              GitHub
            </Button>
          </div>
          <div className="mt-12 text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-2">
              Fait avec <Heart className="h-4 w-4 text-invitation-purple" /> par l'équipe Invitari
            </p>
            <p>© {new Date().getFullYear()} Invitari. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AboutPage;
