
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

interface GradientColor {
  start: string;
  end: string;
  type: 'linear' | 'radial';
  angle: number;
}

interface EditorContextType {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  objects: any[];
  setObjects: Dispatch<SetStateAction<any[]>>;
  layers: any[];
  setLayers: Dispatch<SetStateAction<any[]>>;
  zoomScale: number;
  setZoomScale: Dispatch<SetStateAction<number>>;
  fontFamily: string;
  setFontFamily: Dispatch<SetStateAction<string>>;
  gradientColor: GradientColor;
  setGradientColor: Dispatch<SetStateAction<GradientColor>>;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [layers, setLayers] = useState<any[]>([]);
  const [zoomScale, setZoomScale] = useState(1);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [gradientColor, setGradientColor] = useState<GradientColor>({
    start: "#ffffff",
    end: "#000000",
    type: "linear",
    angle: 0
  });

  return (
    <EditorContext.Provider value={{
      selectedId,
      setSelectedId,
      objects,
      setObjects,
      layers,
      setLayers,
      zoomScale,
      setZoomScale,
      fontFamily,
      setFontFamily,
      gradientColor,
      setGradientColor
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider");
  }
  return context;
};
