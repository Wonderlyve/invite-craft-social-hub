import { useEffect, useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { convertToGuest, convertToGuests, Guest } from "@/types/guest";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Mail, 
  Trash2, 
  Check, 
  X, 
  UserPlus, 
  Download, 
  Upload 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

interface GuestListProps {
  eventId: string;
}

const GuestList = ({ eventId }: GuestListProps) => {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [newGuest, setNewGuest] = useState({ full_name: "", email: "" });
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGuests();
  }, [eventId]);

  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("guests")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGuests(convertToGuests(data || []));
    } catch (error) {
      console.error("Error fetching guests:", error);
      toast.error("Impossible de charger la liste des invités");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGuest = async () => {
    if (!newGuest.full_name.trim()) {
      toast.error("Le nom de l'invité est requis");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("guests")
        .insert({
          full_name: newGuest.full_name.trim(),
          email: newGuest.email.trim() || null,
          event_id: eventId,
          status: "pending",
          checked_in: false,
          share_token: crypto.randomUUID(),
        })
        .select();

      if (error) throw error;

      setGuests([convertToGuest(data[0]), ...guests]);
      setNewGuest({ full_name: "", email: "" });
      setIsAddGuestOpen(false);
      toast.success("Invité ajouté avec succès");
    } catch (error) {
      console.error("Error adding guest:", error);
      toast.error("Erreur lors de l'ajout de l'invité");
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet invité ?")) return;

    try {
      const { error } = await supabase
        .from("guests")
        .delete()
        .eq("id", guestId);

      if (error) throw error;

      setGuests(guests.filter((guest) => guest.id !== guestId));
      toast.success("Invité supprimé avec succès");
    } catch (error) {
      console.error("Error deleting guest:", error);
      toast.error("Erreur lors de la suppression de l'invité");
    }
  };

  const handleUpdateStatus = async (guestId: string, status: 'confirmed' | 'declined' | 'pending') => {
    try {
      const { error } = await supabase
        .from("guests")
        .update({ status })
        .eq("id", guestId);

      if (error) throw error;

      setGuests(
        guests.map((guest) =>
          guest.id === guestId ? { ...guest, status } : guest
        )
      );
      toast.success(`Statut mis à jour: ${status}`);
    } catch (error) {
      console.error("Error updating guest status:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const handleSendInvitation = async (guestId: string) => {
    toast.success("Invitation envoyée (fonctionnalité simulée)");
  };

  const handleToggleSelectGuest = (guestId: string) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((id) => id !== guestId)
        : [...prev, guestId]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectAll) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(filteredGuests.map((guest) => guest.id));
    }
    setSelectAll(!selectAll);
  };

  const handleDeleteSelected = async () => {
    if (!selectedGuests.length) return;
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${selectedGuests.length} invités ?`)) return;

    try {
      const { error } = await supabase
        .from("guests")
        .delete()
        .in("id", selectedGuests);

      if (error) throw error;

      setGuests(guests.filter((guest) => !selectedGuests.includes(guest.id)));
      setSelectedGuests([]);
      setSelectAll(false);
      toast.success(`${selectedGuests.length} invités supprimés avec succès`);
    } catch (error) {
      console.error("Error deleting guests:", error);
      toast.error("Erreur lors de la suppression des invités");
    }
  };

  const handleImportGuests = () => {
    if (!importText.trim()) {
      toast.error("Veuillez entrer des données à importer");
      return;
    }

    try {
      const lines = importText.trim().split("\n");
      const newGuests = lines.map((line) => {
        const [full_name, email = ""] = line.split(",").map((s) => s.trim());
        return {
          full_name,
          email: email || null,
          event_id: eventId,
          status: "pending" as const,
          checked_in: false,
          share_token: crypto.randomUUID(),
        };
      });

      if (newGuests.some((g) => !g.full_name)) {
        toast.error("Certaines lignes n'ont pas de nom d'invité");
        return;
      }

      // Simuler l'ajout (dans une application réelle, nous ferions un appel API ici)
      toast.success(`${newGuests.length} invités importés avec succès`);
      setIsImportDialogOpen(false);
      setImportText("");
      fetchGuests(); // Recharger la liste
    } catch (error) {
      console.error("Error importing guests:", error);
      toast.error("Erreur lors de l'importation des invités");
    }
  };

  const handleExportGuests = () => {
    const csvContent = guests.map((guest) => 
      `${guest.full_name},${guest.email || ""},${guest.status},${guest.table_name || ""}`
    ).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invites-${format(new Date(), "yyyy-MM-dd")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Liste des invités exportée avec succès");
  };

  const filteredGuests = guests.filter((guest) =>
    guest.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500">Confirmé</Badge>;
      case "declined":
        return <Badge className="bg-red-500">Refusé</Badge>;
      default:
        return <Badge className="bg-yellow-500">En attente</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle>Liste des invités</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
            <DialogTrigger asChild>
              <Button className="bg-invitation-purple hover:bg-invitation-purple-dark">
                <UserPlus className="mr-2 h-4 w-4" /> Ajouter un invité
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouvel invité</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    placeholder="Nom et prénom"
                    value={newGuest.full_name}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, full_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email (optionnel)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@exemple.com"
                    value={newGuest.email}
                    onChange={(e) =>
                      setNewGuest({ ...newGuest, email: e.target.value })
                    }
                  />
                </div>
                <Button
                  className="w-full bg-invitation-purple hover:bg-invitation-purple-dark"
                  onClick={handleAddGuest}
                >
                  Ajouter
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" /> Importer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Importer des invités</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="csv">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="csv">Format CSV</TabsTrigger>
                  <TabsTrigger value="manual">Saisie manuelle</TabsTrigger>
                </TabsList>
                <TabsContent value="csv" className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Téléchargez un fichier CSV avec les colonnes: Nom, Email
                  </p>
                  <Button className="w-full" variant="outline">
                    Sélectionner un fichier CSV
                  </Button>
                </TabsContent>
                <TabsContent value="manual" className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Entrez un nom par ligne, avec éventuellement un email séparé par une virgule
                  </p>
                  <textarea
                    className="w-full h-40 p-2 border rounded-md"
                    placeholder="Jean Dupont, jean@exemple.com&#10;Marie Martin"
                    value={importText}
                    onChange={(e) => setImportText(e.target.value)}
                  ></textarea>
                  <Button
                    className="w-full mt-4 bg-invitation-purple"
                    onClick={handleImportGuests}
                  >
                    Importer
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={handleExportGuests}>
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Rechercher un invité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {selectedGuests.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteSelected}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer ({selectedGuests.length})
              </Button>
            )}
          </div>

          <div className="border rounded-md">
            <ScrollArea className="h-[500px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleToggleSelectAll}
                      />
                    </TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Table</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        Chargement des invités...
                      </TableCell>
                    </TableRow>
                  ) : filteredGuests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10">
                        {searchTerm
                          ? "Aucun invité ne correspond à votre recherche"
                          : "Aucun invité pour cet événement"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredGuests.map((guest) => (
                      <TableRow key={guest.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedGuests.includes(guest.id)}
                            onCheckedChange={() =>
                              handleToggleSelectGuest(guest.id)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {guest.full_name}
                          {guest.checked_in && (
                            <Badge className="ml-2 bg-blue-500">Présent</Badge>
                          )}
                        </TableCell>
                        <TableCell>{guest.email || "-"}</TableCell>
                        <TableCell>{getStatusBadge(guest.status)}</TableCell>
                        <TableCell>{guest.table_name || "-"}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleSendInvitation(guest.id)}
                              >
                                <Mail className="mr-2 h-4 w-4" />
                                Envoyer l'invitation
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(guest.id, "confirmed")
                                }
                              >
                                <Check className="mr-2 h-4 w-4" />
                                Marquer comme confirmé
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(guest.id, "declined")
                                }
                              >
                                <X className="mr-2 h-4 w-4" />
                                Marquer comme refusé
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateStatus(guest.id, "pending")
                                }
                              >
                                <X className="mr-2 h-4 w-4" />
                                Marquer comme en attente
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteGuest(guest.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuestList;
