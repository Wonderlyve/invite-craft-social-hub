
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";

const CreateEventPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState<Date>();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const createEvent = useMutation({
    mutationFn: async () => {
      if (!title || !type || !date) {
        throw new Error("Veuillez remplir tous les champs obligatoires");
      }

      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            title,
            type,
            date: date.toISOString(),
            location,
            description
          }
        ])
        .select();

      if (error) throw error;
      return data[0];
    },
    onSuccess: (data) => {
      toast.success("Événement créé avec succès !");
      navigate(`/events`);
    },
    onError: (error: any) => {
      toast.error(error.message || "Une erreur est survenue lors de la création de l'événement");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEvent.mutate();
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex items-center gap-2 mb-6">
          <Link to="/events">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Créer un nouvel événement</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          <div className="space-y-2">
            <Label htmlFor="title">Nom de l'événement *</Label>
            <Input 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Mariage de Sophie et Thomas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type d'événement *</Label>
            <Select required value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mariage">Mariage</SelectItem>
                <SelectItem value="Anniversaire">Anniversaire</SelectItem>
                <SelectItem value="Conférence">Conférence</SelectItem>
                <SelectItem value="Baptême">Baptême</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date de l'événement *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: fr }) : "Sélectionner une date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input 
              id="location" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              placeholder="123 Rue des Fleurs, 75001 Paris"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Ajoutez des détails sur votre événement..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate("/events")}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-invitation-purple hover:bg-invitation-purple-dark"
              disabled={createEvent.isPending}
            >
              {createEvent.isPending ? "Création en cours..." : "Créer l'événement"}
            </Button>
          </div>
        </form>
      </PageContainer>
      <Footer />
    </>
  );
};

export default CreateEventPage;
