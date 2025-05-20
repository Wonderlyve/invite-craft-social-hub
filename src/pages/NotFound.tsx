
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import PageContainer from "@/components/layout/PageContainer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageContainer showNavbar={false} showFooter={false}>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-bold text-invitation-purple mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
          <p className="text-muted-foreground mb-8">
            Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/">
            <Button className="bg-invitation-purple hover:bg-invitation-purple-dark">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
