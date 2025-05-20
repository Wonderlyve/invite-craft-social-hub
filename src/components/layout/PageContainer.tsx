
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
}

const PageContainer = ({ 
  children, 
  className = "",
  showNavbar = true,
  showFooter = true
}: PageContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <div className={`container mx-auto px-4 py-8 mt-16 flex-grow ${className}`}>
        {children}
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

export default PageContainer;
