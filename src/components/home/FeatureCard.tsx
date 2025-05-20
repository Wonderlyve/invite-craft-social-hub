
import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="bg-background border border-border rounded-lg p-6 shadow-sm card-hover">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-invitation-purple/10 text-invitation-purple mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
