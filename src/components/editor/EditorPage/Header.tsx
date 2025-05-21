
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Share, Loader2 } from "lucide-react";

interface HeaderProps {
  isSaving: boolean;
  handleSave: () => void;
  handleShare: () => void;
}

const Header = ({ isSaving, handleSave, handleShare }: HeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-6 px-4 sm:px-0">
      <div className="flex items-center gap-2">
        <Link to="/events">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl md:text-2xl font-bold">Éditeur d'invitation</h1>
      </div>
      <div className="flex items-center gap-2 mt-2 md:mt-0">
        <Button 
          onClick={handleSave} 
          variant="outline"
          disabled={isSaving}
          size="sm"
          className="md:text-base"
        >
          {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Sauvegarder
        </Button>
        <Button 
          className="bg-invitation-purple hover:bg-invitation-purple-dark md:text-base"
          size="sm"
          onClick={handleShare}
        >
          <Share className="mr-2 h-4 w-4" /> Partager
        </Button>
      </div>
    </div>
  );
};

export default Header;
