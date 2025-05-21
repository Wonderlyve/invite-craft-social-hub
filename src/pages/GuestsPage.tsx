import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import PageContainer from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface GuestPageProps {
  id: string;
  name: string;
  email: string;
  phone: string;
  is_attending: boolean;
  has_rsvped: boolean;
}

const GuestsPage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [guests, setGuests] = useState<GuestPageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [checkInMode, setCheckInMode] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestEmail, setNewGuestEmail] = useState("");
  const [newGuestPhone, setNewGuestPhone] = useState("");

  // Ajouter un état pour stocker l'invité sélectionné pour le check-in
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  const { data: guestsData, refetch } = useQuery({
    queryKey: ['guests', eventId],
    queryFn: async () => {
      if (!eventId) return [];

      const { data, error } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Erreur lors du chargement des invités");
        console.error("Erreur lors du chargement des invités:", error);
        return [];
      }

      return data;
    },
    enabled: !!eventId,
  });

  useEffect(() => {
    if (guestsData) {
      setGuests(guestsData);
    }
  }, [guestsData]);

  const handleUpdateGuest = async (guestId: string, updatedFields: Partial<GuestPageProps>) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('guests')
        .update(updatedFields)
        .eq('id', guestId);

      if (error) throw error;

      // Mettre à jour l'état local
      setGuests(prevGuests =>
        prevGuests.map(guest =>
          guest.id === guestId ? { ...guest, ...updatedFields } : guest
        )
      );

      toast.success("Informations de l'invité mises à jour");
      refetch(); // Refresh data
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'invité:", error);
      toast.error("Erreur lors de la mise à jour de l'invité");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCheckInClick = (guest: any) => {
    setSelectedGuest(guest);
    setCheckInMode(true);
  };

  const handleAddGuest = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un invité");
      return;
    }

    if (!eventId) {
      toast.error("ID d'événement manquant");
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('guests')
        .insert({
          event_id: eventId,
          name: newGuestName,
          email: newGuestEmail,
          phone: newGuestPhone,
        });

      if (error) throw error;

      setNewGuestName("");
      setNewGuestEmail("");
      setNewGuestPhone("");

      toast.success("Invité ajouté avec succès");
      refetch(); // Refresh data
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'invité:", error);
      toast.error("Erreur lors de l'ajout de l'invité");
    } finally {
      setIsSaving(false);
    }
  };

  const CheckInMode = ({ guest, eventId, onClose, onGuestUpdate }: { guest: any, eventId: string, onClose: () => void, onGuestUpdate: (guestId: string, updatedFields: any) => void }) => {
    const [isAttending, setIsAttending] = useState(guest.is_attending || false);

    const handleCheckIn = async () => {
      setIsSaving(true);
      try {
        await onGuestUpdate(guest.id, { is_attending: isAttending });
        toast.success(`${guest.name} a été ${isAttending ? 'enregistré' : 'désenregistré'}`);
        onClose();
      } catch (error) {
        console.error("Erreur lors de l'enregistrement de l'invité:", error);
        toast.error("Erreur lors de l'enregistrement de l'invité");
      } finally {
        setIsSaving(false);
      }
    };

    return (
      <Dialog open={checkInMode} onOpenChange={setCheckInMode}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Check-in de {guest.name}</DialogTitle>
            <DialogDescription>
              Marquez l'invité comme présent à l'événement.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom
              </Label>
              <Input id="name" value={guest.name} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input id="email" value={guest.email || 'N/A'} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Téléphone
              </Label>
              <Input id="phone" value={guest.phone || 'N/A'} className="col-span-3" disabled />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="is_attending" className="text-right">
                Présent
              </Label>
              <Checkbox
                id="is_attending"
                checked={isAttending}
                onCheckedChange={(checked) => setIsAttending(!!checked)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" onClick={handleCheckIn} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enregistrer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageContainer className="max-w-5xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Gestion des invités</h1>
          <p className="text-gray-500">Ajoutez, modifiez ou enregistrez les invités pour votre événement.</p>
        </div>

        {/* Formulaire d'ajout d'invité */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Ajouter un invité</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                type="text"
                id="name"
                placeholder="Nom de l'invité"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                placeholder="Email de l'invité"
                value={newGuestEmail}
                onChange={(e) => setNewGuestEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                type="tel"
                id="phone"
                placeholder="Téléphone de l'invité"
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
              />
            </div>
          </div>
          <Button className="mt-4 bg-invitation-purple hover:bg-invitation-purple-dark" onClick={handleAddGuest} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Ajouter un invité
          </Button>
        </div>

        {/* Liste des invités */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Liste des invités</h2>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-left">Nom</TableHead>
                    <TableHead className="text-left">Email</TableHead>
                    <TableHead className="text-left">Téléphone</TableHead>
                    <TableHead className="text-center">Présence</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {guests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell>{guest.name}</TableCell>
                      <TableCell>{guest.email || 'N/A'}</TableCell>
                      <TableCell>{guest.phone || 'N/A'}</TableCell>
                      <TableCell className="text-center">
                        {guest.is_attending ? '✅' : '❌'}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button size="sm" onClick={() => handleCheckInClick(guest)}>
                          Check-in
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Mode check-in */}
        {checkInMode && selectedGuest && (
        <CheckInMode 
          guest={selectedGuest} 
          eventId={eventId || ''} 
          onClose={() => setCheckInMode(false)} 
          onGuestUpdate={handleUpdateGuest}
        />
      )}
      </PageContainer>
    </div>
  );
};

export default GuestsPage;
