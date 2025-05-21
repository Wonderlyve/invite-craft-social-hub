
import { Card } from "@/components/ui/card";
import KonvaCanvas from "../KonvaCanvas";
import CanvasControls from "../CanvasControls";
import ToolPanel from "./ToolPanel";
import MobileToolbar from "../MobileToolbar";

interface EditorTabProps {
  canvasData: any;
  onSaveCanvas: (canvasData: any) => void;
  onTextAdd: () => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
}

const EditorTab = ({ canvasData, onSaveCanvas, onTextAdd, onImageUpload, handleSave }: EditorTabProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Zone d'édition principale */}
      <Card className="lg:col-span-3 p-2 sm:p-4">
        {canvasData && (
          <>
            <div className="mb-3">
              <CanvasControls
                onSave={handleSave} 
              />
            </div>
            <div className="flex justify-center">
              <KonvaCanvas 
                width={600} 
                height={800} 
                initialData={canvasData}
                onSave={onSaveCanvas}
              />
            </div>
          </>
        )}
      </Card>
      
      {/* Panneau latéral des outils - visible seulement sur desktop */}
      <ToolPanel 
        onTextAdd={onTextAdd} 
        onImageUpload={onImageUpload} 
      />
      
      {/* Toolbar pour mobile */}
      <MobileToolbar onTextAdd={onTextAdd} onImageUpload={onImageUpload} />
    </div>
  );
};

export default EditorTab;
