
import React from 'react';
import { Circle, Rect, Text, Image } from 'react-konva';

interface CircleProps {
  x: number;
  y: number;
  radius: number;
  fill: string;
  id: string;
  draggable: boolean;
  onDragStart: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
}

interface RectangleProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  id: string;
  draggable: boolean;
  onDragStart: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
}

interface TextProps {
  x: number;
  y: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  id: string;
  draggable: boolean;
  onDragStart: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
  rotation: number;
}

interface ImageProps {
  x: number;
  y: number;
  width: number;
  height: number;
  image: HTMLImageElement | null;
  id: string;
  draggable: boolean;
  onDragStart: (e: any) => void;
  onDragEnd: (e: any) => void;
  onClick: (e: any) => void;
  rotation: number;
}

// Composant principal qui rend les différentes formes
interface ShapeRendererProps {
  obj: any;
  setSelectedId: (id: string | null) => void;
  handleObjectChange: (id: string, newProps: any) => void;
  isSelected: boolean;
  fontFamily: string;
}

// Fonction pour déterminer le type d'objet et rendre le composant approprié
const ShapeRenderer: React.FC<ShapeRendererProps> = ({ 
  obj, 
  setSelectedId, 
  handleObjectChange, 
  isSelected,
  fontFamily
}) => {
  const commonProps = {
    id: obj.id,
    draggable: true,
    onDragStart: () => setSelectedId(obj.id),
    onDragEnd: (e: any) => {
      handleObjectChange(obj.id, {
        x: e.target.x(),
        y: e.target.y()
      });
    },
    onClick: () => setSelectedId(obj.id)
  };

  switch (obj.type) {
    case 'circle':
      return (
        <Circle
          {...commonProps}
          x={obj.x}
          y={obj.y}
          radius={obj.radius || 50}
          fill={obj.fill}
        />
      );
    
    case 'rect':
      return (
        <Rect
          {...commonProps}
          x={obj.x}
          y={obj.y}
          width={obj.width}
          height={obj.height}
          fill={obj.fill}
        />
      );
    
    case 'text':
      return (
        <Text
          {...commonProps}
          x={obj.x}
          y={obj.y}
          text={obj.text}
          fontSize={obj.fontSize}
          fontFamily={obj.fontFamily || fontFamily}
          fill={obj.fill}
          rotation={obj.rotation || 0}
        />
      );
    
    case 'image':
      const imageElement = new window.Image();
      imageElement.src = obj.src;
      
      return (
        <Image
          {...commonProps}
          x={obj.x}
          y={obj.y}
          image={imageElement}
          width={obj.width}
          height={obj.height}
          rotation={obj.rotation || 0}
        />
      );
    
    default:
      return null;
  }
};

export default ShapeRenderer;
