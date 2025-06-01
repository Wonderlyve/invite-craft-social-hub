
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "./EditorContext";
import { useState } from "react";

const DECORATION_CATEGORIES = [
  {
    name: "Mariage",
    items: [
      { name: "Alliance", svg: "💍", image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=400&fit=crop&q=80" },
      { name: "Gâteau", svg: "🎂", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop&q=80" },
      { name: "Champagne", svg: "🍾", image: "https://images.unsplash.com/photo-1549398499-6c1c25c00b25?w=400&h=400&fit=crop&q=80" },
      { name: "Bouquet", svg: "💐", image: "https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400&h=400&fit=crop&q=80" },
      { name: "Coeurs", svg: "❤️", image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop&q=80" },
      { name: "Robe", svg: "👰", image: "https://images.unsplash.com/photo-1594736797933-d0eeaa43ab5d?w=400&h=400&fit=crop&q=80" },
      { name: "Alliances", svg: "💒", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop&q=80" },
      { name: "Roses", svg: "🌹", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&q=80" },
    ]
  },
  {
    name: "Anniversaire",
    items: [
      { name: "Ballons", svg: "🎈", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=400&fit=crop&q=80" },
      { name: "Cadeaux", svg: "🎁", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&h=400&fit=crop&q=80" },
      { name: "Gâteau", svg: "🎂", image: "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=400&h=400&fit=crop&q=80" },
      { name: "Confetti", svg: "🎉", image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=400&fit=crop&q=80" },
      { name: "Fête", svg: "🎊", image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&h=400&fit=crop&q=80" },
      { name: "Bougies", svg: "🕯️", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&q=80" },
      { name: "Streamers", svg: "🎀", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=400&fit=crop&q=80" },
      { name: "Chapeau", svg: "🎩", image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop&q=80" },
    ]
  },
  {
    name: "Nature",
    items: [
      { name: "Fleurs", svg: "🌸", image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=400&fit=crop&q=80" },
      { name: "Arbres", svg: "🌳", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop&q=80" },
      { name: "Soleil", svg: "☀️", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80" },
      { name: "Nuages", svg: "☁️", image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=400&fit=crop&q=80" },
      { name: "Feuilles", svg: "🍃", image: "https://images.unsplash.com/photo-1440558899798-1cd6d4c3d15e?w=400&h=400&fit=crop&q=80" },
      { name: "Papillons", svg: "🦋", image: "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=400&fit=crop&q=80" },
      { name: "Oiseaux", svg: "🐦", image: "https://images.unsplash.com/photo-1444927714506-8492d94b5ba0?w=400&h=400&fit=crop&q=80" },
      { name: "Mer", svg: "🌊", image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=400&fit=crop&q=80" },
    ]
  },
  {
    name: "Élégance",
    items: [
      { name: "Cristal", image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=600&fit=crop&q=80" },
      { name: "Or", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=600&fit=crop&q=80" },
      { name: "Perles", image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=600&fit=crop&q=80" },
      { name: "Diamant", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=600&fit=crop&q=80" },
      { name: "Soie", image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=600&fit=crop&q=80" },
      { name: "Marbre", image: "https://images.unsplash.com/photo-1615799998603-7c6270a45196?w=400&h=600&fit=crop&q=80" },
      { name: "Argent", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop&q=80" },
      { name: "Velours", image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400&h=600&fit=crop&q=80" },
    ]
  },
  {
    name: "Fêtes",
    items: [
      { name: "Noël", svg: "🎄", image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=400&fit=crop&q=80" },
      { name: "Halloween", svg: "🎃", image: "https://images.unsplash.com/photo-1509557965043-6e069aee8e0b?w=400&h=400&fit=crop&q=80" },
      { name: "Pâques", svg: "🐰", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop&q=80" },
      { name: "Saint-Valentin", svg: "💕", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&q=80" },
      { name: "Nouvel An", svg: "🎆", image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=400&h=400&fit=crop&q=80" },
      { name: "Graduation", svg: "🎓", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=400&fit=crop&q=80" },
      { name: "Baby shower", svg: "👶", image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400&h=400&fit=crop&q=80" },
      { name: "Retraite", svg: "🏖️", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&q=80" },
    ]
  },
];

export default function DecorationItems() {
  const { objects, setObjects, setSelectedId } = useEditor();
  const [activeCategory, setActiveCategory] = useState("Mariage");

  const addDecoration = (decoration: any) => {
    const id = `deco-${Date.now()}`;
    
    // Centrer l'élément dans la zone de travail (1080x1900)
    const centerX = 540; // 1080 / 2
    const centerY = 950; // 1900 / 2
    
    if (decoration.image && !decoration.svg) {
      // Ajouter une image avec des dimensions réduites
      setObjects([...objects, {
        id,
        type: 'image',
        x: centerX - 60, // Centrer l'image de 120px de large
        y: centerY - 80, // Centrer l'image de 160px de haut
        src: decoration.image,
        width: 120,
        height: 160,
        draggable: true,
      }]);
    } else {
      // Ajouter un emoji/texte avec une taille réduite
      setObjects([...objects, {
        id,
        type: 'text',
        x: centerX - 25, // Centrer le texte
        y: centerY - 25,
        text: decoration.svg,
        fontSize: 50,
        draggable: true,
        width: 50,
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

      <ScrollArea className="h-48 border rounded-md p-2">
        <div className="grid grid-cols-3 gap-2">
          {DECORATION_CATEGORIES.find(
            (category) => category.name === activeCategory
          )?.items.map((item) => (
            <Button
              key={item.name}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center p-1 relative overflow-hidden"
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
