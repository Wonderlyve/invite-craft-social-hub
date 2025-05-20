
import { useEffect, useRef, useState } from "react";
import { Canvas, IEvent } from "fabric";
import { Button } from "@/components/ui/button";
import { ImageIcon, Type, Square, Circle } from "lucide-react";

interface FabricCanvasProps {
  width: number;
  height: number;
}

const FabricCanvas = ({ width, height }: FabricCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'shapes' | 'images'>('text');

  useEffect(() => {
    if (!canvasRef.current) return;

    const fabricCanvas = new Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#FFFFFF',
    });

    setCanvas(fabricCanvas);

    return () => {
      fabricCanvas.dispose();
    };
  }, [width, height]);

  const addText = () => {
    if (!canvas) return;
    
    import('fabric').then(({ Textbox }) => {
      const text = new Textbox('Votre texte ici', {
        left: 50,
        top: 50,
        fontFamily: 'Poppins',
        fill: '#333',
        fontSize: 20,
        width: 200,
      });
      
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    });
  };

  const addRectangle = () => {
    if (!canvas) return;
    
    import('fabric').then(({ Rect }) => {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: '#9b87f5',
        width: 100,
        height: 100,
        opacity: 0.7,
      });
      
      canvas.add(rect);
      canvas.setActiveObject(rect);
      canvas.renderAll();
    });
  };

  const addCircle = () => {
    if (!canvas) return;
    
    import('fabric').then(({ Circle }) => {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: '#FEF7CD',
        radius: 50,
        opacity: 0.7,
      });
      
      canvas.add(circle);
      canvas.setActiveObject(circle);
      canvas.renderAll();
    });
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) return;
      
      import('fabric').then(({ Image }) => {
        Image.fromURL(event.target.result.toString(), (img) => {
          img.scaleToWidth(200);
          canvas.add(img);
          canvas.renderAll();
        });
      });
    };
    
    reader.readAsDataURL(file);
  };

  const renderToolbox = () => {
    return (
      <div className="bg-background border border-border rounded-md p-4 mb-4">
        <div className="flex border-b border-border mb-4">
          <button 
            className={`px-4 py-2 ${activeTab === 'text' ? 'border-b-2 border-invitation-purple text-invitation-purple' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('text')}
          >
            <Type className="w-5 h-5" />
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'shapes' ? 'border-b-2 border-invitation-purple text-invitation-purple' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('shapes')}
          >
            <Square className="w-5 h-5" />
          </button>
          <button 
            className={`px-4 py-2 ${activeTab === 'images' ? 'border-b-2 border-invitation-purple text-invitation-purple' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('images')}
          >
            <ImageIcon className="w-5 h-5" />
          </button>
        </div>
        
        {activeTab === 'text' && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={addText} variant="outline" size="sm">
              Ajouter du texte
            </Button>
          </div>
        )}
        
        {activeTab === 'shapes' && (
          <div className="flex flex-wrap gap-2">
            <Button onClick={addRectangle} variant="outline" size="sm">
              <Square className="w-4 h-4 mr-2" />
              Rectangle
            </Button>
            <Button onClick={addCircle} variant="outline" size="sm">
              <Circle className="w-4 h-4 mr-2" />
              Cercle
            </Button>
          </div>
        )}
        
        {activeTab === 'images' && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <label className="cursor-pointer">
                <ImageIcon className="w-4 h-4 mr-2" />
                Importer une image
                <input type="file" className="hidden" accept="image/*" onChange={uploadImage} />
              </label>
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {renderToolbox()}
      <div className="border border-border rounded-md overflow-hidden shadow-sm">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default FabricCanvas;
