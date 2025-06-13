
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Layers, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown, 
  Trash2, 
  Copy,
  MoreVertical,
  Edit3
} from "lucide-react";
import { useEditor } from "./EditorContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LayerState {
  id: string;
  visible: boolean;
  locked: boolean;
  name: string;
}

export default function ProfessionalLayersPanel() {
  const { objects, setObjects, selectedId, setSelectedId } = useEditor();
  const [layerStates, setLayerStates] = useState<Record<string, LayerState>>({});
  const [editingName, setEditingName] = useState<string | null>(null);

  const getLayerState = (id: string): LayerState => {
    return layerStates[id] || {
      id,
      visible: true,
      locked: false,
      name: getDefaultName(objects.find(obj => obj.id === id))
    };
  };

  const updateLayerState = (id: string, updates: Partial<LayerState>) => {
    setLayerStates(prev => ({
      ...prev,
      [id]: { ...getLayerState(id), ...updates }
    }));
  };

  const getDefaultName = (obj: any) => {
    if (!obj) return 'Élément';
    
    switch (obj.type) {
      case 'text':
        return obj.text ? `Texte: "${obj.text.substring(0, 20)}${obj.text.length > 20 ? '...' : ''}"` : 'Texte';
      case 'rect':
        return 'Rectangle';
      case 'circle':
        return 'Cercle';
      case 'polygon':
        return 'Polygone';
      case 'image':
        return 'Image';
      default:
        return 'Élément';
    }
  };

  const getLayerIcon = (obj: any) => {
    switch (obj.type) {
      case 'text':
        return '📝';
      case 'rect':
        return '⬜';
      case 'circle':
        return '⭕';
      case 'polygon':
        return '🔺';
      case 'image':
        return '🖼️';
      default:
        return '📦';
    }
  };

  const moveLayer = (id: string, direction: 'up' | 'down') => {
    const index = objects.findIndex(obj => obj.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= objects.length) return;
    
    const newObjects = [...objects];
    [newObjects[index], newObjects[newIndex]] = [newObjects[newIndex], newObjects[index]];
    setObjects(newObjects);
  };

  const duplicateLayer = (id: string) => {
    const obj = objects.find(o => o.id === id);
    if (!obj) return;
    
    const newId = `${obj.type}-${Date.now()}`;
    const duplicate = {
      ...obj,
      id: newId,
      x: obj.x + 20,
      y: obj.y + 20
    };
    
    setObjects([...objects, duplicate]);
    setSelectedId(newId);
  };

  const deleteLayer = (id: string) => {
    setObjects(objects.filter(obj => obj.id !== id));
    if (selectedId === id) {
      setSelectedId(null);
    }
    // Nettoyer l'état du calque
    setLayerStates(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const toggleVisibility = (id: string) => {
    const currentState = getLayerState(id);
    updateLayerState(id, { visible: !currentState.visible });
    
    // Mettre à jour l'objet dans le canvas
    setObjects(objects.map(obj => 
      obj.id === id 
        ? { ...obj, visible: !currentState.visible, opacity: !currentState.visible ? (obj.opacity || 1) : 0 }
        : obj
    ));
  };

  const toggleLock = (id: string) => {
    const currentState = getLayerState(id);
    updateLayerState(id, { locked: !currentState.locked });
    
    // Mettre à jour l'objet dans le canvas
    setObjects(objects.map(obj => 
      obj.id === id 
        ? { ...obj, draggable: currentState.locked }
        : obj
    ));
  };

  const handleNameEdit = (id: string, newName: string) => {
    updateLayerState(id, { name: newName });
    setEditingName(null);
  };

  // Trier les objets par ordre d'affichage (le dernier en haut de la liste)
  const sortedObjects = [...objects].reverse();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Layers className="w-4 h-4" />
          Calques ({objects.length})
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {objects.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Aucun calque</p>
            <p className="text-xs">Ajoutez des éléments pour commencer</p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            {sortedObjects.map((obj, index) => {
              const layerState = getLayerState(obj.id);
              const isSelected = selectedId === obj.id;
              
              return (
                <div key={obj.id}>
                  <div 
                    className={`flex items-center px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border-r-2 border-primary' : ''
                    } ${!layerState.visible ? 'opacity-50' : ''}`}
                    onClick={() => !layerState.locked && setSelectedId(obj.id)}
                  >
                    {/* Icône du type d'élément */}
                    <span className="text-sm mr-3">{getLayerIcon(obj)}</span>
                    
                    {/* Nom du calque */}
                    <div className="flex-1 min-w-0">
                      {editingName === obj.id ? (
                        <Input
                          value={layerState.name}
                          onChange={(e) => updateLayerState(obj.id, { name: e.target.value })}
                          onBlur={() => setEditingName(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingName(null);
                            }
                          }}
                          className="h-6 text-xs"
                          autoFocus
                        />
                      ) : (
                        <p className="text-sm font-medium truncate">{layerState.name}</p>
                      )}
                    </div>
                    
                    {/* Contrôles */}
                    <div className="flex items-center gap-1 ml-2">
                      {/* Visibilité */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleVisibility(obj.id);
                        }}
                      >
                        {layerState.visible ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                      </Button>
                      
                      {/* Verrouillage */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLock(obj.id);
                        }}
                      >
                        {layerState.locked ? (
                          <Lock className="w-3 h-3" />
                        ) : (
                          <Unlock className="w-3 h-3" />
                        )}
                      </Button>
                      
                      {/* Menu actions */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => setEditingName(obj.id)}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Renommer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => duplicateLayer(obj.id)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Dupliquer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => moveLayer(obj.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4 mr-2" />
                            Monter
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => moveLayer(obj.id, 'down')}
                            disabled={index === sortedObjects.length - 1}
                          >
                            <ArrowDown className="w-4 h-4 mr-2" />
                            Descendre
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem 
                            onClick={() => deleteLayer(obj.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {index < sortedObjects.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
