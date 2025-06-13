
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Type, 
  Image, 
  Square, 
  Circle, 
  Triangle, 
  Star, 
  Heart,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline,
  RotateCcw,
  Copy,
  Trash2,
  Move,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { useEditor } from "./EditorContext";

export default function AdvancedToolsPanel() {
  const { 
    selectedId, 
    objects, 
    setObjects, 
    setSelectedId,
    zoomScale,
    setZoomScale 
  } = useEditor();
  
  const [activeCategory, setActiveCategory] = useState("elements");
  const selectedObject = objects.find(obj => obj.id === selectedId);

  // Fonctions pour ajouter des éléments
  const addText = (style = {}) => {
    const centerX = 540;
    const centerY = 900;
    const id = `text-${Date.now()}`;
    
    const newText = {
      id,
      type: 'text',
      x: centerX - 80,
      y: centerY - 10,
      text: 'Votre texte ici',
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#333333',
      draggable: true,
      width: 160,
      ...style
    };
    
    setObjects([...objects, newText]);
    setSelectedId(id);
  };

  const addShape = (type: string, props: any = {}) => {
    const centerX = 540;
    const centerY = 900;
    const id = `${type}-${Date.now()}`;
    
    let shapeProps = {};
    
    switch (type) {
      case 'rect':
        shapeProps = {
          x: centerX - 50,
          y: centerY - 50,
          width: 100,
          height: 100,
          fill: '#9b87f5'
        };
        break;
      case 'circle':
        shapeProps = {
          x: centerX,
          y: centerY,
          radius: 50,
          fill: '#9b87f5'
        };
        break;
      case 'triangle':
        shapeProps = {
          x: centerX - 40,
          y: centerY - 35,
          points: [40, 0, 0, 70, 80, 70],
          fill: '#9b87f5',
          type: 'polygon'
        };
        type = 'polygon';
        break;
    }
    
    const newShape = {
      id,
      type,
      draggable: true,
      ...shapeProps,
      ...props
    };
    
    setObjects([...objects, newShape]);
    setSelectedId(id);
  };

  // Fonctions de manipulation d'objets
  const duplicateSelected = () => {
    if (!selectedObject) return;
    
    const id = `${selectedObject.type}-${Date.now()}`;
    const duplicate = {
      ...selectedObject,
      id,
      x: selectedObject.x + 20,
      y: selectedObject.y + 20
    };
    
    setObjects([...objects, duplicate]);
    setSelectedId(id);
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    setObjects(objects.filter(obj => obj.id !== selectedId));
    setSelectedId(null);
  };

  const updateSelectedObject = (updates: any) => {
    if (!selectedId) return;
    setObjects(objects.map(obj => 
      obj.id === selectedId ? { ...obj, ...updates } : obj
    ));
  };

  // Templates de texte prédéfinis
  const textTemplates = [
    { name: "Titre principal", style: { fontSize: 36, fontFamily: "Playfair Display", fill: "#1a1a1a" } },
    { name: "Sous-titre", style: { fontSize: 24, fontFamily: "Montserrat", fill: "#666666" } },
    { name: "Corps de texte", style: { fontSize: 16, fontFamily: "Open Sans", fill: "#333333" } },
    { name: "Signature", style: { fontSize: 20, fontFamily: "Dancing Script", fill: "#9b87f5" } }
  ];

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Outils d'édition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="grid w-full grid-cols-4 text-xs">
            <TabsTrigger value="elements">Éléments</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="format">Format</TabsTrigger>
            <TabsTrigger value="advanced">Avancé</TabsTrigger>
          </TabsList>

          {/* Onglet Éléments */}
          <TabsContent value="elements" className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Texte</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {textTemplates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => addText(template.style)}
                    className="text-xs"
                  >
                    <Type className="w-3 h-3 mr-1" />
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Formes</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={() => addShape('rect')}>
                  <Square className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => addShape('circle')}>
                  <Circle className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => addShape('triangle')}>
                  <Triangle className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Image</Label>
              <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                <label>
                  <Image className="w-4 h-4 mr-2" />
                  Importer une image
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </Button>
            </div>
          </TabsContent>

          {/* Onglet Design */}
          <TabsContent value="design" className="space-y-4">
            {selectedObject && (
              <>
                <div>
                  <Label className="text-sm font-medium">Couleur</Label>
                  <div className="flex gap-2 mt-2">
                    {['#000000', '#ffffff', '#9b87f5', '#ef4444', '#22c55e', '#3b82f6', '#f59e0b', '#ec4899'].map((color) => (
                      <button
                        key={color}
                        className="w-8 h-8 rounded border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                        onClick={() => updateSelectedObject({ fill: color })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Opacité</Label>
                  <Slider
                    value={[selectedObject.opacity || 1]}
                    max={1}
                    min={0}
                    step={0.1}
                    onValueChange={(value) => updateSelectedObject({ opacity: value[0] })}
                    className="mt-2"
                  />
                </div>

                {selectedObject.type === 'text' && (
                  <div>
                    <Label className="text-sm font-medium">Police</Label>
                    <Select 
                      value={selectedObject.fontFamily || 'Arial'} 
                      onValueChange={(value) => updateSelectedObject({ fontFamily: value })}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Dancing Script">Dancing Script</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Onglet Format */}
          <TabsContent value="format" className="space-y-4">
            {selectedObject && (
              <>
                {selectedObject.type === 'text' && (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Taille de police</Label>
                      <Input
                        type="number"
                        value={selectedObject.fontSize || 16}
                        onChange={(e) => updateSelectedObject({ fontSize: parseInt(e.target.value) })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Style</Label>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Underline className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Alignement</Label>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <AlignRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <Label className="text-sm font-medium">Position</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <Label className="text-xs">X</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedObject.x || 0)}
                        onChange={(e) => updateSelectedObject({ x: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Y</Label>
                      <Input
                        type="number"
                        value={Math.round(selectedObject.y || 0)}
                        onChange={(e) => updateSelectedObject({ y: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          {/* Onglet Avancé */}
          <TabsContent value="advanced" className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Actions</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Button variant="outline" size="sm" onClick={duplicateSelected} disabled={!selectedId}>
                  <Copy className="w-4 h-4 mr-1" />
                  Dupliquer
                </Button>
                <Button variant="outline" size="sm" onClick={deleteSelected} disabled={!selectedId}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Supprimer
                </Button>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Zoom</Label>
              <div className="flex items-center gap-2 mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setZoomScale(Math.max(0.1, zoomScale - 0.1))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[60px] text-center">
                  {Math.round(zoomScale * 100)}%
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setZoomScale(Math.min(5, zoomScale + 0.1))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {selectedObject && (
              <div>
                <Label className="text-sm font-medium">Rotation</Label>
                <Slider
                  value={[selectedObject.rotation || 0]}
                  max={360}
                  min={0}
                  step={1}
                  onValueChange={(value) => updateSelectedObject({ rotation: value[0] })}
                  className="mt-2"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
