
import { Card } from "@/components/ui/card";
import KonvaCanvas from "../KonvaCanvas";
import CanvasControls from "../CanvasControls";
import ToolsDrawer from "../ToolsDrawer";
import { useState } from "react";

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
  const [backgroundImageUrl, setBackgroundImageUrl] = useState<string | null>(
    canvasData?.backgroundImage || null
  );
  
  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) return;
      const imageUrl = event.target.result.toString();
      
      setBackgroundImageUrl(imageUrl);
      
      const updatedCanvasData = {
        ...canvasData,
        backgroundImage: imageUrl
      };
      
      onSaveCanvas(updatedCanvasData);
    };
    
    reader.readAsDataURL(file);
  };

  const handleTextAdd = () => {
    const centerX = 540; // 1080 / 2
    const centerY = 900; // 1800 / 2
    
    if (!canvasData) return;
    
    const updatedData = {
      ...canvasData,
      objects: [
        ...(canvasData.objects || []),
        {
          id: `text-${Date.now()}`,
          type: 'text',
          x: centerX - 80, // Centrer le texte
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
    
    onSaveCanvas(updatedData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              x: centerX - newWidth / 2, // Centrer l'image
              y: centerY - newHeight / 2,
              width: newWidth,
              height: newHeight,
              src: event.target?.result.toString(),
              draggable: true,
            }
          ]
        };
        
        onSaveCanvas(updatedData);
      };
    };
    
    reader.readAsDataURL(file);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Zone de navigation des outils - fixe */}
      <div className="flex-shrink-0 mb-2">
        <ToolsDrawer onTextAdd={handleTextAdd} onImageUpload={handleImageUpload} />
      </div>
      
      {/* Zone principale - optimisée pour 1080x1800 */}
      <div className="flex-1 overflow-hidden">
        <Card className="h-full p-2">
          {canvasData && (
            <>
              <div className="mb-2">
                <CanvasControls 
                  onSave={handleSave} 
                  onBackgroundImageUpload={handleBackgroundImageUpload}
                />
              </div>
              
              <div className="flex justify-center bg-gray-50 rounded-lg p-2 h-[calc(100%-80px)] overflow-hidden">
                <div className="relative max-w-full max-h-full">
                  <KonvaCanvas 
                    width={1080} 
                    height={1800} 
                    initialData={{
                      ...canvasData,
                      backgroundImage: backgroundImageUrl
                    }}
                    onSave={onSaveCanvas}
                  />
                  
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    1080 × 1800 px
                  </div>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EditorTab;
