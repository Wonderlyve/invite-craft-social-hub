import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Search, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Guest, convertToGuests } from "@/types/guest";

interface CheckInModeProps {
  eventId: string;
}

const CheckInMode = ({ eventId }: CheckInModeProps) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [filteredGuests, setFilteredGuests] = useState<Guest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [activeMode, setActiveMode] = useState(false);
  
  useEffect(() => {
    if (activeMode) {
      fetchGuests();
    }
  }, [activeMode, eventId]);
  
  useEffect(() => {
    if (searchTerm.length > 0) {
      setFilteredGuests(
        guests.filter(guest => 
          guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredGuests(guests);
    }
  }, [searchTerm, guests]);
  
  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .order('full_name', { ascending: true });
      
      if (error) throw error;
      
      // Utiliser la fonction de conversion pour garantir le bon type
      const typedGuests = convertToGuests(data || []);
      setGuests(typedGuests);
      setFilteredGuests(typedGuests);
    } catch (error) {
      console.error("Erreur lors du chargement des invités:", error);
      toast.error("Erreur lors du chargement des invités");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCheckIn = async (guestId: string, currentStatus: boolean) => {
    setIsChecking(true);
    try {
      const { error } = await supabase
        .from('guests')
        .update({ checked_in: !currentStatus })
        .eq('id', guestId);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      setGuests(guests.map(g => g.id === guestId ? { ...g, checked_in: !currentStatus } : g));
      
      toast.success(`Invité ${!currentStatus ? 'enregistré' : 'désenregistré'}`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setIsChecking(false);
    }
  };
  
  if (!activeMode) {
    return (
      <div className="bg-muted p-6 rounded-lg text-center">
        <h3 className="text-xl font-semibold mb-4">Mode Check-in pour l'événement</h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Cette page est dédiée à l'équipe sur place le jour de l'événement. Elle permet de vérifier les invités à leur arrivée.
        </p>
        <Button 
          className="bg-invitation-purple hover:bg-invitation-purple-dark"
          onClick={() => setActiveMode(true)}
        >
          Activer le mode check-in
        </Button>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center my-12">
        <Loader2 className="h-8 w-8 animate-spin text-invitation-purple" />
        <span className="ml-2">Chargement des invités...</span>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {!activeMode ? (
        <div className="bg-muted p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold mb-4">Mode Check-in pour l'événement</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Cette page est dédiée à l'équipe sur place le jour de l'événement. Elle permet de vérifier les invités à leur arrivée.
          </p>
          <Button 
            className="bg-invitation-purple hover:bg-invitation-purple-dark"
            onClick={() => setActiveMode(true)}
          >
            Activer le mode check-in
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center my-12">
          <Loader2 className="h-8 w-8 animate-spin text-invitation-purple" />
          <span className="ml-2">Chargement des invités...</span>
        </div>
      ) : (
        <>
          <div className="bg-invitation-purple text-white p-4 rounded-lg flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Mode Check-in actif</h3>
              <p className="text-sm text-white/80">
                {guests.filter(g => g.checked_in).length} / {guests.length} invités présents
              </p>
            </div>
            <Button variant="secondary" onClick={() => setActiveMode(false)}>
              Désactiver
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un invité..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invité</TableHead>
                  <TableHead>Table</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Check-in</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      Aucun invité trouvé.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => (
                    <TableRow key={guest.id} className={guest.checked_in ? 'bg-green-50' : ''}>
                      <TableCell className="font-medium">{guest.full_name}</TableCell>
                      <TableCell>{guest.table_name || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          guest.status === 'confirmed' ? 'text-green-600 bg-green-100' :
                          guest.status === 'declined' ? 'text-red-600 bg-red-100' :
                          'text-yellow-600 bg-yellow-100'
                        }`}>
                          {guest.status === 'confirmed' ? 'Confirmé' : 
                           guest.status === 'declined' ? 'Refusé' : 
                           'En attente'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant={guest.checked_in ? "outline" : "default"}
                          onClick={() => handleCheckIn(guest.id, guest.checked_in)}
                          disabled={isChecking}
                          className={guest.checked_in ? "border-green-500 text-green-500" : "bg-invitation-purple hover:bg-invitation-purple-dark"}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          {guest.checked_in ? "Présent" : "Enregistrer"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
};

export default CheckInMode;
