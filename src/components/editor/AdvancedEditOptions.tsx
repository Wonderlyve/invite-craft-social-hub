
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEditor } from "./EditorContext";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

interface AdvancedEditOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  selectedObject: any;
}

export default function AdvancedEditOptions({ isOpen, onClose, selectedObject }: AdvancedEditOptionsProps) {
  const { objects, setObjects } = useEditor();
  const [frameColor, setFrameColor] = useColor("hex", "#000000");
  const [frameThickness, setFrameThickness] = useState([2]);
  const [frameType, setFrameType] = useState<'none' | 'square' | 'round' | 'diamond'>('none');
  const [opacity, setOpacity] = useState([100]);
  const [rotation, setRotation] = useState([0]);

  useEffect(() => {
    if (selectedObject) {
      setOpacity([Math.round((selectedObject.opacity || 1) * 100)]);
      setRotation([selectedObject.rotation || 0]);
      if (selectedObject.frame) {
        setFrameType(selectedObject.frame.type || 'none');
        setFrameThickness([selectedObject.frame.thickness || 2]);
        setFrameColor({ ...frameColor, hex: selectedObject.frame.color || "#000000" });
      }
    }
  }, [selectedObject]);

  const updateObject = (updates: any) => {
    if (!selectedObject) return;
    
    setObjects(prev => prev.map(obj => 
      obj.id === selectedObject.id 
        ? { ...obj, ...updates }
        : obj
    ));
  };

  const handleFrameChange = (type: 'square' | 'round' | 'diamond') => {
    setFrameType(type);
    updateObject({
      frame: {
        type,
        color: frameColor.hex,
        thickness: frameThickness[0]
      }
    });
  };

  const removeFrame = () => {
    setFrameType('none');
    updateObject({ frame: null });
  };

  const isImage = selectedObject?.type === 'image';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Options d'édition avancées</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Opacité */}
          <div className="space-y-2">
            <Label>Opacité: {opacity[0]}%</Label>
            <Slider
              value={opacity}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => {
                setOpacity(value);
                updateObject({ opacity: value[0] / 100 });
              }}
            />
          </div>

          {/* Rotation */}
          <div className="space-y-2">
            <Label>Rotation: {rotation[0]}°</Label>
            <Slider
              value={rotation}
              min={-180}
              max={180}
              step={1}
              onValueChange={(value) => {
                setRotation(value);
                updateObject({ rotation: value[0] });
              }}
            />
          </div>

          {/* Options de cadre pour les images */}
          {isImage && (
            <div className="space-y-4">
              <Label>Cadre</Label>
              <div className="flex gap-2">
                <Button
                  variant={frameType === 'square' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFrameChange('square')}
                >
                  Carré
                </Button>
                <Button
                  variant={frameType === 'round' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFrameChange('round')}
                >
                  Rond
                </Button>
                <Button
                  variant={frameType === 'diamond' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleFrameChange('diamond')}
                >
                  Losange
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={removeFrame}
                >
                  Aucun
                </Button>
              </div>

              {frameType !== 'none' && (
                <>
                  <div className="space-y-2">
                    <Label>Épaisseur du cadre: {frameThickness[0]}px</Label>
                    <Slider
                      value={frameThickness}
                      min={1}
                      max={20}
                      step={1}
                      onValueChange={(value) => {
                        setFrameThickness(value);
                        updateObject({
                          frame: {
                            type: frameType,
                            color: frameColor.hex,
                            thickness: value[0]
                          }
                        });
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Couleur du cadre</Label>
                    <ColorPicker
                      width={300}
                      height={100}
                      color={frameColor}
                      onChange={(color) => {
                        setFrameColor(color);
                        updateObject({
                          frame: {
                            type: frameType,
                            color: color.hex,
                            thickness: frameThickness[0]
                          }
                        });
                      }}
                      hideHSV
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
