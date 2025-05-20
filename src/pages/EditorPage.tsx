
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import FabricCanvas from "@/components/editor/FabricCanvas";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Save, ArrowLeft, Eye, Share } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const EditorPage = () => {
  const [activeTab, setActiveTab] = useState("editor");
  
  const handleSave = () => {
    toast.success("Invitation sauvegardée avec succès !");
  };
  
  return (
    <>
      <Navbar />
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
              onClick={handleSave} 
              variant="outline"
            >
              <Save className="mr-2 h-4 w-4" /> Sauvegarder
            </Button>
            <Button className="bg-invitation-purple hover:bg-invitation-purple-dark">
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
                <FabricCanvas width={600} height={800} />
              </Card>
              <div className="space-y-4">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Paramètres de l'invitation</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Type d'événement</label>
                      <select className="input-field mt-1">
                        <option>Mariage</option>
                        <option>Anniversaire</option>
                        <option>Conférence</option>
                        <option>Baptême</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Format</label>
                      <select className="input-field mt-1">
                        <option>Portrait (600x800)</option>
                        <option>Paysage (800x600)</option>
                        <option>Carré (700x700)</option>
                      </select>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Champs dynamiques</h3>
                  <div className="space-y-2">
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Inséré : {nom}")}>
                      {"{nom}"}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Inséré : {table}")}>
                      {"{table}"}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Inséré : {date}")}>
                      {"{date}"}
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => toast.info("Inséré : {lieu}")}>
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
                <img 
                  src="/placeholder.svg" 
                  alt="Aperçu de l'invitation" 
                  className="w-[600px] h-[800px] object-contain"
                />
              </div>
              <div className="mt-8 flex gap-4">
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" /> Prévisualiser par invité
                </Button>
                <Button className="bg-invitation-purple hover:bg-invitation-purple-dark">
                  <Share className="mr-2 h-4 w-4" /> Partager les invitations
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
      <Footer />
    </>
  );
};

export default EditorPage;
