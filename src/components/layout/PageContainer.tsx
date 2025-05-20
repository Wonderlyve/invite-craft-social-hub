
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

const PageContainer = ({ children, className = "" }: PageContainerProps) => {
  return (
    <div className={`container mx-auto px-4 py-8 mt-16 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
