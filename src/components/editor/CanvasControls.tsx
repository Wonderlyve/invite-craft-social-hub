
import { useEditor } from "./EditorContext";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CanvasControlsProps {
  onSave: () => void;
}

export default function CanvasControls({ onSave }: CanvasControlsProps) {
  const { zoomScale, setZoomScale, setObjects, selectedId, setSelectedId } = useEditor();

  const handleZoomIn = () => {
    if (zoomScale < 3) {
      setZoomScale(Math.min(zoomScale + 0.1, 3));
    }
  };

  const handleZoomOut = () => {
    if (zoomScale > 0.5) {
      setZoomScale(Math.max(zoomScale - 0.1, 0.5));
    }
  };

  const handleSave = () => {
    onSave();
    toast.success("Modifications sauvegardées");
  };

  const handleClear = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer tous les éléments ?")) {
      setObjects([]);
      setSelectedId(null);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedId) {
      setObjects(prev => prev.filter(obj => obj.id !== selectedId));
      setSelectedId(null);
      toast.success("Élément supprimé");
    } else {
      toast.warning("Veuillez sélectionner un élément");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center space-x-1">
        <Button variant="outline" size="sm" onClick={handleZoomOut}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="text-xs font-medium w-16 text-center">
          {Math.round(zoomScale * 100)}%
        </span>
        <Button variant="outline" size="sm" onClick={handleZoomIn}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>

      <Button 
        variant={selectedId ? "destructive" : "outline"} 
        size="sm" 
        onClick={handleDeleteSelected}
        disabled={!selectedId}
      >
        <Trash2 className="h-4 w-4 mr-1" /> 
        {selectedId ? "Supprimer" : "Sélectionner"}
      </Button>

      <Button 
        className="ml-auto bg-invitation-purple hover:bg-invitation-purple-dark"
        size="sm"
        onClick={handleSave}
      >
        <Save className="h-4 w-4 mr-1" /> Sauvegarder
      </Button>
    </div>
  );
}
