
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus, X } from "lucide-react";

interface Guest {
  id: string;
  fullName: string;
  email: string;
  table?: string;
  status: 'pending' | 'confirmed' | 'declined';
}

interface GuestListProps {
  eventId: string;
  initialGuests?: Guest[];
}

const GuestList = ({ eventId, initialGuests = [] }: GuestListProps) => {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [newGuest, setNewGuest] = useState<Partial<Guest>>({
    fullName: '',
    email: '',
    table: '',
    status: 'pending'
  });
  
  const handleAddGuest = () => {
    if (!newGuest.fullName || !newGuest.email) return;
    
    const guest: Guest = {
      id: `guest-${Date.now()}`,
      fullName: newGuest.fullName,
      email: newGuest.email,
      table: newGuest.table,
      status: 'pending'
    };
    
    setGuests([...guests, guest]);
    setNewGuest({
      fullName: '',
      email: '',
      table: '',
      status: 'pending'
    });
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
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted rounded-md">
        <Input
          placeholder="Nom complet"
          value={newGuest.fullName}
          onChange={(e) => setNewGuest({ ...newGuest, fullName: e.target.value })}
          className="flex-1"
        />
        <Input
          placeholder="Email"
          type="email"
          value={newGuest.email}
          onChange={(e) => setNewGuest({ ...newGuest, email: e.target.value })}
          className="flex-1"
        />
        <Input
          placeholder="Table (optionnel)"
          value={newGuest.table}
          onChange={(e) => setNewGuest({ ...newGuest, table: e.target.value })}
          className="sm:w-40"
        />
        <Button onClick={handleAddGuest} className="bg-invitation-purple hover:bg-invitation-purple-dark">
          <Plus className="mr-2 h-4 w-4" /> Ajouter
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
                  <TableCell className="font-medium">{guest.fullName}</TableCell>
                  <TableCell>{guest.email}</TableCell>
                  <TableCell>{guest.table || '-'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(guest.status)}`}>
                      {guest.status === 'pending' ? 'En attente' : 
                       guest.status === 'confirmed' ? 'Confirmé' : 'Refusé'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Check className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <X className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default GuestList;
