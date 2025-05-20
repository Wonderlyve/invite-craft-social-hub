
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EventCard from "@/components/events/EventCard";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Plus, Search, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface Event {
  id: string;
  title: string;
  type: string;
  date: string;
  location: string;
  description: string;
  guestCount: number;
  imageUrl: string;
}

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("");
  
  const { data: events = [], isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*, guests:guests(count)');
      
      if (error) {
        toast.error("Erreur lors du chargement des événements");
        throw error;
      }
      
      return data.map((event: any) => ({
        id: event.id,
        title: event.title,
        type: event.type,
        date: new Date(event.date).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        location: event.location,
        description: event.description,
        guestCount: event.guests[0]?.count || 0,
        imageUrl: "/placeholder.svg"
      }));
    }
  });
  
  const filteredEvents = events.filter((event: Event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? event.type === filterType : true;
    return matchesSearch && matchesType;
  });

  if (error) {
    console.error("Erreur lors du chargement des événements:", error);
  }
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Mes Événements</h1>
            <p className="text-muted-foreground">
              Gérez tous vos événements et invitations en un seul endroit.
            </p>
          </div>
          <Link to="/events/create">
            <Button className="mt-4 md:mt-0 bg-invitation-purple hover:bg-invitation-purple-dark">
              <Plus className="mr-2 h-4 w-4" /> Nouvel événement
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un événement..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Type d'événement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="Mariage">Mariage</SelectItem>
              <SelectItem value="Anniversaire">Anniversaire</SelectItem>
              <SelectItem value="Conférence">Conférence</SelectItem>
              <SelectItem value="Baptême">Baptême</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-invitation-purple"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Aucun événement trouvé</h2>
            <p className="text-muted-foreground mb-6">
              {searchTerm || filterType ? 
                "Aucun événement ne correspond à votre recherche." : 
                "Vous n'avez pas encore créé d'événement."}
            </p>
            <Link to="/events/create">
              <Button className="bg-invitation-purple hover:bg-invitation-purple-dark">
                <Plus className="mr-2 h-4 w-4" /> Créer un événement
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event: Event) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </PageContainer>
      <Footer />
    </>
  );
};

export default EventsPage;
