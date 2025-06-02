
import { Button } from "@/components/ui/button";
import { useEditor } from "./EditorContext";
import { 
  Square, 
  Circle as CircleIcon, 
  Triangle, 
  Star, 
  Heart,
  Hexagon,
  Pentagon,
  Octagon
} from "lucide-react";

export default function ShapesPanel() {
  const { objects, setObjects, selectedId, setSelectedId, gradientColor } = useEditor();
  
  const getFillStyle = () => {
    if (gradientColor.type === 'linear') {
      return {
        fillLinearGradientStartPoint: { x: 0, y: 0 },
        fillLinearGradientEndPoint: { x: 100, y: 100 },
        fillLinearGradientColorStops: [0, gradientColor.start, 1, gradientColor.end]
      };
    } else {
      return {
        fillRadialGradientStartPoint: { x: 50, y: 50 },
        fillRadialGradientStartRadius: 0,
        fillRadialGradientEndPoint: { x: 50, y: 50 },
        fillRadialGradientEndRadius: 50,
        fillRadialGradientColorStops: [0, gradientColor.start, 1, gradientColor.end]
      };
    }
  };

  // Centrer dans la zone de travail (1080x1800)
  const centerX = 540; // 1080 / 2
  const centerY = 900; // 1800 / 2

  const addRectangle = () => {
    const id = `rect-${Date.now()}`;
    setObjects([...objects, {
      id,
      type: 'rect',
      x: centerX - 40, // Centrer un rectangle de 80x80
      y: centerY - 40,
      width: 80,
      height: 80,
      fill: gradientColor.start,
      ...getFillStyle(),
      draggable: true
    }]);
    setSelectedId(id);
  };

  const addCircle = () => {
    const id = `circle-${Date.now()}`;
    setObjects([...objects, {
      id,
      type: 'circle',
      x: centerX, // Centrer un cercle de rayon 40
      y: centerY,
      radius: 40,
      fill: gradientColor.start,
      ...getFillStyle(),
      draggable: true
    }]);
    setSelectedId(id);
  };

  const addTriangle = () => {
    const id = `triangle-${Date.now()}`;
    setObjects([...objects, {
      id,
      type: 'polygon',
      x: centerX - 40, // Centrer un triangle de 80px de base
      y: centerY - 35,
      points: [0, 0, 40, 70, 80, 0],
      fill: gradientColor.start,
      ...getFillStyle(),
      draggable: true
    }]);
    setSelectedId(id);
  };

  const addStar = () => {
    const id = `star-${Date.now()}`;
    
    setObjects([...objects, {
      id,
      type: 'star',
      x: centerX, // Centrer une étoile
      y: centerY,
      numPoints: 5,
      innerRadius: 15,
      outerRadius: 30,
      fill: gradientColor.start,
      ...getFillStyle(),
      draggable: true
    }]);
    setSelectedId(id);
  };

  const addHeart = () => {
    const id = `heart-${Date.now()}`;
    const svgPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
    
    setObjects([...objects, {
      id,
      type: 'path',
      x: centerX - 20, // Centrer un cœur
      y: centerY - 20,
      data: svgPath,
      scale: { x: 1.5, y: 1.5 },
      fill: gradientColor.start,
      ...getFillStyle(),
      draggable: true
    }]);
    setSelectedId(id);
  };

  const shapes = [
    { name: 'Rectangle', icon: <Square className="h-3 w-3" />, action: addRectangle },
    { name: 'Cercle', icon: <CircleIcon className="h-3 w-3" />, action: addCircle },
    { name: 'Triangle', icon: <Triangle className="h-3 w-3" />, action: addTriangle },
    { name: 'Étoile', icon: <Star className="h-3 w-3" />, action: addStar },
    { name: 'Cœur', icon: <Heart className="h-3 w-3" />, action: addHeart },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {shapes.map((shape) => (
        <Button 
          key={shape.name}
          onClick={shape.action}
          variant="outline" 
          size="sm"
          className="flex items-center gap-1 text-xs min-w-[90px]"
        >
          {shape.icon}
          {shape.name}
        </Button>
      ))}
    </div>
  );
}
