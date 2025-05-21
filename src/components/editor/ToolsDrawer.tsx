
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
import { ChevronRight, PanelLeft, Palette, Type, Image, Square, CircleOff } from "lucide-react";
import FontSelector from "./FontSelector";
import ShapesPanel from "./ShapesPanel";
import GradientPicker from "./GradientPicker";
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
    <div className="fixed top-24 left-0 z-30">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button 
            variant="secondary" 
            size="sm" 
            className="rounded-r-full rounded-l-none shadow-lg border-l-0"
          >
            {open ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
            <span className="ml-2">{open ? "Fermer" : "Outils"}</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[450px] sm:max-w-md p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Outils d'édition</SheetTitle>
            <SheetDescription>
              Personnalisez votre invitation
            </SheetDescription>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="px-1 py-2">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="elements">
                <Square className="h-4 w-4 mr-2" />
                Éléments
              </TabsTrigger>
              <TabsTrigger value="style">
                <Palette className="h-4 w-4 mr-2" />
                Style
              </TabsTrigger>
              <TabsTrigger value="layers">
                <PanelLeft className="h-4 w-4 mr-2" />
                Calques
              </TabsTrigger>
            </TabsList>

            <div className="p-3">
              <TabsContent value="elements" className="space-y-4 mt-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Ajouter des éléments</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={onTextAdd}
                      className="justify-start"
                    >
                      <Type className="h-4 w-4 mr-2" />
                      Texte
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start"
                      asChild
                    >
                      <label>
                        <Image className="h-4 w-4 mr-2" />
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

              <TabsContent value="style" className="space-y-4 mt-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Polices</h3>
                  <FontSelector />
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Couleurs et dégradés</h3>
                  <GradientPicker />
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
  );
}
