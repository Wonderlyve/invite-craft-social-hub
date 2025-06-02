
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Share, Loader2 } from "lucide-react";

interface HeaderProps {
  isSaving: boolean;
  handleSave: () => void;
  handleShare: () => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Header = ({ isSaving, handleSave, handleShare, activeTab, setActiveTab }: HeaderProps) => {
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
      
      {/* Navigation et actions sur la même ligne */}
      <div className="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
        {/* Onglets Éditeur/Aperçu */}
        {setActiveTab && (
          <div className="flex bg-muted rounded-md p-1 flex-1 md:flex-initial">
            <Button
              variant={activeTab === "editor" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("editor")}
              className="flex-1 md:flex-initial text-sm"
            >
              Éditeur
            </Button>
            <Button
              variant={activeTab === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("preview")}
              className="flex-1 md:flex-initial text-sm"
            >
              Aperçu
            </Button>
          </div>
        )}
        
        {/* Actions avec icônes */}
        <Button 
          onClick={handleSave} 
          variant="outline"
          disabled={isSaving}
          size="sm"
          className="p-2"
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        </Button>
        <Button 
          className="bg-invitation-purple hover:bg-invitation-purple-dark p-2"
          size="sm"
          onClick={handleShare}
        >
          <Share className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
