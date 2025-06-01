
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
  
  const [canvasSize, setCanvasSize] = useState({ width, height });
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
    setCanvasSize({
      width: width * zoomScale,
      height: height * zoomScale
    });
  }, [width, height, zoomScale]);

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

  return (
    <div
      className="relative border rounded-md overflow-hidden bg-white shadow-sm flex justify-center"
      style={{ width: '100%', overflow: 'hidden' }}
    >
      <Stage
        ref={stageRef}
        width={canvasSize.width}
        height={canvasSize.height}
        onMouseDown={handleStageMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        scaleX={zoomScale}
        scaleY={zoomScale}
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
