import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Rect, Circle, Image as KonvaImage, Star, Path, Group, Line } from "react-konva";
import { useEditor } from "./EditorContext";
import Konva from "konva";
import { toast } from "sonner";
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
    setZoomScale,
    fontFamily,
    gradientColor
  } = useEditor();
  
  const stageRef = useRef<Konva.Stage>(null);
  const layerRef = useRef<Konva.Layer>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  
  const [canvasSize, setCanvasSize] = useState({ width, height });
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  // Gérer le pinch zoom
  const lastCenter = useRef({ x: 0, y: 0 });
  const lastDist = useRef(0);

  // Chargement des données initiales
  useEffect(() => {
    if (initialData && initialData.objects) {
      setObjects(initialData.objects);
    }
  }, [initialData, setObjects]);

  // Adapter la taille du canvas au zoom
  useEffect(() => {
    setCanvasSize({
      width: width * zoomScale,
      height: height * zoomScale
    });
  }, [width, height, zoomScale]);

  // Gérer le transformer pour l'élément sélectionné
  useEffect(() => {
    if (!transformerRef.current || !layerRef.current || selectedId === null) return;

    const node = layerRef.current.findOne(`#${selectedId}`);
    if (node) {
      transformerRef.current.nodes([node]);
      transformerRef.current.getLayer()?.batchDraw();
    } else {
      transformerRef.current.nodes([]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [selectedId, objects]);

  // Gérer les touches du clavier pour supprimer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        setObjects(objects.filter(obj => obj.id !== selectedId));
        setSelectedId(null);
        toast.success("Élément supprimé");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, objects, setObjects, setSelectedId]);

  const handleObjectChange = (id: string, newProps: any) => {
    setObjects(
      objects.map(obj => (obj.id === id ? { ...obj, ...newProps } : obj))
    );
  };

  const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    // Clic sur le stage lui-même et non sur un shape
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      return;
    }
    
    const clickedOnTransformer = e.target.getParent().className === 'Transformer';
    if (clickedOnTransformer) return;
    
    const id = e.target.id();
    if (id) {
      setSelectedId(id);
    }
  };

  const handleTouchStart = (e: Konva.KonvaEventObject<TouchEvent>) => {
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];
    
    if (touch1 && touch2) {
      // Pinch/zoom avec deux doigts
      const p1 = { x: touch1.clientX, y: touch1.clientY };
      const p2 = { x: touch2.clientX, y: touch2.clientY };
      
      lastCenter.current = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
      
      lastDist.current = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
      );
    } else if (e.target === e.target.getStage()) {
      // Déplacement avec un doigt sur l'arrière-plan
      setIsDragging(true);
    }
  };
  
  const handleTouchMove = (e: Konva.KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];
    
    if (touch1 && touch2) {
      // Pinch/zoom
      const p1 = { x: touch1.clientX, y: touch1.clientY };
      const p2 = { x: touch2.clientX, y: touch2.clientY };
      
      const newCenter = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
      };
      
      const dist = Math.sqrt(
        Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2)
      );
      
      if (!lastDist.current) return;
      
      const pointTo = {
        x: (newCenter.x - stageRef.current!.container().offsetLeft) / zoomScale,
        y: (newCenter.y - stageRef.current!.container().offsetTop) / zoomScale,
      };
      
      const scale = zoomScale * (dist / lastDist.current);
      
      setZoomScale(Math.min(Math.max(scale, 0.5), 3));
      
      lastDist.current = dist;
      lastCenter.current = newCenter;
    } else if (isDragging) {
      // Déplacement du canvas
      const stage = stageRef.current;
      if (!stage) return;
      
      const dx = touch1.clientX - touch1.clientX;
      const dy = touch1.clientY - touch1.clientY;
      
      setStagePos({
        x: stagePos.x + dx,
        y: stagePos.y + dy
      });
    }
  };
  
  const handleTouchEnd = () => {
    lastDist.current = 0;
    setIsDragging(false);
  };

  const handleExportClick = () => {
    if (!stageRef.current) return;
    
    // Sauvegarder les données du canvas
    const canvasData = {
      objects,
      width,
      height,
    };
    
    onSave(canvasData);
  };

  const renderShape = (obj: any) => {
    const isSelected = obj.id === selectedId;
    
    // Appliquer la police de caractères active pour les nouveaux textes
    if (obj.type === 'text' && isSelected) {
      obj.fontFamily = fontFamily;
    }
    
    switch (obj.type) {
      case 'text':
        return (
          <Text
            key={obj.id}
            id={obj.id}
            x={obj.x}
            y={obj.y}
            text={obj.text}
            fontSize={obj.fontSize}
            fontFamily={obj.fontFamily || 'Arial'}
            fill={obj.fill}
            draggable={true}
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => {
              handleObjectChange(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onTransform={(e) => {
              const node = e.target;
              handleObjectChange(obj.id, {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: node.width() * node.scaleX(),
                height: node.height() * node.scaleY(),
                scaleX: 1,
                scaleY: 1,
              });
            }}
          />
        );
        
      case 'rect':
        return (
          <Rect
            key={obj.id}
            id={obj.id}
            x={obj.x}
            y={obj.y}
            width={obj.width}
            height={obj.height}
            fill={obj.fill}
            fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
            fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
            fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
            fillRadialGradientStartPoint={obj.fillRadialGradientStartPoint}
            fillRadialGradientStartRadius={obj.fillRadialGradientStartRadius}
            fillRadialGradientEndPoint={obj.fillRadialGradientEndPoint}
            fillRadialGradientEndRadius={obj.fillRadialGradientEndRadius}
            fillRadialGradientColorStops={obj.fillRadialGradientColorStops}
            draggable={true}
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => {
              handleObjectChange(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onTransform={(e) => {
              const node = e.target;
              handleObjectChange(obj.id, {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: node.width() * node.scaleX(),
                height: node.height() * node.scaleY(),
                scaleX: 1,
                scaleY: 1,
              });
            }}
          />
        );
        
      case 'circle':
        return (
          <Circle
            key={obj.id}
            id={obj.id}
            x={obj.x}
            y={obj.y}
            radius={obj.radius}
            fill={obj.fill}
            fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
            fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
            fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
            fillRadialGradientStartPoint={obj.fillRadialGradientStartPoint}
            fillRadialGradientStartRadius={obj.fillRadialGradientStartRadius}
            fillRadialGradientEndPoint={obj.fillRadialGradientEndPoint}
            fillRadialGradientEndRadius={obj.fillRadialGradientEndRadius}
            fillRadialGradientColorStops={obj.fillRadialGradientColorStops}
            draggable={true}
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => {
              handleObjectChange(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onTransform={(e) => {
              const node = e.target;
              const scaleX = node.scaleX();
              // Correction: utiliser les méthodes appropriées pour Circle
              if (node instanceof Konva.Circle) {
                handleObjectChange(obj.id, {
                  x: node.x(),
                  y: node.y(),
                  radius: node.radius() * scaleX,
                  scaleX: 1,
                  scaleY: 1,
                });
              }
            }}
          />
        );
        
      case 'image':
        return (
          <KonvaImage
            key={obj.id}
            id={obj.id}
            x={obj.x}
            y={obj.y}
            width={obj.width}
            height={obj.height}
            image={(() => {
              const img = new window.Image();
              img.src = obj.src;
              return img;
            })()}
            draggable={true}
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => {
              handleObjectChange(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onTransform={(e) => {
              const node = e.target;
              handleObjectChange(obj.id, {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: node.width() * node.scaleX(),
                height: node.height() * node.scaleY(),
                scaleX: 1,
                scaleY: 1,
              });
            }}
          />
        );
        
      case 'star':
        return (
          <Star
            key={obj.id}
            id={obj.id}
            x={obj.x}
            y={obj.y}
            numPoints={obj.numPoints || 5}
            innerRadius={obj.innerRadius || 20}
            outerRadius={obj.outerRadius || 40}
            fill={obj.fill}
            fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
            fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
            fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
            draggable={true}
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => {
              handleObjectChange(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        );
        
      case 'path':
        return (
          <Path
            key={obj.id}
            id={obj.id}
            x={obj.x}
            y={obj.y}
            data={obj.data}
            fill={obj.fill}
            scale={obj.scale}
            fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
            fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
            fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
            draggable={true}
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => {
              handleObjectChange(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          />
        );
        
      case 'polygon':
        return (
          <Group
            key={obj.id}
            id={obj.id}
            x={obj.x}
            y={obj.y}
            draggable={true}
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => {
              handleObjectChange(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
          >
            <Line
              points={obj.points}
              fill={obj.fill}
              closed={true}
              fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
              fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
              fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
            />
          </Group>
        );

      default:
        return null;
    }
  };

  const TransformerComponent = ({ selectedId }) => {
    const transformerRef = useRef();
    
    useEffect(() => {
      if (selectedId && transformerRef.current) {
        const stage = transformerRef.current.getStage();
        const selectedNode = stage.findOne('#' + selectedId);
        
        if (selectedNode) {
          transformerRef.current.nodes([selectedNode]);
          transformerRef.current.getLayer().batchDraw();
        } else {
          transformerRef.current.nodes([]);
          transformerRef.current.getLayer().batchDraw();
        }
      }
    }, [selectedId]);
    
    return (
      <KonvaTransformer
        ref={transformerRef}
        boundBoxFunc={(oldBox, newBox) => {
          if (newBox.width < 5 || newBox.height < 5) {
            return oldBox;
          }
          return newBox;
        }}
      />
    );
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
          {objects.map(renderShape)}
          <TransformerComponent selectedId={selectedId} />
        </Layer>
      </Stage>
    </div>
  );
};

export default KonvaCanvas;
