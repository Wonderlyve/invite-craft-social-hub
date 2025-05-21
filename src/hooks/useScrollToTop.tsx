
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Ce hook assure que la page est scrollée en haut lors de la navigation
export function useScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}
