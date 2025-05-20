
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Rect, Circle, Image as KonvaImage } from "react-konva";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { toast } from "sonner";
import { Type, Square, Circle as CircleIcon, Image, Trash2, Move } from "lucide-react";

interface KonvaCanvasProps {
  width: number;
  height: number;
  initialData?: any;
  onSave: (canvasData: any) => void;
}

const KonvaCanvas = ({ width, height, initialData, onSave }: KonvaCanvasProps) => {
  const [activeTab, setActiveTab] = useState<'text' | 'shapes' | 'images'>('text');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [textValue, setTextValue] = useState<string>('Votre texte ici');
  const [color, setColor] = useColor("hex", "#333333");
  const [fontSize, setFontSize] = useState<number>(20);
  const stageRef = useRef<any>(null);

  // Chargement des données initiales
  useEffect(() => {
    if (initialData && initialData.objects) {
      setObjects(initialData.objects);
    }
  }, [initialData]);

  // Fonctions de manipulation des objets
  const addText = () => {
    const id = `text-${Date.now()}`;
    setObjects([...objects, {
      id,
      type: 'text',
      x: 100,
      y: 100,
      text: textValue,
      fontSize: fontSize,
      fill: color.hex,
      draggable: true,
      width: 200,
    }]);
    setSelectedId(id);
  };

  const addRectangle = () => {
    const id = `rect-${Date.now()}`;
    setObjects([...objects, {
      id,
      type: 'rect',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: color.hex,
      draggable: true,
    }]);
    setSelectedId(id);
  };

  const addCircle = () => {
    const id = `circle-${Date.now()}`;
    setObjects([...objects, {
      id,
      type: 'circle',
      x: 100,
      y: 100,
      radius: 50,
      fill: color.hex,
      draggable: true,
    }]);
    setSelectedId(id);
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (!event.target?.result) return;
      
      const img = new window.Image();
      img.src = event.target.result.toString();
      
      img.onload = () => {
        const id = `image-${Date.now()}`;
        const aspectRatio = img.width / img.height;
        const newWidth = 200;
        const newHeight = newWidth / aspectRatio;
        
        setObjects([...objects, {
          id,
          type: 'image',
          x: 100,
          y: 100,
          width: newWidth,
          height: newHeight,
          src: event.target?.result.toString(),
          draggable: true,
        }]);
        setSelectedId(id);
      };
    };
    
    reader.readAsDataURL(file);
  };

  const handleObjectChange = (id: string, newProps: any) => {
    setObjects(
      objects.map(obj => (obj.id === id ? { ...obj, ...newProps } : obj))
    );
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setObjects(objects.filter(obj => obj.id !== selectedId));
    setSelectedId(null);
    toast.success("Élément supprimé");
  };

  const saveCanvas = () => {
    const canvasData = {
      objects,
      width,
      height,
    };
    onSave(canvasData);
    toast.success("Invitation sauvegardée");
  };

  const checkDeselect = (e: any) => {
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toolbox */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="text" className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Texte
          </TabsTrigger>
          <TabsTrigger value="shapes" className="flex items-center gap-2">
            <Square className="w-4 h-4" />
            Formes
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Images
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-4 p-4 border rounded-md mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Texte</label>
              <Input
                placeholder="Votre texte ici"
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Taille</label>
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                min={10}
                max={72}
              />
            </div>
          </div>
          <Button onClick={addText} className="w-full bg-invitation-purple hover:bg-invitation-purple-dark">
            Ajouter du texte
          </Button>
        </TabsContent>
        
        <TabsContent value="shapes" className="space-y-4 p-4 border rounded-md mt-2">
          <div className="flex flex-wrap gap-2">
            <Button onClick={addRectangle} variant="outline" size="sm" className="flex items-center gap-2">
              <Square className="w-4 h-4" />
              Rectangle
            </Button>
            <Button onClick={addCircle} variant="outline" size="sm" className="flex items-center gap-2">
              <CircleIcon className="w-4 h-4" />
              Cercle
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="images" className="space-y-4 p-4 border rounded-md mt-2">
          <Button variant="outline" asChild className="w-full">
            <label className="cursor-pointer flex items-center justify-center gap-2">
              <Image className="w-4 h-4" />
              Importer une image
              <input type="file" className="hidden" accept="image/*" onChange={uploadImage} />
            </label>
          </Button>
        </TabsContent>
      </Tabs>
      
      {/* Color Picker */}
      <div className="mb-4 p-4 border rounded-md">
        <label className="block text-sm font-medium mb-2">Couleur</label>
        <ColorPicker width={456} height={100} color={color} onChange={setColor} hideHSV />
      </div>
      
      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedId && (
          <Button onClick={deleteSelected} variant="destructive" size="sm" className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Supprimer
          </Button>
        )}
        <Button onClick={saveCanvas} className="ml-auto bg-invitation-purple hover:bg-invitation-purple-dark">
          Sauvegarder
        </Button>
      </div>
      
      {/* Canvas */}
      <div className="border rounded-md overflow-hidden shadow-sm bg-white">
        <Stage
          width={width}
          height={height}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          ref={stageRef}
        >
          <Layer>
            {objects.map((obj) => {
              const isSelected = obj.id === selectedId;
              
              if (obj.type === 'text') {
                return (
                  <Text
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    text={obj.text}
                    fontSize={obj.fontSize}
                    fill={obj.fill}
                    draggable={true}
                    onClick={() => setSelectedId(obj.id)}
                    onTap={() => setSelectedId(obj.id)}
                    onDragEnd={(e) => {
                      handleObjectChange(obj.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    stroke={isSelected ? "#0096FF" : undefined}
                    strokeWidth={isSelected ? 1 : undefined}
                  />
                );
              }
              
              if (obj.type === 'rect') {
                return (
                  <Rect
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    width={obj.width}
                    height={obj.height}
                    fill={obj.fill}
                    draggable={true}
                    onClick={() => setSelectedId(obj.id)}
                    onTap={() => setSelectedId(obj.id)}
                    onDragEnd={(e) => {
                      handleObjectChange(obj.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    stroke={isSelected ? "#0096FF" : undefined}
                    strokeWidth={isSelected ? 1 : undefined}
                  />
                );
              }
              
              if (obj.type === 'circle') {
                return (
                  <Circle
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    radius={obj.radius}
                    fill={obj.fill}
                    draggable={true}
                    onClick={() => setSelectedId(obj.id)}
                    onTap={() => setSelectedId(obj.id)}
                    onDragEnd={(e) => {
                      handleObjectChange(obj.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    stroke={isSelected ? "#0096FF" : undefined}
                    strokeWidth={isSelected ? 1 : undefined}
                  />
                );
              }
              
              if (obj.type === 'image') {
                return (
                  <KonvaImage
                    key={obj.id}
                    id={obj.id}
                    x={obj.x}
                    y={obj.y}
                    width={obj.width}
                    height={obj.height}
                    image={() => {
                      const img = new window.Image();
                      img.src = obj.src;
                      return img;
                    }}
                    draggable={true}
                    onClick={() => setSelectedId(obj.id)}
                    onTap={() => setSelectedId(obj.id)}
                    onDragEnd={(e) => {
                      handleObjectChange(obj.id, {
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    }}
                    stroke={isSelected ? "#0096FF" : undefined}
                    strokeWidth={isSelected ? 1 : undefined}
                  />
                );
              }
              
              return null;
            })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default KonvaCanvas;
