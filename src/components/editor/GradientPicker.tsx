
import { useEffect, useState } from "react";
import { useEditor } from "./EditorContext";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

export default function GradientPicker() {
  const { gradientColor, setGradientColor } = useEditor();
  const [startColor, setStartColor] = useColor("hex", gradientColor.start);
  const [endColor, setEndColor] = useColor("hex", gradientColor.end);
  const [activeTab, setActiveTab] = useState<'start' | 'end'>('start');
  const [angle, setAngle] = useState(gradientColor.angle);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>(gradientColor.type);

  useEffect(() => {
    setGradientColor({
      start: startColor.hex,
      end: endColor.hex,
      type: gradientType,
      angle
    });
  }, [startColor, endColor, gradientType, angle, setGradientColor]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Type de dégradé</Label>
        <div className="flex gap-2">
          <Button 
            variant={gradientType === 'linear' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setGradientType('linear')}
          >
            Linéaire
          </Button>
          <Button 
            variant={gradientType === 'radial' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setGradientType('radial')}
          >
            Radial
          </Button>
        </div>
      </div>

      {gradientType === 'linear' && (
        <div className="space-y-2">
          <Label>Angle: {angle}°</Label>
          <Slider
            value={[angle]}
            min={0}
            max={360}
            step={1}
            onValueChange={(value) => setAngle(value[0])}
          />
        </div>
      )}

      <div className="h-8 w-full rounded-md" 
        style={{ 
          background: gradientType === 'linear'
            ? `linear-gradient(${angle}deg, ${startColor.hex}, ${endColor.hex})`
            : `radial-gradient(circle, ${startColor.hex}, ${endColor.hex})`
        }}
      />

      <Tabs defaultValue="start" value={activeTab} onValueChange={(value) => setActiveTab(value as 'start' | 'end')}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="start">Couleur début</TabsTrigger>
          <TabsTrigger value="end">Couleur fin</TabsTrigger>
        </TabsList>
        <TabsContent value="start" className="space-y-2">
          <ColorPicker width={300} height={100} color={startColor} onChange={setStartColor} hideHSV />
        </TabsContent>
        <TabsContent value="end" className="space-y-2">
          <ColorPicker width={300} height={100} color={endColor} onChange={setEndColor} hideHSV />
        </TabsContent>
      </Tabs>
    </div>
  );
}
