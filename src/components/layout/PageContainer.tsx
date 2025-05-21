
import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomBar from "./BottomBar";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  showNavbar?: boolean;
  showFooter?: boolean;
  showBottomBar?: boolean;
}

const PageContainer = ({ 
  children, 
  className = "",
  showNavbar = true,
  showFooter = true,
  showBottomBar = true
}: PageContainerProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-background/95">
      {showNavbar && <Navbar />}
      <div className={`container mx-auto px-4 py-8 mt-16 flex-grow pb-16 md:pb-8 ${className}`}>
        {children}
      </div>
      {showBottomBar && <BottomBar />}
      {showFooter && <Footer />}
    </div>
  );
};

export default PageContainer;
