
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

  const addRectangle = () => {
    const id = `rect-${Date.now()}`;
    setObjects([...objects, {
      id,
      type: 'rect',
      x: 100,
      y: 100,
      width: 100,
      height: 100,
      fill: gradientColor.start, // Couleur de base
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
      x: 100,
      y: 100,
      radius: 50,
      fill: gradientColor.start, // Couleur de base
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
      x: 100,
      y: 100,
      points: [0, 0, 50, 86, 100, 0],
      fill: gradientColor.start,
      ...getFillStyle(),
      draggable: true
    }]);
    setSelectedId(id);
  };

  const addStar = () => {
    const id = `star-${Date.now()}`;
    const radius = 50;
    const innerRadius = radius / 2;
    const points = [];
    
    for (let i = 0; i < 5; i++) {
      const angle = Math.PI * 2 * i / 5 - Math.PI / 2;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(x, y);
      
      const innerAngle = angle + Math.PI / 5;
      const innerX = innerRadius * Math.cos(innerAngle);
      const innerY = innerRadius * Math.sin(innerAngle);
      points.push(innerX, innerY);
    }
    
    setObjects([...objects, {
      id,
      type: 'star',
      x: 100,
      y: 100,
      numPoints: 5,
      innerRadius: 20,
      outerRadius: 40,
      fill: gradientColor.start,
      ...getFillStyle(),
      draggable: true
    }]);
    setSelectedId(id);
  };

  const addHeart = () => {
    // Forme de cœur approximative en SVG
    const id = `heart-${Date.now()}`;
    const svgPath = "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
    
    setObjects([...objects, {
      id,
      type: 'path',
      x: 100,
      y: 100,
      data: svgPath,
      scale: { x: 2, y: 2 },
      fill: gradientColor.start,
      ...getFillStyle(),
      draggable: true
    }]);
    setSelectedId(id);
  };

  const shapes = [
    { name: 'Rectangle', icon: <Square className="h-4 w-4" />, action: addRectangle },
    { name: 'Cercle', icon: <CircleIcon className="h-4 w-4" />, action: addCircle },
    { name: 'Triangle', icon: <Triangle className="h-4 w-4" />, action: addTriangle },
    { name: 'Étoile', icon: <Star className="h-4 w-4" />, action: addStar },
    { name: 'Cœur', icon: <Heart className="h-4 w-4" />, action: addHeart },
    { name: 'Hexagone', icon: <Hexagon className="h-4 w-4" />, action: addCircle },
    { name: 'Pentagon', icon: <Pentagon className="h-4 w-4" />, action: addCircle },
    { name: 'Octogone', icon: <Octagon className="h-4 w-4" />, action: addCircle }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {shapes.map((shape) => (
        <Button 
          key={shape.name}
          onClick={shape.action}
          variant="outline" 
          size="sm"
          className="flex items-center gap-2 min-w-[120px]"
        >
          {shape.icon}
          {shape.name}
        </Button>
      ))}
    </div>
  );
}
