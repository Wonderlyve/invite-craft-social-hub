
import KonvaCanvas from "../KonvaCanvas";
import { Eye, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewTabProps {
  canvasData: any;
  onSaveCanvas: (canvasData: any) => void;
  handleShare: () => void;
}

const PreviewTab = ({ canvasData, onSaveCanvas, handleShare }: PreviewTabProps) => {
  // Créer une version non-interactive du canvas data
  const previewCanvasData = canvasData ? {
    ...canvasData,
    objects: canvasData.objects?.map((obj: any) => ({
      ...obj,
      draggable: false,
      selectable: false
    }))
  } : null;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 md:mb-6 text-center max-w-md">
        <h3 className="text-xl font-semibold mb-2">Aperçu de l'invitation</h3>
        <p className="text-muted-foreground text-sm">
          Voici comment votre invitation sera présentée à vos invités.
        </p>
      </div>
      
      {/* Aperçu responsive avec format 1080x1800 */}
      <div className="border border-border rounded-md p-4 md:p-8 bg-white shadow-md max-w-full overflow-auto">
        {previewCanvasData ? (
          <div className="flex justify-center">
            <div className="relative">
              {/* Version mobile - réduite */}
              <div className="block md:hidden">
                <div className="w-[216px] h-[360px] transform scale-100 origin-center">
                  <KonvaCanvas 
                    width={1080} 
                    height={1800} 
                    initialData={previewCanvasData}
                    onSave={() => {}} // Pas de sauvegarde en mode aperçu
                  />
                </div>
              </div>
              
              {/* Version desktop - plus grande */}
              <div className="hidden md:block">
                <div className="w-[324px] h-[540px] transform scale-100 origin-center">
                  <KonvaCanvas 
                    width={1080} 
                    height={1800} 
                    initialData={previewCanvasData}
                    onSave={() => {}} // Pas de sauvegarde en mode aperçu
                  />
                </div>
              </div>
              
              {/* Indicateur de format */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                Format: 1080 × 1800 px
              </div>
            </div>
          </div>
        ) : (
          <img 
            src="/placeholder.svg" 
            alt="Aperçu de l'invitation" 
            className="w-[216px] md:w-[324px] h-[360px] md:h-[540px] object-contain"
          />
        )}
      </div>
      
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
        <Button variant="outline" size="sm" className="sm:text-base">
          <Eye className="mr-2 h-4 w-4" /> Prévisualiser par invité
        </Button>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 sm:text-base text-white" 
          size="sm"
          onClick={handleShare}
        >
          <Share className="mr-2 h-4 w-4" /> Partager les invitations
        </Button>
      </div>
    </div>
  );
};

export default PreviewTab;
