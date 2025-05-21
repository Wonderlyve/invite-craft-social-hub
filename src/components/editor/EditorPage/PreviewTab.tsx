
import KonvaCanvas from "../KonvaCanvas";
import { Eye, Share } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PreviewTabProps {
  canvasData: any;
  onSaveCanvas: (canvasData: any) => void;
  handleShare: () => void;
}

const PreviewTab = ({ canvasData, onSaveCanvas, handleShare }: PreviewTabProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 md:mb-6 text-center max-w-md">
        <h3 className="text-xl font-semibold mb-2">Aperçu de l'invitation</h3>
        <p className="text-muted-foreground text-sm">
          Voici comment votre invitation sera présentée à vos invités.
        </p>
      </div>
      <div className="border border-border rounded-md p-4 md:p-8 bg-white shadow-md max-w-full overflow-x-auto">
        {canvasData ? (
          <div className="w-[300px] md:w-[600px] h-[400px] md:h-[800px] transform scale-[0.5] md:scale-100 origin-top-left md:origin-center">
            <KonvaCanvas 
              width={600} 
              height={800} 
              initialData={canvasData}
              onSave={onSaveCanvas}
            />
          </div>
        ) : (
          <img 
            src="/placeholder.svg" 
            alt="Aperçu de l'invitation" 
            className="w-[300px] md:w-[600px] h-[400px] md:h-[800px] object-contain"
          />
        )}
      </div>
      <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
        <Button variant="outline" size="sm" className="sm:text-base">
          <Eye className="mr-2 h-4 w-4" /> Prévisualiser par invité
        </Button>
        <Button 
          className="bg-invitation-purple hover:bg-invitation-purple-dark sm:text-base" 
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
