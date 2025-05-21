
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Type, 
  Square, 
  Image as ImageIcon,
  Layers as LayersIcon,
  Palette,
  PanelLeft,
  CircleOff
} from "lucide-react";
import { ReactNode, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LayersPanel from "./LayersPanel";
import FontSelector from "./FontSelector";
import GradientPicker from "./GradientPicker";
import ShapesPanel from "./ShapesPanel";
import DecorationItems from "./DecorationItems";

interface MobileToolbarProps {
  onTextAdd: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ToolButtonProps {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
  sheet?: {
    title: string;
    description: string;
    content: ReactNode;
  };
}

const MobileToolbar = ({ onTextAdd, onImageUpload }: MobileToolbarProps) => {
  const [activeTab, setActiveTab] = useState("elements");

  const ToolButton = ({ icon, label, onClick, sheet }: ToolButtonProps) => {
    if (sheet) {
      return (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex-col h-auto py-2">
              {icon}
              <span className="text-xs mt-1">{label}</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] px-2">
            <SheetHeader className="text-left pb-2">
              <SheetTitle>{sheet.title}</SheetTitle>
              <SheetDescription>{sheet.description}</SheetDescription>
            </SheetHeader>
            {sheet.content}
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <Button variant="ghost" className="flex-col h-auto py-2" onClick={onClick}>
        {icon}
        <span className="text-xs mt-1">{label}</span>
      </Button>
    );
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-background border-t md:hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start px-1 h-12 gap-1">
            <TabsTrigger value="elements" className="flex-1">Éléments</TabsTrigger>
            <TabsTrigger value="edit" className="flex-1">Édition</TabsTrigger>
            <TabsTrigger value="layers" className="flex-1">Calques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="elements" className="px-1 flex justify-between border-t">
            <ToolButton 
              icon={<Type className="h-5 w-5" />}
              label="Texte"
              onClick={onTextAdd}
            />
            <ToolButton 
              icon={<Square className="h-5 w-5" />}
              label="Formes"
              sheet={{
                title: "Ajouter une forme",
                description: "Choisissez une forme à ajouter",
                content: <ShapesPanel />
              }}
            />
            <ToolButton 
              icon={<ImageIcon className="h-5 w-5" />}
              label="Image"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => onImageUpload(e as any);
                input.click();
              }}
            />
            <ToolButton 
              icon={<CircleOff className="h-5 w-5" />}
              label="Déco"
              sheet={{
                title: "Éléments décoratifs",
                description: "Ajoutez des éléments décoratifs à votre invitation",
                content: <DecorationItems />
              }}
            />
          </TabsContent>
          
          <TabsContent value="edit" className="px-1 flex justify-between border-t">
            <ToolButton 
              icon={<Type className="h-5 w-5" />}
              label="Police"
              sheet={{
                title: "Choix de police",
                description: "Changez la police de votre texte",
                content: <FontSelector />
              }}
            />
            <ToolButton 
              icon={<Palette className="h-5 w-5" />}
              label="Couleur"
              sheet={{
                title: "Choix de couleurs",
                description: "Personnalisez les couleurs et dégradés",
                content: <GradientPicker />
              }}
            />
          </TabsContent>
          
          <TabsContent value="layers" className="px-1 border-t py-2">
            <LayersPanel />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Spacer to account for the toolbar height on mobile */}
      <div className="h-32 md:h-0" />
    </>
  );
};

export default MobileToolbar;
