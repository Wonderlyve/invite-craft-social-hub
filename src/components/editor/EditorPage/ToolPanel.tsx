
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import FontSelector from "../FontSelector";
import ShapesPanel from "../ShapesPanel";
import GradientPicker from "../GradientPicker";
import LayersPanel from "../LayersPanel";
import DecorationItems from "../DecorationItems";

interface ToolPanelProps {
  onTextAdd: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Ce composant n'est plus utilisé directement car remplacé par ToolsDrawer
// Mais on le garde pour compatiblité avec d'autres composants qui pourraient l'utiliser
const ToolPanel = ({ onTextAdd, onImageUpload }: ToolPanelProps) => {
  return (
    <div className="space-y-4 hidden lg:block">
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Outils</h3>
        <div className="space-y-4">
          <Button onClick={onTextAdd} variant="outline" className="w-full justify-start">
            Ajouter du texte
          </Button>
          
          <Button variant="outline" asChild className="w-full justify-start">
            <label className="cursor-pointer flex items-center">
              <Image className="mr-2 h-4 w-4" />
              Importer une image
              <input type="file" className="hidden" accept="image/*" onChange={onImageUpload} />
            </label>
          </Button>
          
          <FontSelector />
        </div>
      </Card>
      
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Formes</h3>
        <ShapesPanel />
      </Card>
      
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Couleurs et dégradés</h3>
        <GradientPicker />
      </Card>
      
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Calques</h3>
        <LayersPanel />
      </Card>
      
      <DecorationItems />
    </div>
  );
};

export default ToolPanel;
