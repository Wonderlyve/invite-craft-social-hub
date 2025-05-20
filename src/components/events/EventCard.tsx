
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface EventCardProps {
  id: string;
  title: string;
  type: string;
  date: string;
  guestCount: number;
  imageUrl: string;
}

const EventCard = ({ id, title, type, date, guestCount, imageUrl }: EventCardProps) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="aspect-video w-full overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{type}</CardDescription>
          </div>
          <span className="text-xs px-2 py-1 bg-invitation-purple/10 text-invitation-purple rounded-full">
            {type}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <UserIcon className="w-4 h-4" />
            <span>{guestCount} invités</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to={`/events/${id}/edit`}>
          <Button variant="outline" size="sm">
            Modifier
          </Button>
        </Link>
        <Link to={`/events/${id}/guests`}>
          <Button variant="outline" size="sm">
            Invités
          </Button>
        </Link>
        <Link to={`/events/${id}/preview`}>
          <Button size="sm" className="bg-invitation-purple hover:bg-invitation-purple-dark">
            Aperçu
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
