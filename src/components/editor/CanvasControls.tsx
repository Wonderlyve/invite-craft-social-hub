
import { useEditor } from "./EditorContext";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Save, Trash2, Image } from "lucide-react";
import { toast } from "sonner";

interface CanvasControlsProps {
  onSave: () => void;
  onBackgroundImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CanvasControls({ onSave, onBackgroundImageUpload }: CanvasControlsProps) {
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
    <div className="flex items-center justify-between w-full bg-white border rounded-lg p-2 shadow-sm">
      {/* Contrôles de zoom */}
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

      {/* Contrôles centraux */}
      <div className="flex items-center space-x-2">
        <Button 
          variant={selectedId ? "destructive" : "outline"} 
          size="sm" 
          onClick={handleDeleteSelected}
          disabled={!selectedId}
        >
          <Trash2 className="h-4 w-4" /> 
        </Button>

        {onBackgroundImageUpload && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild
          >
            <label className="flex items-center gap-1 cursor-pointer">
              <Image className="h-4 w-4" />
              Fond
              <input 
                type="file" 
                className="hidden" 
                accept="image/*" 
                onChange={onBackgroundImageUpload} 
              />
            </label>
          </Button>
        )}
      </div>

      {/* Bouton sauvegarder */}
      <Button 
        className="bg-invitation-purple hover:bg-invitation-purple-dark"
        size="sm"
        onClick={handleSave}
      >
        <Save className="h-4 w-4 mr-1" /> Sauvegarder
      </Button>
    </div>
  );
}
