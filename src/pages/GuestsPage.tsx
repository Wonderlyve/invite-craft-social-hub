
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestList from "@/components/guests/GuestList";
import CheckInMode from "@/components/guests/CheckInMode";
import PageContainer from "@/components/layout/PageContainer";
import { ArrowLeft, Download, Mail, Share } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const GuestsPage = () => {
  const { eventId = "" } = useParams<{ eventId: string }>();
  const [activeTab, setActiveTab] = useState("guests");
  
  const { data: event } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!eventId
  });
  
  const handleExportCSV = () => {
    // Logique pour exporter en CSV
    toast.success("Liste d'invités exportée en CSV !");
  };
  
  const handleSendEmails = async () => {
    try {
      // Obtenez tous les invités avec une adresse e-mail
      const { data: guests, error } = await supabase
        .from('guests')
        .select('*')
        .eq('event_id', eventId)
        .not('email', 'is', null);
      
      if (error) throw error;
      
      if (!guests || guests.length === 0) {
        toast.error("Aucun invité avec une adresse e-mail");
        return;
      }
      
      // Ici, vous pourriez envoyer un appel à une fonction Edge pour envoyer les e-mails
      // Pour l'instant, on simule l'envoi d'emails
      toast.success(`Emails d'invitation envoyés à ${guests.length} invités`);
    } catch (error) {
      console.error("Erreur lors de l'envoi des emails:", error);
      toast.error("Erreur lors de l'envoi des emails");
    }
  };
  
  const handleShareLink = () => {
    // Générer et copier un lien de partage
    const shareUrl = `${window.location.origin}/invitation/${eventId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Lien de partage copié dans le presse-papiers!");
  };
  
  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/events">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Gestion des invités</h1>
            {event && <p className="text-muted-foreground">{event.title}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button 
            onClick={handleExportCSV} 
            variant="outline"
          >
            <Download className="mr-2 h-4 w-4" /> Exporter
          </Button>
          <Button 
            onClick={handleShareLink}
            variant="outline"
          >
            <Share className="mr-2 h-4 w-4" /> Copier lien
          </Button>
          <Button 
            onClick={handleSendEmails}
            className="bg-invitation-purple hover:bg-invitation-purple-dark"
          >
            <Mail className="mr-2 h-4 w-4" /> Envoyer les invitations
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="guests" value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="guests">Liste d'invités</TabsTrigger>
          <TabsTrigger value="check-in">Check-in</TabsTrigger>
        </TabsList>
        <TabsContent value="guests" className="mt-6">
          <GuestList eventId={eventId} />
        </TabsContent>
        <TabsContent value="check-in" className="mt-6">
          <CheckInMode eventId={eventId} />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default GuestsPage;
