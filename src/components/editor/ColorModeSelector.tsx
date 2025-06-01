
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ColorPicker, useColor } from "react-color-palette";
import { useEditor } from "./EditorContext";
import GradientPicker from "./GradientPicker";
import "react-color-palette/lib/css/styles.css";

export default function ColorModeSelector() {
  const { gradientColor, setGradientColor } = useEditor();
  const [colorMode, setColorMode] = useState<'single' | 'gradient'>('single');
  const [singleColor, setSingleColor] = useColor("hex", "#ffffff");

  const handleColorModeChange = (mode: 'single' | 'gradient') => {
    setColorMode(mode);
    if (mode === 'single') {
      setGradientColor({
        start: singleColor.hex,
        end: singleColor.hex,
        type: 'linear',
        angle: 0
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button 
          variant={colorMode === 'single' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleColorModeChange('single')}
        >
          Couleur unique
        </Button>
        <Button 
          variant={colorMode === 'gradient' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleColorModeChange('gradient')}
        >
          Dégradé
        </Button>
      </div>

      {colorMode === 'single' ? (
        <div className="space-y-2">
          <ColorPicker 
            width={250} 
            height={100} 
            color={singleColor} 
            onChange={(color) => {
              setSingleColor(color);
              setGradientColor({
                start: color.hex,
                end: color.hex,
                type: 'linear',
                angle: 0
              });
            }} 
            hideHSV 
          />
        </div>
      ) : (
        <GradientPicker />
      )}
    </div>
  );
}
