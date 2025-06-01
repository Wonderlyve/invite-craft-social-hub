
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
    const centerY = 950; // 1900 / 2
    
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
        const centerY = 950; // 1900 / 2
        
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
    <div className="flex flex-col h-screen">
      {/* Zone de navigation des outils - scrollable */}
      <div className="flex-shrink-0">
        <ToolsDrawer onTextAdd={handleTextAdd} onImageUpload={handleImageUpload} />
      </div>
      
      {/* Zone principale - scrollable */}
      <div className="flex-1 overflow-auto">
        <Card className="p-4 sm:p-6 m-4">
          {canvasData && (
            <>
              <div className="mb-4">
                <CanvasControls 
                  onSave={handleSave} 
                  onBackgroundImageUpload={handleBackgroundImageUpload}
                />
              </div>
              
              <div className="flex justify-center bg-gray-50 rounded-lg p-4 min-h-[600px] overflow-auto">
                <div className="relative">
                  <KonvaCanvas 
                    width={1080} 
                    height={1900} 
                    initialData={{
                      ...canvasData,
                      backgroundImage: backgroundImageUrl
                    }}
                    onSave={onSaveCanvas}
                  />
                  
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    1080 × 1900 px
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
