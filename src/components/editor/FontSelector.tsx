
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
  // Nouvelles typographies script et signature
  "Dancing Script",
  "Great Vibes",
  "Allura",
  "Alex Brush",
  "Pacifico",
  "Kaushan Script",
  "Satisfy",
  "Caveat",
  "Handlee",
  "Indie Flower",
  "Shadows Into Light",
  "Amatic SC",
  "Permanent Marker",
  "Kalam",
  "Crafty Girls",
  "Cookie",
  "Yellowtail",
  "Pinyon Script",
  "Sacramento",
  "Tangerine"
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
        <SelectContent className="max-h-60">
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
