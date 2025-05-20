
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-invitation-purple">Invitari</h3>
            <p className="text-muted-foreground">
              Créez des invitations personnalisées pour tous vos événements spéciaux.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Liens rapides</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/designs" className="text-muted-foreground hover:text-invitation-purple transition-colors">
                  Modèles d'invitation
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-muted-foreground hover:text-invitation-purple transition-colors">
                  Mes événements
                </Link>
              </li>
              <li>
                <Link to="/editor" className="text-muted-foreground hover:text-invitation-purple transition-colors">
                  Éditeur d'invitation
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Ressources</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-invitation-purple transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-muted-foreground hover:text-invitation-purple transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-invitation-purple transition-colors">
                  Centre d'aide
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@invitari.com" className="text-muted-foreground hover:text-invitation-purple transition-colors">
                  contact@invitari.com
                </a>
              </li>
              <li>
                <a href="tel:+33123456789" className="text-muted-foreground hover:text-invitation-purple transition-colors">
                  +33 1 23 45 67 89
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-muted-foreground">
            © {new Date().getFullYear()} Invitari. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
