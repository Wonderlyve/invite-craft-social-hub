
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuestList from "@/components/guests/GuestList";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ArrowLeft, Download, Mail } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

// Données factices pour la démo
const mockGuests = [
  {
    id: "1",
    fullName: "Jean Dupont",
    email: "jean.dupont@example.com",
    table: "Table 1",
    status: "confirmed" as const
  },
  {
    id: "2",
    fullName: "Marie Martin",
    email: "marie.martin@example.com",
    table: "Table 2",
    status: "pending" as const
  },
  {
    id: "3",
    fullName: "Pierre Bernard",
    email: "pierre.bernard@example.com",
    table: "Table 1",
    status: "declined" as const
  }
];

const GuestsPage = () => {
  const { eventId = "1" } = useParams<{ eventId: string }>();
  const [activeTab, setActiveTab] = useState("guests");
  
  const handleExportCSV = () => {
    toast.success("Liste d'invités exportée en CSV !");
  };
  
  const handleSendEmails = () => {
    toast.success("Emails d'invitation envoyés avec succès !");
  };
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center gap-2">
            <Link to="/events">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Gestion des invités</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <Button 
              onClick={handleExportCSV} 
              variant="outline"
            >
              <Download className="mr-2 h-4 w-4" /> Exporter
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
            <GuestList eventId={eventId} initialGuests={mockGuests} />
          </TabsContent>
          <TabsContent value="check-in" className="mt-6">
            <div className="bg-muted p-6 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Mode Check-in pour l'événement</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Cette page est dédiée à l'équipe sur place le jour de l'événement. Elle permet de vérifier les invités à leur arrivée.
              </p>
              <Button className="bg-invitation-purple hover:bg-invitation-purple-dark">
                Activer le mode check-in
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
      <Footer />
    </>
  );
};

export default GuestsPage;
