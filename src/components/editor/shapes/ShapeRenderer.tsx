
import { Text, Rect, Circle, Image, Star, Path, Group, Line } from "react-konva";
import useImage from "use-image";

interface ShapeRendererProps {
  obj: any;
  setSelectedId: (id: string | null) => void;
  handleObjectChange: (id: string, newProps: any) => void;
  isSelected: boolean;
  fontFamily: string;
}

const ShapeRenderer = ({ obj, setSelectedId, handleObjectChange, isSelected, fontFamily }: ShapeRendererProps) => {
  // Appliquer la police de caractères active pour les nouveaux textes
  if (obj.type === 'text' && isSelected) {
    obj.fontFamily = fontFamily;
  }
  
  switch (obj.type) {
    case 'text':
      return (
        <Text
          key={obj.id}
          id={obj.id}
          x={obj.x}
          y={obj.y}
          text={obj.text}
          fontSize={obj.fontSize}
          fontFamily={obj.fontFamily || 'Arial'}
          fill={obj.fill}
          draggable={true}
          onClick={() => setSelectedId(obj.id)}
          onTap={() => setSelectedId(obj.id)}
          onDragEnd={(e) => {
            handleObjectChange(obj.id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransform={(e) => {
            const node = e.target;
            handleObjectChange(obj.id, {
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              width: node.width() * node.scaleX(),
              height: node.height() * node.scaleY(),
              scaleX: 1,
              scaleY: 1,
            });
          }}
        />
      );
      
    case 'rect':
      return (
        <Rect
          key={obj.id}
          id={obj.id}
          x={obj.x}
          y={obj.y}
          width={obj.width}
          height={obj.height}
          fill={obj.fill}
          fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
          fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
          fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
          fillRadialGradientStartPoint={obj.fillRadialGradientStartPoint}
          fillRadialGradientStartRadius={obj.fillRadialGradientStartRadius}
          fillRadialGradientEndPoint={obj.fillRadialGradientEndPoint}
          fillRadialGradientEndRadius={obj.fillRadialGradientEndRadius}
          fillRadialGradientColorStops={obj.fillRadialGradientColorStops}
          draggable={true}
          onClick={() => setSelectedId(obj.id)}
          onTap={() => setSelectedId(obj.id)}
          onDragEnd={(e) => {
            handleObjectChange(obj.id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransform={(e) => {
            const node = e.target;
            handleObjectChange(obj.id, {
              x: node.x(),
              y: node.y(),
              rotation: node.rotation(),
              width: node.width() * node.scaleX(),
              height: node.height() * node.scaleY(),
              scaleX: 1,
              scaleY: 1,
            });
          }}
        />
      );
      
    case 'circle':
      return (
        <Circle
          key={obj.id}
          id={obj.id}
          x={obj.x}
          y={obj.y}
          radius={obj.radius}
          fill={obj.fill}
          fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
          fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
          fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
          fillRadialGradientStartPoint={obj.fillRadialGradientStartPoint}
          fillRadialGradientStartRadius={obj.fillRadialGradientStartRadius}
          fillRadialGradientEndPoint={obj.fillRadialGradientEndPoint}
          fillRadialGradientEndRadius={obj.fillRadialGradientEndRadius}
          fillRadialGradientColorStops={obj.fillRadialGradientColorStops}
          draggable={true}
          onClick={() => setSelectedId(obj.id)}
          onTap={() => setSelectedId(obj.id)}
          onDragEnd={(e) => {
            handleObjectChange(obj.id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransform={(e) => {
            const node = e.target;
            const scaleX = node.scaleX();
            handleObjectChange(obj.id, {
              x: node.x(),
              y: node.y(),
              radius: node.radius() * scaleX,
              scaleX: 1,
              scaleY: 1,
            });
          }}
        />
      );
      
    case 'image': {
      // Utilisez un hook personnalisé pour l'image
      const ImageWithSrc = () => {
        const [image] = useImage(obj.src);
        
        return (
          <Image
            id={obj.id}
            x={obj.x}
            y={obj.y}
            width={obj.width}
            height={obj.height}
            image={image}
            draggable={true}
            onClick={() => setSelectedId(obj.id)}
            onTap={() => setSelectedId(obj.id)}
            onDragEnd={(e) => {
              handleObjectChange(obj.id, {
                x: e.target.x(),
                y: e.target.y(),
              });
            }}
            onTransform={(e) => {
              const node = e.target;
              handleObjectChange(obj.id, {
                x: node.x(),
                y: node.y(),
                rotation: node.rotation(),
                width: node.width() * node.scaleX(),
                height: node.height() * node.scaleY(),
                scaleX: 1,
                scaleY: 1,
              });
            }}
          />
        );
      };
      
      return <ImageWithSrc key={obj.id} />;
    }
      
    case 'star':
      return (
        <Star
          key={obj.id}
          id={obj.id}
          x={obj.x}
          y={obj.y}
          numPoints={obj.numPoints || 5}
          innerRadius={obj.innerRadius || 20}
          outerRadius={obj.outerRadius || 40}
          fill={obj.fill}
          fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
          fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
          fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
          draggable={true}
          onClick={() => setSelectedId(obj.id)}
          onTap={() => setSelectedId(obj.id)}
          onDragEnd={(e) => {
            handleObjectChange(obj.id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        />
      );
      
    case 'path':
      return (
        <Path
          key={obj.id}
          id={obj.id}
          x={obj.x}
          y={obj.y}
          data={obj.data}
          fill={obj.fill}
          scale={obj.scale}
          fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
          fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
          fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
          draggable={true}
          onClick={() => setSelectedId(obj.id)}
          onTap={() => setSelectedId(obj.id)}
          onDragEnd={(e) => {
            handleObjectChange(obj.id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        />
      );
      
    case 'polygon':
      return (
        <Group
          key={obj.id}
          id={obj.id}
          x={obj.x}
          y={obj.y}
          draggable={true}
          onClick={() => setSelectedId(obj.id)}
          onTap={() => setSelectedId(obj.id)}
          onDragEnd={(e) => {
            handleObjectChange(obj.id, {
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
        >
          <Line
            points={obj.points}
            fill={obj.fill}
            closed={true}
            fillLinearGradientStartPoint={obj.fillLinearGradientStartPoint}
            fillLinearGradientEndPoint={obj.fillLinearGradientEndPoint}
            fillLinearGradientColorStops={obj.fillLinearGradientColorStops}
          />
        </Group>
      );

    default:
      return null;
  }
};

export default ShapeRenderer;
