import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageContainer from "@/components/layout/PageContainer";
import { Loader2 } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { EditorProvider } from "@/components/editor/EditorContext";
import Header from "@/components/editor/EditorPage/Header";
import EditorTab from "@/components/editor/EditorPage/EditorTab";
import PreviewTab from "@/components/editor/EditorPage/PreviewTab";
import useScrollToTop from "@/hooks/useScrollToTop";

const EditorPage = () => {
  useScrollToTop();
  
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
  
  const handleSave = async () => {
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
        const { data, error } = await supabase
          .from('invitations')
          .insert({ 
            event_id: eventId,
            template_id: templateId,
            canvas_data: canvasData
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          setInvitationId(data[0].id);
        }
        
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
  
  const addText = () => {
    if (!canvasData) return;
    
    const centerX = 540; // 1080 / 2
    const centerY = 900; // 1800 / 2
    
    const updatedData = {
      ...canvasData,
      objects: [
        ...(canvasData.objects || []),
        {
          id: `text-${Date.now()}`,
          type: 'text',
          x: centerX - 80,
          y: centerY - 10,
          text: 'Votre texte ici',
          fontSize: 18,
          fontFamily: 'Arial',
          fill: '#333333',
          draggable: true,
          width: 160,
        }
      ]
    };
    
    setCanvasData(updatedData);
  };
  
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !canvasData) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) return;
      
      const img = new window.Image();
      img.src = event.target.result.toString();
      
      img.onload = () => {
        const centerX = 540; // 1080 / 2
        const centerY = 900; // 1800 / 2
        
        const aspectRatio = img.width / img.height;
        const newWidth = 150;
        const newHeight = newWidth / aspectRatio;
        
        const updatedData = {
          ...canvasData,
          objects: [
            ...(canvasData.objects || []),
            {
              id: `image-${Date.now()}`,
              type: 'image',
              x: centerX - newWidth / 2,
              y: centerY - newHeight / 2,
              width: newWidth,
              height: newHeight,
              src: event.target?.result.toString(),
              draggable: true,
            }
          ]
        };
        
        setCanvasData(updatedData);
      };
    };
    
    reader.readAsDataURL(file);
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
    <EditorProvider>
      <PageContainer className="max-w-full px-0 sm:px-4 h-screen flex flex-col">
        {/* Header fixe */}
        <div className="flex-shrink-0">
          <Header 
            isSaving={isSaving} 
            handleSave={() => {
              if (canvasData) handleSave();
            }} 
            handleShare={handleShare}
          />
        </div>
        
        {/* Contenu principal */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab as any} className="h-full flex flex-col">
            <div className="flex-shrink-0 px-4 sm:px-0 mb-2">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="editor">Éditeur</TabsTrigger>
                <TabsTrigger value="preview">Aperçu</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <TabsContent value="editor" className="h-full">
                <EditorTab
                  canvasData={canvasData}
                  onSaveCanvas={setCanvasData}
                  onTextAdd={addText}
                  onImageUpload={uploadImage}
                  handleSave={() => {
                    if (canvasData) handleSave();
                  }}
                />
              </TabsContent>
              <TabsContent value="preview" className="h-full px-2 sm:px-0">
                <PreviewTab
                  canvasData={canvasData}
                  onSaveCanvas={setCanvasData}
                  handleShare={handleShare}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </PageContainer>
    </EditorProvider>
  );
};

export default EditorPage;
