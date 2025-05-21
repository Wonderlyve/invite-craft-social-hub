
import { Card } from "@/components/ui/card";
import KonvaCanvas from "../KonvaCanvas";
import CanvasControls from "../CanvasControls";
import ToolsDrawer from "../ToolsDrawer";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface EditorTabProps {
  canvasData: any;
  onSaveCanvas: (canvasData: any) => void;
  onTextAdd: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}

const EditorTab = ({ 
  canvasData, 
  onSaveCanvas, 
  onTextAdd, 
  onImageUpload, 
  handleSave 
}: EditorTabProps) => {
  // État pour stocker l'URL de l'image de fond
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    canvasData?.backgroundImage || null
  );
  
  // Fonction pour ajouter une image de fond
  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) return;
      const imageUrl = event.target.result.toString();
      
      setBackgroundImageUrl(imageUrl);
      
      // Mettre à jour les données du canvas avec la nouvelle image de fond
      const updatedCanvasData = {
        ...canvasData,
        backgroundImage: imageUrl
      };
      
      onSaveCanvas(updatedCanvasData);
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid grid-cols-1 gap-4 pb-4 relative">
      {/* Drawer pour les outils */}
      <ToolsDrawer onTextAdd={onTextAdd} onImageUpload={onImageUpload} />
      
      {/* Zone d'édition principale */}
      <Card className="p-2 sm:p-4">
        {canvasData && (
          <>
            <div className="mb-3 flex items-center justify-between">
              <CanvasControls onSave={handleSave} />
              
              <Button 
                variant="ghost" 
                size="sm" 
                asChild
                className="text-xs"
              >
                <label className="flex items-center gap-1 cursor-pointer">
                  <Image className="h-4 w-4" />
                  Fond
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleBackgroundImageUpload} 
                  />
                </label>
              </Button>
            </div>
            
            <div className="flex justify-center">
              <KonvaCanvas 
                width={600} 
                height={800} 
                initialData={{
                  ...canvasData,
                  backgroundImage: backgroundImageUrl
                }}
                onSave={onSaveCanvas}
              />
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default EditorTab;
