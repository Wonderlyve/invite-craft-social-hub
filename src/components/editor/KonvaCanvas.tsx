
import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image } from "react-konva";
import { useEditor } from "./EditorContext";
import Konva from "konva";
import TransformerComponent from "./transformer/TransformerComponent";
import ShapeRenderer from "./shapes/ShapeRenderer";
import { useCanvasHandlers } from "./hooks/useCanvasHandlers";
import useImage from "use-image";

interface KonvaCanvasProps {
  width: number;
  height: number;
  initialData?: any;
  onSave: (canvasData: any) => void;
}

const KonvaCanvas = ({ width, height, initialData, onSave }: KonvaCanvasProps) => {
  const { 
    selectedId, 
    setSelectedId, 
    objects, 
    setObjects, 
    zoomScale,
    fontFamily
  } = useEditor();
  
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  
  // Calculer les dimensions pour s'adapter à l'écran sans scroll
  const maxWidth = window.innerWidth * 0.6; // 60% de la largeur de l'écran
  const maxHeight = window.innerHeight * 0.7; // 70% de la hauteur de l'écran
  
  const aspectRatio = width / height;
  let canvasWidth = maxWidth;
  let canvasHeight = maxWidth / aspectRatio;
  
  if (canvasHeight > maxHeight) {
    canvasHeight = maxHeight;
    canvasWidth = maxHeight * aspectRatio;
  }
  
  const [canvasSize, setCanvasSize] = useState({ 
    width: canvasWidth, 
    height: canvasHeight 
  });
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [bgImage] = useImage(backgroundImage || '');
  
  const {
    handleObjectChange,
    handleStageMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isDragging,
    stagePos
  } = useCanvasHandlers(stageRef, layerRef);

  useEffect(() => {
    if (initialData && initialData.objects) {
      setObjects(initialData.objects);
      if (initialData.backgroundImage) {
        setBackgroundImage(initialData.backgroundImage);
      }
    }
  }, [initialData, setObjects]);

  useEffect(() => {
    const newMaxWidth = window.innerWidth * 0.6;
    const newMaxHeight = window.innerHeight * 0.7;
    
    let newCanvasWidth = newMaxWidth;
    let newCanvasHeight = newMaxWidth / aspectRatio;
    
    if (newCanvasHeight > newMaxHeight) {
      newCanvasHeight = newMaxHeight;
      newCanvasWidth = newMaxHeight * aspectRatio;
    }
    
    setCanvasSize({
      width: newCanvasWidth * zoomScale,
      height: newCanvasHeight * zoomScale
    });
  }, [width, height, zoomScale, aspectRatio]);

  const handleExportClick = () => {
    if (!stageRef.current) return;
    
    const canvasData = {
      objects,
      width,
      height,
      backgroundImage
    };
    
    onSave(canvasData);
  };

  const updateBackgroundImage = (image: string) => {
    setBackgroundImage(image);
  };

  // Calculer le scale pour l'affichage
  const displayScale = Math.min(canvasSize.width / width, canvasSize.height / height);

  return (
    <div
      className="relative border rounded-md overflow-hidden bg-white shadow-sm flex justify-center items-center"
      style={{ 
        width: canvasSize.width, 
        height: canvasSize.height,
        maxWidth: '100%',
        maxHeight: '100%'
      }}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        scaleX={displayScale * zoomScale}
        scaleY={displayScale * zoomScale}
        x={stagePos.x}
        y={stagePos.y}
        style={{ touchAction: 'none' }}
      >
        <Layer ref={layerRef}>
          {bgImage && (
            <Image
              image={bgImage}
              width={width}
              height={height}
              opacity={0.5}
            />
          )}
          
          {objects.map(obj => (
            <ShapeRenderer
              key={obj.id}
              obj={obj}
              setSelectedId={setSelectedId}
              handleObjectChange={handleObjectChange}
              isSelected={obj.id === selectedId}
              fontFamily={fontFamily}
            />
          ))}
          <TransformerComponent selectedId={selectedId} />
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;
