
import React, { useState } from 'react';
import { Circle, Rect, Text, Image, Group } from 'react-konva';
import { useLongPress } from '../hooks/useLongPress';
import AdvancedEditOptions from '../AdvancedEditOptions';

interface ShapeRendererProps {
  obj: any;
  setSelectedId: (id: string | null) => void;
  handleObjectChange: (id: string, newProps: any) => void;
  isSelected: boolean;
  fontFamily: string;
}

const ShapeRenderer: React.FC<ShapeRendererProps> = ({ 
  obj, 
  setSelectedId, 
  handleObjectChange, 
  isSelected,
  fontFamily
}) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const longPressProps = useLongPress({
    onLongPress: () => setShowAdvancedOptions(true),
    onClick: () => setSelectedId(obj.id),
    delay: 800
  });

  const commonProps = {
    id: obj.id,
    draggable: true,
    opacity: obj.opacity || 1,
    rotation: obj.rotation || 0,
    onDragStart: () => setSelectedId(obj.id),
    onDragEnd: (e: any) => {
      handleObjectChange(obj.id, {
        x: e.target.x(),
        y: e.target.y()
      });
    },
    onClick: () => setSelectedId(obj.id),
    ...longPressProps
  };

  const renderFrame = (children: React.ReactNode) => {
    if (!obj.frame || obj.frame.type === 'none') {
      return children;
    }

    const { type, color, thickness } = obj.frame;
    const frameProps = {
      x: obj.x - thickness,
      y: obj.y - thickness,
      stroke: color,
      strokeWidth: thickness,
      fill: 'transparent'
    };

    let frameComponent;
    switch (type) {
      case 'round':
        frameComponent = (
          <Circle
            {...frameProps}
            x={obj.x}
            y={obj.y}
            radius={(obj.width || obj.radius || 50) + thickness}
          />
        );
        break;
      case 'diamond':
        const size = (obj.width || obj.radius || 50) + thickness;
        frameComponent = (
          <Rect
            {...frameProps}
            width={size * 2}
            height={size * 2}
            rotation={45}
            offsetX={size}
            offsetY={size}
          />
        );
        break;
      default: // square
        frameComponent = (
          <Rect
            {...frameProps}
            width={(obj.width || 100) + thickness * 2}
            height={(obj.height || 100) + thickness * 2}
          />
        );
    }

    return (
      <Group>
        {frameComponent}
        {children}
      </Group>
    );
  };

  const renderShape = () => {
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
          />
        );
      
      case 'image':
        const imageElement = new window.Image();
        imageElement.src = obj.src;
        
        const imageComponent = (
          <Image
            {...commonProps}
            x={obj.x}
            y={obj.y}
            image={imageElement}
            width={obj.width}
            height={obj.height}
          />
        );

        return obj.type === 'image' ? renderFrame(imageComponent) : imageComponent;
      
      default:
        return null;
    }
  };

  return (
    <>
      {renderShape()}
      <AdvancedEditOptions
        isOpen={showAdvancedOptions}
        onClose={() => setShowAdvancedOptions(false)}
        selectedObject={obj}
      />
    </>
  );
};

export default ShapeRenderer;
