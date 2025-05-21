
import { useEffect, useRef } from "react";
import { Transformer } from "react-konva";

interface TransformerComponentProps {
  selectedId: string | null;
}

const TransformerComponent = ({ selectedId }: TransformerComponentProps) => {
  const transformerRef = useRef<any>(null);
  
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const stage = transformerRef.current.getStage();
      const selectedNode = stage.findOne('#' + selectedId);
      
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer()?.batchDraw();
      } else {
        transformerRef.current.nodes([]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedId]);
  
  return (
    <Transformer
      ref={transformerRef}
      boundBoxFunc={(oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      }}
    />
  );
};

export default TransformerComponent;
