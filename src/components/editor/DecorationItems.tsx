
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "./EditorContext";
import { useState } from "react";

const DECORATION_CATEGORIES = [
  {
    name: "Mariage",
    items: [
      { name: "Alliance", svg: "💍", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=100&h=100&fit=crop" },
      { name: "Gâteau", svg: "🎂", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop" },
      { name: "Champagne", svg: "🍾", image: "https://images.unsplash.com/photo-1549398499-6c1c25c00b25?w=100&h=100&fit=crop" },
      { name: "Fleurs", svg: "💐", image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=100&h=100&fit=crop" },
      { name: "Coeur", svg: "❤️", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=100&h=100&fit=crop" },
    ]
  },
  {
    name: "Anniversaire",
    items: [
      { name: "Ballon", svg: "🎈", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=100&h=100&fit=crop" },
      { name: "Cadeau", svg: "🎁", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=100&h=100&fit=crop" },
      { name: "Gâteau", svg: "🎂", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=100&h=100&fit=crop" },
      { name: "Confetti", svg: "🎉", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=100&h=100&fit=crop" },
      { name: "Chapeau", svg: "🎊", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=100&h=100&fit=crop" },
    ]
  },
  {
    name: "Nature",
    items: [
      { name: "Fleur", svg: "🌸", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=100&h=100&fit=crop" },
      { name: "Arbre", svg: "🌳", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=100&h=100&fit=crop" },
      { name: "Soleil", svg: "☀️", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop" },
      { name: "Nuage", svg: "☁️", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=100&h=100&fit=crop" },
      { name: "Feuille", svg: "🍃", image: "https://images.unsplash.com/photo-1440558899798-1cd6d4c3d15e?w=100&h=100&fit=crop" },
    ]
  },
  {
    name: "Images",
    items: [
      { name: "Élégance", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=200&h=300&fit=crop" },
      { name: "Moderne", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=300&fit=crop" },
      { name: "Nature", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=200&h=300&fit=crop" },
      { name: "Ocean", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=200&h=300&fit=crop" },
      { name: "Architecture", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=200&h=300&fit=crop" },
    ]
  },
];

export default function DecorationItems() {
  const { objects, setObjects, setSelectedId } = useEditor();
  const [activeCategory, setActiveCategory] = useState("Mariage");

  const addDecoration = (decoration: any) => {
    const id = `deco-${Date.now()}`;
    
    if (decoration.image && !decoration.svg) {
      // Ajouter une image
      setObjects([...objects, {
        id,
        type: 'image',
        x: 200,
        y: 200,
        src: decoration.image,
        width: 150,
        height: 200,
        draggable: true,
      }]);
    } else {
      // Ajouter un emoji/texte
      setObjects([...objects, {
        id,
        type: 'text',
        x: 200,
        y: 200,
        text: decoration.svg,
        fontSize: 60,
        draggable: true,
        width: 80,
      }]);
    }
    setSelectedId(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex overflow-x-auto pb-2 space-x-2">
        {DECORATION_CATEGORIES.map((category) => (
          <Button
            key={category.name}
            variant={activeCategory === category.name ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.name)}
            className="flex-shrink-0 text-xs"
          >
            {category.name}
          </Button>
        ))}
      </div>

      <ScrollArea className="h-40 border rounded-md p-2">
        <div className="grid grid-cols-3 gap-2">
          {DECORATION_CATEGORIES.find(
            (category) => category.name === activeCategory
          )?.items.map((item) => (
            <Button
              key={item.name}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center p-1 relative overflow-hidden"
              onClick={() => addDecoration(item)}
            >
              {item.image && !item.svg ? (
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded"
                />
              ) : (
                <span className="text-2xl">{item.svg}</span>
              )}
              <span className="text-xs mt-1 truncate w-full text-center">{item.name}</span>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
