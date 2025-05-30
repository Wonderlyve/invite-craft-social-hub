
import { useEffect, useRef, useState } from "react";
import { Stage, Layer } from "react-konva";
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
  // Référence à l'image de fond
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

  // Chargement des données initiales
  useEffect(() => {
    if (initialData && initialData.objects) {
      setObjects(initialData.objects);
      if (initialData.backgroundImage) {
        setBackgroundImage(initialData.backgroundImage);
      }
    }
  }, [initialData, setObjects]);

  // Adapter la taille du canvas au zoom
  useEffect(() => {
    setCanvasSize({
      width: width * zoomScale,
      height: height * zoomScale
    });
  }, [width, height, zoomScale]);

  const handleExportClick = () => {
    if (!stageRef.current) return;
    
    // Sauvegarder les données du canvas
    const canvasData = {
      objects,
      width,
      height,
      backgroundImage
    };
    
    onSave(canvasData);
  };

  // Mettre à jour l'image de fond
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
          {/* Afficher l'image de fond si elle existe */}
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
