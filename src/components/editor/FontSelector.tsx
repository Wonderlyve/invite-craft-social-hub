
import { useEditor } from "./EditorContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const FONT_FAMILIES = [
  "Arial",
  "Times New Roman",
  "Courier New",
  "Georgia",
  "Verdana",
  "Helvetica",
  "Poppins",
  "Roboto",
  "Open Sans",
  "Montserrat",
  "Playfair Display",
];

export default function FontSelector() {
  const { fontFamily, setFontFamily } = useEditor();
  
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-1">Police</label>
      <Select value={fontFamily} onValueChange={setFontFamily}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choisir une police" />
        </SelectTrigger>
        <SelectContent>
          {FONT_FAMILIES.map((font) => (
            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
