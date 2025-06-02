
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
import { Palette, Type, Image, Square, PanelLeft } from "lucide-react";
import FontSelector from "./FontSelector";
import ShapesPanel from "./ShapesPanel";
import ColorModeSelector from "./ColorModeSelector";
import LayersPanel from "./LayersPanel";
import DecorationItems from "./DecorationItems";

interface ToolsDrawerProps {
  onTextAdd: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ToolsDrawer({ onTextAdd, onImageUpload }: ToolsDrawerProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("elements");

  return (
    <>
      {/* Bouton flottant en bas gauche */}
      <div className="fixed bottom-6 left-6 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              className="h-14 w-14 rounded-full bg-invitation-purple hover:bg-invitation-purple-dark text-white shadow-lg"
              size="lg"
            >
              <PanelLeft className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] sm:w-[350px] sm:max-w-md p-0 overflow-y-auto">
            <SheetHeader className="p-3 border-b">
              <SheetTitle className="text-lg">Outils d'édition</SheetTitle>
              <SheetDescription className="text-sm">
                Personnalisez votre invitation
              </SheetDescription>
            </SheetHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="px-1 py-2">
              <TabsList className="grid grid-cols-3 w-full mx-2">
                <TabsTrigger value="elements" className="text-xs">
                  <Square className="h-3 w-3 mr-1" />
                  Éléments
                </TabsTrigger>
                <TabsTrigger value="style" className="text-xs">
                  <Palette className="h-3 w-3 mr-1" />
                  Style
                </TabsTrigger>
                <TabsTrigger value="layers" className="text-xs">
                  <PanelLeft className="h-3 w-3 mr-1" />
                  Calques
                </TabsTrigger>
              </TabsList>

              <div className="p-2 space-y-4 max-h-[calc(100vh-150px)] overflow-y-auto">
                <TabsContent value="elements" className="space-y-3 mt-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Ajouter des éléments</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={onTextAdd}
                        className="justify-start text-xs"
                      >
                        <Type className="h-3 w-3 mr-1" />
                        Texte
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="justify-start text-xs"
                        asChild
                      >
                        <label>
                          <Image className="h-3 w-3 mr-1" />
                          Image
                          <input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={onImageUpload} 
                          />
                        </label>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Formes</h3>
                    <ShapesPanel />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Décorations</h3>
                    <DecorationItems />
                  </div>
                </TabsContent>

                <TabsContent value="style" className="space-y-3 mt-2">
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Polices</h3>
                    <FontSelector />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Couleurs</h3>
                    <ColorModeSelector />
                  </div>
                </TabsContent>

                <TabsContent value="layers" className="mt-2">
                  <LayersPanel />
                </TabsContent>
              </div>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
