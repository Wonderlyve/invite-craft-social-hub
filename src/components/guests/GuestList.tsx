import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, X, Edit, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Guest, convertToGuests } from "@/types/guest";

interface Guest {
  id: string;
  full_name: string;
  email: string | null;
  table_name: string | null;
  status: 'pending' | 'confirmed' | 'declined';
  checked_in: boolean;
}

interface GuestListProps {
  eventId: string;
}

const GuestList = ({ eventId }: GuestListProps) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
    full_name: '',
    email: '',
    table_name: '',
    status: 'pending'
  });
  
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Charger les invités
  useEffect(() => {
    const fetchGuests = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('guests')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Convertir les données en objets Guest correctement typés
        setGuests(convertToGuests(data || []));
      } catch (error) {
        console.error("Erreur lors du chargement des invités:", error);
        toast.error("Erreur lors du chargement des invités");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGuests();
  }, [eventId]);
  
  const handleAddGuest = async () => {
    if (!newGuest.full_name) {
      toast.error("Le nom est requis");
      return;
    }
    
    setIsAdding(true);
    
    try {
      const { data, error } = await supabase
        .from('guests')
        .insert({
          event_id: eventId,
          full_name: newGuest.full_name,
          email: newGuest.email || null,
          table_name: newGuest.table_name || null,
          status: 'pending'
        })
        .select();
      
      if (error) throw error;
      
      setGuests([...guests, data[0]]);
      setNewGuest({
        full_name: '',
        email: '',
        table_name: '',
        status: 'pending'
      });
      
      toast.success("Invité ajouté avec succès");
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'invité:", error);
      toast.error("Erreur lors de l'ajout de l'invité");
    } finally {
      setIsAdding(false);
    }
  };
  
  const openEditDialog = (guest: Guest) => {
    setEditGuest(guest);
    setIsDialogOpen(true);
  };
  
  const handleUpdateGuest = async (updatedGuest: Guest) => {
    if (!editGuest) return;
    
    try {
      const { error } = await supabase
        .from('guests')
        .update({
          full_name: updatedGuest.full_name,
          email: updatedGuest.email,
          table_name: updatedGuest.table_name,
        })
        .eq('id', updatedGuest.id);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      setGuests(guests.map(g => g.id === updatedGuest.id ? updatedGuest : g));
      setIsDialogOpen(false);
      toast.success("Invité mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'invité:", error);
      toast.error("Erreur lors de la mise à jour de l'invité");
    }
  };
  
  const updateGuestStatus = async (guestId: string, status: 'confirmed' | 'declined') => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ status })
        .eq('id', guestId);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      setGuests(guests.map(g => g.id === guestId ? { ...g, status } : g));
      
      toast.success(`Statut de l'invité mis à jour: ${status === 'confirmed' ? 'Confirmé' : 'Refusé'}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };
  
  const deleteGuest = async (guestId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet invité ?")) return;
    
    try {
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', guestId);
      
      if (error) throw error;
      
      // Mettre à jour l'état local
      setGuests(guests.filter(g => g.id !== guestId));
      
      toast.success("Invité supprimé avec succès");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'invité:", error);
      toast.error("Erreur lors de la suppression de l'invité");
    }
  };
  
  const getStatusColor = (status: Guest['status']) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'declined':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };
  
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
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted rounded-md">
        <Input
          placeholder="Nom complet"
          value={newGuest.full_name}
          onChange={(e) => setNewGuest({ ...newGuest, full_name: e.target.value })}
          className="flex-1"
        />
        <Input
          placeholder="Email"
          type="email"
          value={newGuest.email || ''}
          onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
          className="flex-1"
        />
        <Input
          placeholder="Table (optionnel)"
          value={newGuest.table_name || ''}
          onChange={(e) => setNewGuest({ ...newGuest, table_name: e.target.value })}
          className="sm:w-40"
        />
        <Button 
          onClick={handleAddGuest} 
          className="bg-invitation-purple hover:bg-invitation-purple-dark"
          disabled={isAdding}
        >
          {isAdding ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Ajouter
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invité</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {guests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  Aucun invité ajouté pour cet événement.
                </TableCell>
              </TableRow>
            ) : (
              guests.map((guest) => (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">{guest.full_name}</TableCell>
                  <TableCell>{guest.email || '-'}</TableCell>
                  <TableCell>{guest.table_name || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(guest.status)}`}>
                      {guest.status === 'pending' ? 'En attente' : 
                       guest.status === 'confirmed' ? 'Confirmé' : 'Refusé'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateGuestStatus(guest.id, 'confirmed')}
                      >
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => updateGuestStatus(guest.id, 'declined')}
                      >
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => openEditDialog(guest)}
                      >
                        <Edit className="h-4 w-4 text-blue-600" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => deleteGuest(guest.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Dialog pour éditer un invité */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'invité</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'invité ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nom complet</label>
              <Input
                value={editGuest?.full_name || ''}
                onChange={(e) => setEditGuest(editGuest ? { ...editGuest, full_name: e.target.value } : null)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={editGuest?.email || ''}
                onChange={(e) => setEditGuest(editGuest ? { ...editGuest, email: e.target.value } : null)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Table</label>
              <Input
                value={editGuest?.table_name || ''}
                onChange={(e) => setEditGuest(editGuest ? { ...editGuest, table_name: e.target.value } : null)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button 
              className="bg-invitation-purple hover:bg-invitation-purple-dark"
              onClick={handleUpdateGuest}
            >
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GuestList;
