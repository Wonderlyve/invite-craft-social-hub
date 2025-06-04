
import { Button } from "@/components/ui/button";
import { Feather } from "lucide-react";

interface EditButtonProps {
  onClick: () => void;
  className?: string;
}

const EditButton = ({ onClick, className = "" }: EditButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={`
        w-12 h-12 rounded-full 
        bg-purple-600 hover:bg-purple-700 
        text-white shadow-lg 
        flex items-center justify-center
        transition-all duration-200
        hover:scale-105
        ${className}
      `}
      size="icon"
    >
      <Feather className="h-5 w-5" />
    </Button>
  );
};

export default EditButton;
