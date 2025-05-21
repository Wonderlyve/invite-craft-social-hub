
import { createContext, useContext, useState, ReactNode } from "react";

interface EditorContextType {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  objects: any[];
  setObjects: (objects: any[]) => void;
  layers: any[];
  setLayers: (layers: any[]) => void;
  zoomScale: number;
  setZoomScale: (scale: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  gradientColor: {
    start: string;
    end: string;
    type: 'linear' | 'radial';
    angle: number;
  };
  setGradientColor: (gradient: {
    start: string;
    end: string;
    type: 'linear' | 'radial';
    angle: number;
  }) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [layers, setLayers] = useState<any[]>([]);
  const [zoomScale, setZoomScale] = useState(1);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [gradientColor, setGradientColor] = useState({
    start: "#ffffff",
    end: "#000000",
    type: "linear" as const,
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
