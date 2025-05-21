
import { RefObject, useState } from "react";
import { useEditor } from "../EditorContext";
import { toast } from "sonner";
import Konva from "konva";

interface CanvasHandlers {
  handleObjectChange: (id: string, newProps: any) => void;
  handleStageMouseDown: (e: Konva.KonvaEventObject<MouseEvent>) => void;
  handleTouchStart: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  handleTouchMove: (e: Konva.KonvaEventObject<TouchEvent>) => void;
  handleTouchEnd: () => void;
  isDragging: boolean;
  stagePos: { x: number; y: number };
}

export const useCanvasHandlers = (
  stageRef: RefObject<Konva.Stage>,
  layerRef: RefObject<Konva.Layer>
): CanvasHandlers => {
  const { selectedId, setSelectedId, objects, setObjects, zoomScale, setZoomScale } = useEditor();
  
  const [isDragging, setIsDragging] = useState(false);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  
  // Gérer le pinch zoom
  const lastCenter = { x: 0, y: 0 };
  const lastDist = { current: 0 };

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
    
    const clickedOnTransformer = e.target.getParent()?.className === 'Transformer';
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
      
      lastCenter.x = (p1.x + p2.x) / 2;
      lastCenter.y = (p1.y + p2.y) / 2;
      
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
      
      const scale = zoomScale * (dist / lastDist.current);
      
      setZoomScale(Math.min(Math.max(scale, 0.5), 3));
      
      lastDist.current = dist;
      lastCenter.x = newCenter.x;
      lastCenter.y = newCenter.y;
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

  // Effet pour gérer les touches du clavier pour supprimer
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
      setObjects(objects.filter(obj => obj.id !== selectedId));
      setSelectedId(null);
      toast.success("Élément supprimé");
    }
  });
  
  return {
    handleObjectChange,
    handleStageMouseDown,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    isDragging,
    stagePos
  };
};
