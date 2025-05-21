
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEditor } from "./EditorContext";
import { useState } from "react";

const DECORATION_CATEGORIES = [
  {
    name: "Mariage",
    items: [
      { name: "Alliance", svg: "💍" },
      { name: "Gâteau", svg: "🎂" },
      { name: "Champagne", svg: "🍾" },
      { name: "Fleurs", svg: "💐" },
      { name: "Coeur", svg: "❤️" },
    ]
  },
  {
    name: "Anniversaire",
    items: [
      { name: "Ballon", svg: "🎈" },
      { name: "Cadeau", svg: "🎁" },
      { name: "Gâteau", svg: "🎂" },
      { name: "Confetti", svg: "🎉" },
      { name: "Chapeau", svg: "🎊" },
    ]
  },
  {
    name: "Formes",
    items: [
      { name: "Étoile", svg: "⭐" },
      { name: "Coeur", svg: "❤️" },
      { name: "Cercle", svg: "⚪" },
      { name: "Carré", svg: "⬛" },
      { name: "Triangle", svg: "🔺" },
    ]
  },
  {
    name: "Nature",
    items: [
      { name: "Fleur", svg: "🌸" },
      { name: "Arbre", svg: "🌳" },
      { name: "Soleil", svg: "☀️" },
      { name: "Nuage", svg: "☁️" },
      { name: "Feuille", svg: "🍃" },
    ]
  },
];

export default function DecorationItems() {
  const { objects, setObjects, setSelectedId } = useEditor();
  const [activeCategory, setActiveCategory] = useState("Mariage");

  const addDecoration = (decoration: any) => {
    // Créer un élément texte avec l'emoji SVG
    const id = `deco-${Date.now()}`;
    setObjects([...objects, {
      id,
      type: 'text',
      x: 100,
      y: 100,
      text: decoration.svg,
      fontSize: 40,
      draggable: true,
      width: 50,
    }]);
    setSelectedId(id);
  };

  return (
    <Card className="w-full">
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium">Décorations</CardTitle>
        <CardDescription className="text-xs">
          Ajoutez des éléments décoratifs
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 py-1">
        <div className="flex overflow-x-auto pb-2 space-x-2">
          {DECORATION_CATEGORIES.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(category.name)}
              className="flex-shrink-0"
            >
              {category.name}
            </Button>
          ))}
        </div>

        <ScrollArea className="h-32 mt-2">
          <div className="grid grid-cols-4 gap-2 p-2">
            {DECORATION_CATEGORIES.find(
              (category) => category.name === activeCategory
            )?.items.map((item) => (
              <Button
                key={item.name}
                variant="outline"
                className="h-12 text-xl flex items-center justify-center"
                onClick={() => addDecoration(item)}
              >
                {item.svg}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
