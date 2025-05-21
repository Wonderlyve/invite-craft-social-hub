
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEditor } from "./EditorContext";
import { Layers, ArrowUp, ArrowDown, Eye, EyeOff, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function LayersPanel() {
  const { objects, setObjects, selectedId, setSelectedId } = useEditor();
  const [hiddenLayers, setHiddenLayers] = useState<string[]>([]);
  
  const handleMoveUp = (id: string) => {
    const index = objects.findIndex(obj => obj.id === id);
    if (index > 0) {
      const newObjects = [...objects];
      [newObjects[index], newObjects[index - 1]] = [newObjects[index - 1], newObjects[index]];
      setObjects(newObjects);
    }
  };
  
  const handleMoveDown = (id: string) => {
    const index = objects.findIndex(obj => obj.id === id);
    if (index < objects.length - 1) {
      const newObjects = [...objects];
      [newObjects[index], newObjects[index + 1]] = [newObjects[index + 1], newObjects[index]];
      setObjects(newObjects);
    }
  };
  
  const handleToggleVisibility = (id: string) => {
    if (hiddenLayers.includes(id)) {
      setHiddenLayers(hiddenLayers.filter(layerId => layerId !== id));
    } else {
      setHiddenLayers([...hiddenLayers, id]);
    }
  };
  
  const handleDeleteLayer = (id: string) => {
    setObjects(objects.filter(obj => obj.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
  };
  
  const getLayerName = (obj: any) => {
    switch (obj.type) {
      case 'text':
        return `Texte: "${obj.text.substring(0, 15)}${obj.text.length > 15 ? '...' : ''}"`;
      case 'rect':
        return 'Rectangle';
      case 'circle':
        return 'Cercle';
      case 'image':
        return 'Image';
      default:
        return 'Élément';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Layers className="h-4 w-4 mr-2" />
          Calques
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-1 max-h-48 overflow-y-auto">
        {objects.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Aucun élément sur le canvas
          </p>
        ) : (
          <ul className="space-y-1">
            {[...objects].reverse().map((obj) => (
              <li 
                key={obj.id}
                className={cn(
                  "px-2 py-1.5 rounded-sm flex items-center justify-between text-sm",
                  selectedId === obj.id && "bg-muted",
                  hiddenLayers.includes(obj.id) && "opacity-50"
                )}
                onClick={() => setSelectedId(obj.id)}
              >
                <span className="truncate flex-1">{getLayerName(obj)}</span>
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleVisibility(obj.id);
                    }}
                  >
                    {hiddenLayers.includes(obj.id) ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveUp(obj.id);
                    }}
                  >
                    <ArrowUp className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoveDown(obj.id);
                    }}
                  >
                    <ArrowDown className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-destructive hover:text-destructive" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteLayer(obj.id);
                    }}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
