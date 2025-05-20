
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import PageContainer from "@/components/layout/PageContainer";
import { Save, ArrowLeft, Eye, Share, Loader2 } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import KonvaCanvas from "@/components/editor/KonvaCanvas";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const EditorPage = () => {
  const [activeTab, setActiveTab] = useState("editor");
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("template");
  const eventId = searchParams.get("event");
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [template, setTemplate] = useState<any>(null);
  const [canvasData, setCanvasData] = useState<any>(null);
  const [invitationId, setInvitationId] = useState<string | null>(null);
  
  // Charger les données du template ou de l'invitation existante
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Si nous avons un ID d'événement, essayons d'abord de charger l'invitation existante
        if (eventId) {
          const { data: invitationData, error: invitationError } = await supabase
            .from('invitations')
            .select('*')
            .eq('event_id', eventId)
            .single();
          
          if (!invitationError && invitationData) {
            setInvitationId(invitationData.id);
            setCanvasData(invitationData.canvas_data);
            
            // Charger aussi les données du template pour référence
            const { data: templateData } = await supabase
              .from('templates')
              .select('*')
              .eq('id', invitationData.template_id)
              .single();
            
            setTemplate(templateData);
            return;
          }
        }
        
        // Si pas d'invitation ou si juste templateId, charger le template
        if (templateId) {
          const { data, error } = await supabase
            .from('templates')
            .select('*')
            .eq('id', templateId)
            .single();
          
          if (error) throw error;
          setTemplate(data);
          setCanvasData(data.canvas_data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        toast.error("Erreur lors du chargement du modèle");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [templateId, eventId]);
  
  const handleSave = async (canvasData: any) => {
    if (!user) {
      toast.error("Vous devez être connecté pour sauvegarder");
      return;
    }
    
    if (!eventId) {
      toast.error("Veuillez d'abord créer un événement");
      navigate("/events/create");
      return;
    }
    
    setIsSaving(true);
    
    try {
      if (invitationId) {
        // Mettre à jour l'invitation existante
        const { error } = await supabase
          .from('invitations')
          .update({ 
            canvas_data: canvasData,
            updated_at: new Date().toISOString()
          })
          .eq('id', invitationId);
        
        if (error) throw error;
        toast.success("Invitation mise à jour avec succès");
      } else {
        // Créer une nouvelle invitation
        const { error } = await supabase
          .from('invitations')
          .insert({ 
            event_id: eventId,
            template_id: templateId,
            canvas_data: canvasData
          });
        
        if (error) throw error;
        toast.success("Invitation sauvegardée avec succès");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Erreur lors de la sauvegarde de l'invitation");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleShare = async () => {
    if (!eventId) {
      toast.error("Aucun événement associé à cette invitation");
      return;
    }
    
    toast.success("Lien de partage copié dans le presse-papiers!");
    navigator.clipboard.writeText(`${window.location.origin}/invitation/${eventId}`);
  };
  
  if (isLoading) {
    return (
      <PageContainer className="max-w-6xl">
        <div className="flex justify-center items-center h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin text-invitation-purple" />
          <span className="ml-2 text-lg">Chargement de l'éditeur...</span>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer className="max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-2">
          <Link to="/events">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Éditeur d'invitation</h1>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <Button 
            onClick={() => {
              if (canvasData) handleSave(canvasData);
            }} 
            variant="outline"
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Sauvegarder
          </Button>
          <Button 
            className="bg-invitation-purple hover:bg-invitation-purple-dark"
            onClick={handleShare}
          >
            <Share className="mr-2 h-4 w-4" /> Partager
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="editor">Éditeur</TabsTrigger>
          <TabsTrigger value="preview">Aperçu</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="lg:col-span-3 p-6">
              {template && (
                <KonvaCanvas 
                  width={600} 
                  height={800} 
                  initialData={canvasData}
                  onSave={setCanvasData}
                />
              )}
            </Card>
            <div className="space-y-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Paramètres de l'invitation</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Type d'événement</label>
                    <p className="mt-1 px-3 py-2 border rounded-md bg-muted/30">
                      {template?.category || "Non défini"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Format</label>
                    <p className="mt-1 px-3 py-2 border rounded-md bg-muted/30">
                      Portrait (600x800)
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Champs dynamiques</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    const textValue = "{nom}";
                    navigator.clipboard.writeText(textValue);
                    toast.info("Copié : " + textValue);
                  }}>
                    {"{nom}"}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    const textValue = "{table}";
                    navigator.clipboard.writeText(textValue);
                    toast.info("Copié : " + textValue);
                  }}>
                    {"{table}"}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    const textValue = "{date}";
                    navigator.clipboard.writeText(textValue);
                    toast.info("Copié : " + textValue);
                  }}>
                    {"{date}"}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => {
                    const textValue = "{lieu}";
                    navigator.clipboard.writeText(textValue);
                    toast.info("Copié : " + textValue);
                  }}>
                    {"{lieu}"}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <div className="flex flex-col items-center">
            <div className="mb-6 text-center max-w-md">
              <h3 className="text-xl font-semibold mb-2">Aperçu de l'invitation</h3>
              <p className="text-muted-foreground">
                Voici comment votre invitation sera présentée à vos invités.
              </p>
            </div>
            <div className="border border-border rounded-md p-8 bg-white shadow-md">
              {canvasData ? (
                <div className="w-[600px] h-[800px]">
                  <KonvaCanvas 
                    width={600} 
                    height={800} 
                    initialData={canvasData}
                    onSave={setCanvasData}
                  />
                </div>
              ) : (
                <img 
                  src="/placeholder.svg" 
                  alt="Aperçu de l'invitation" 
                  className="w-[600px] h-[800px] object-contain"
                />
              )}
            </div>
            <div className="mt-8 flex gap-4">
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" /> Prévisualiser par invité
              </Button>
              <Button className="bg-invitation-purple hover:bg-invitation-purple-dark" onClick={handleShare}>
                <Share className="mr-2 h-4 w-4" /> Partager les invitations
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default EditorPage;
