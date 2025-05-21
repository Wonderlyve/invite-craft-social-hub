
import { ReactNode, useEffect } from "react";

interface ScrollWrapperProps {
  children: ReactNode;
}

const ScrollWrapper = ({ children }: ScrollWrapperProps) => {
  // S'assurer que la page démarre en haut à chaque fois
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return <>{children}</>;
};

export default ScrollWrapper;
