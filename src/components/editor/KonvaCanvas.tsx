
import { useEffect, useRef, useState, useCallback } from "react";
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
  const maxWidth = window.innerWidth * 0.6;
  const maxHeight = window.innerHeight * 0.7;
  
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
  const [history, setHistory] = useState<any[]>([]);
  const [historyStep, setHistoryStep] = useState(-1);
  
  const {
    handleObjectChange,
    handleStageMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isDragging,
    stagePos
  } = useCanvasHandlers(stageRef, layerRef);

  // Sauvegarde automatique avec debounce
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (canvasData: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSave(canvasData);
        }, 1000); // Sauvegarde après 1 seconde d'inactivité
      };
    })(),
    [onSave]
  );

  // Historique pour undo/redo
  const saveToHistory = useCallback(() => {
    const currentState = {
      objects: JSON.parse(JSON.stringify(objects)),
      backgroundImage,
      timestamp: Date.now()
    };
    
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(currentState);
      // Limiter l'historique à 50 états
      return newHistory.slice(-50);
    });
    setHistoryStep(prev => prev + 1);
  }, [objects, backgroundImage, historyStep]);

  const undo = useCallback(() => {
    if (historyStep > 0) {
      const previousState = history[historyStep - 1];
      setObjects(previousState.objects);
      setBackgroundImage(previousState.backgroundImage);
      setHistoryStep(prev => prev - 1);
    }
  }, [history, historyStep, setObjects]);

  const redo = useCallback(() => {
    if (historyStep < history.length - 1) {
      const nextState = history[historyStep + 1];
      setObjects(nextState.objects);
      setBackgroundImage(nextState.backgroundImage);
      setHistoryStep(prev => prev + 1);
    }
  }, [history, historyStep, setObjects]);

  // Raccourcis clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 'c':
            if (selectedId) {
              e.preventDefault();
              // Copier l'objet sélectionné
              const selectedObject = objects.find(obj => obj.id === selectedId);
              if (selectedObject) {
                localStorage.setItem('copiedObject', JSON.stringify(selectedObject));
              }
            }
            break;
          case 'v':
            e.preventDefault();
            // Coller l'objet copié
            const copiedObject = localStorage.getItem('copiedObject');
            if (copiedObject) {
              const obj = JSON.parse(copiedObject);
              const newId = `${obj.type}-${Date.now()}`;
              const pastedObj = {
                ...obj,
                id: newId,
                x: obj.x + 20,
                y: obj.y + 20
              };
              setObjects(prev => [...prev, pastedObj]);
              setSelectedId(newId);
            }
            break;
          case 'd':
            if (selectedId) {
              e.preventDefault();
              // Dupliquer l'objet sélectionné
              const selectedObject = objects.find(obj => obj.id === selectedId);
              if (selectedObject) {
                const newId = `${selectedObject.type}-${Date.now()}`;
                const duplicate = {
                  ...selectedObject,
                  id: newId,
                  x: selectedObject.x + 20,
                  y: selectedObject.y + 20
                };
                setObjects(prev => [...prev, duplicate]);
                setSelectedId(newId);
              }
            }
            break;
        }
      }
      
      // Supprimer avec Delete ou Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        setObjects(prev => prev.filter(obj => obj.id !== selectedId));
        setSelectedId(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, objects, setObjects, setSelectedId, undo, redo]);

  useEffect(() => {
    if (initialData && initialData.objects) {
      setObjects(initialData.objects);
      if (initialData.backgroundImage) {
        setBackgroundImage(initialData.backgroundImage);
      }
      // Sauvegarder l'état initial dans l'historique
      saveToHistory();
    }
  }, [initialData, setObjects]);

  // Sauvegarder dans l'historique quand les objets changent
  useEffect(() => {
    if (objects.length > 0) {
      const timeoutId = setTimeout(() => {
        saveToHistory();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [objects, saveToHistory]);

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

  // Sauvegarde automatique quand les objets changent
  useEffect(() => {
    const canvasData = {
      objects,
      width,
      height,
      backgroundImage
    };
    debouncedSave(canvasData);
  }, [objects, backgroundImage, width, height, debouncedSave]);

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

  // Calculer le scale pour l'affichage
  const displayScale = Math.min(canvasSize.width / width, canvasSize.height / height);

  // Grille d'assistance (optionnelle)
  const renderGrid = () => {
    if (!layerRef.current) return null;
    
    const gridSize = 20;
    const lines = [];
    
    // Lignes verticales
    for (let i = 0; i <= width; i += gridSize) {
      lines.push(
        <line
          key={`v-${i}`}
          x1={i}
          y1={0}
          x2={i}
          y2={height}
          stroke="#e5e7eb"
          strokeWidth={0.5}
          opacity={0.3}
        />
      );
    }
    
    // Lignes horizontales
    for (let i = 0; i <= height; i += gridSize) {
      lines.push(
        <line
          key={`h-${i}`}
          x1={0}
          y1={i}
          x2={width}
          y2={i}
          stroke="#e5e7eb"
          strokeWidth={0.5}
          opacity={0.3}
        />
      );
    }
    
    return lines;
  };

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
          {/* Image de fond */}
          {bgImage && (
            <Image
              image={bgImage}
              width={width}
              height={height}
              opacity={0.5}
            />
          )}
          
          {/* Objets du canvas */}
          {objects
            .filter(obj => obj.visible !== false)
            .map(obj => (
              <ShapeRenderer
                key={obj.id}
                obj={obj}
                setSelectedId={setSelectedId}
                handleObjectChange={handleObjectChange}
                isSelected={obj.id === selectedId}
                fontFamily={fontFamily}
              />
            ))}
          
          {/* Transformer pour la sélection */}
          <TransformerComponent selectedId={selectedId} />
        </Layer>
      </Stage>
      
      {/* Indicateur de format et raccourcis */}
      <div className="absolute top-2 left-2 space-y-1">
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded">
          {width} × {height} px
        </div>
        <div className="bg-black/70 text-white text-xs px-2 py-1 rounded opacity-75">
          Ctrl+Z: Annuler | Ctrl+C/V: Copier/Coller
        </div>
      </div>
      
      {/* Indicateur de sauvegarde automatique */}
      <div className="absolute top-2 right-2">
        <div className="bg-green-500/20 text-green-700 text-xs px-2 py-1 rounded flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          Sauvegarde auto
        </div>
      </div>
    </div>
  );
};

export default KonvaCanvas;
