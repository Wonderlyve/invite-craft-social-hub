
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TemplateCardProps {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  onClick: (id: string) => void;
}

const TemplateCard = ({ id, title, imageUrl, category, onClick }: TemplateCardProps) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-[3/4] w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-base">{title}</h3>
          <span className="text-xs px-2 py-1 bg-invitation-purple/10 text-invitation-purple rounded-full">
            {category}
          </span>
        </div>
      </CardHeader>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onClick(id)} 
          className="w-full bg-invitation-purple hover:bg-invitation-purple-dark"
        >
          Utiliser ce modèle
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
