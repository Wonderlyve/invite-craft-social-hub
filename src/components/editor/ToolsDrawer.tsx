
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Sheet,
  SheetContent,
  SheetDescription, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Palette, 
  Type, 
  Image, 
  Square, 
  PanelLeft, 
  Layers,
  Sparkles,
  Settings
} from "lucide-react";
import AdvancedToolsPanel from "./AdvancedToolsPanel";
import TemplateLibrary from "./TemplateLibrary";
import ProfessionalLayersPanel from "./ProfessionalLayersPanel";
import FontSelector from "./FontSelector";
import ColorModeSelector from "./ColorModeSelector";
import { useEditor } from "./EditorContext";

interface ToolsDrawerProps {
  onTextAdd: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ToolsDrawer({ onTextAdd, onImageUpload }: ToolsDrawerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tools");
  const { setObjects } = useEditor();

  const handleApplyTemplate = (template: any) => {
    setObjects(template.objects);
    setOpen(false);
  };

  return (
    <>
      {/* Bouton flottant en bas gauche avec un design plus professionnel */}
      <div className="fixed bottom-6 left-6 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              className="h-16 w-16 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <PanelLeft className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[400px] sm:w-[450px] sm:max-w-md p-0 overflow-hidden">
            <SheetHeader className="p-6 pb-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b">
              <SheetTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Studio d'édition professionnel
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Créez des invitations exceptionnelles avec nos outils avancés
              </SheetDescription>
            </SheetHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-[calc(100vh-120px)]">
              <div className="border-b bg-white/50 backdrop-blur-sm">
                <TabsList className="grid grid-cols-4 w-full h-12 bg-transparent">
                  <TabsTrigger value="tools" className="text-xs font-medium">
                    <Settings className="h-4 w-4 mr-1" />
                    Outils
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="text-xs font-medium">
                    <Sparkles className="h-4 w-4 mr-1" />
                    Modèles
                  </TabsTrigger>
                  <TabsTrigger value="layers" className="text-xs font-medium">
                    <Layers className="h-4 w-4 mr-1" />
                    Calques
                  </TabsTrigger>
                  <TabsTrigger value="style" className="text-xs font-medium">
                    <Palette className="h-4 w-4 mr-1" />
                    Style
                  </TabsTrigger>
                </TabsList>
              </div>

              <ScrollArea className="flex-1">
                <div className="p-4">
                  <TabsContent value="tools" className="mt-0">
                    <AdvancedToolsPanel />
                  </TabsContent>

                  <TabsContent value="templates" className="mt-0">
                    <TemplateLibrary onApplyTemplate={handleApplyTemplate} />
                  </TabsContent>

                  <TabsContent value="layers" className="mt-0">
                    <ProfessionalLayersPanel />
                  </TabsContent>

                  <TabsContent value="style" className="mt-0 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Personnalisation du style</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-3">Typographie</h4>
                          <FontSelector />
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-3">Couleurs et dégradés</h4>
                          <ColorModeSelector />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </ScrollArea>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
