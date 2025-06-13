
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Heart, Briefcase, PartyPopper } from "lucide-react";
import { useEditor } from "./EditorContext";

interface Template {
  id: string;
  name: string;
  category: 'mariage' | 'anniversaire' | 'professionnel' | 'fete';
  thumbnail: string;
  objects: any[];
  backgroundColor?: string;
}

const templates: Template[] = [
  {
    id: 'wedding-elegant',
    name: 'Mariage Élégant',
    category: 'mariage',
    thumbnail: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&h=400&fit=crop',
    backgroundColor: '#fef7f0',
    objects: [
      {
        id: 'title-1',
        type: 'text',
        x: 540,
        y: 300,
        text: 'Sarah & Thomas',
        fontSize: 48,
        fontFamily: 'Playfair Display',
        fill: '#8b5a3c',
        textAlign: 'center',
        width: 400,
        offsetX: 200
      },
      {
        id: 'subtitle-1',
        type: 'text',
        x: 540,
        y: 380,
        text: 'Ont le plaisir de vous inviter à leur mariage',
        fontSize: 18,
        fontFamily: 'Montserrat',
        fill: '#6b7280',
        textAlign: 'center',
        width: 500,
        offsetX: 250
      },
      {
        id: 'date-1',
        type: 'text',
        x: 540,
        y: 1200,
        text: 'Le 15 Juin 2024\nÀ 16h00',
        fontSize: 24,
        fontFamily: 'Montserrat',
        fill: '#8b5a3c',
        textAlign: 'center',
        width: 300,
        offsetX: 150
      },
      {
        id: 'decoration-1',
        type: 'rect',
        x: 440,
        y: 420,
        width: 200,
        height: 2,
        fill: '#d4a574'
      }
    ]
  },
  {
    id: 'birthday-fun',
    name: 'Anniversaire Festif',
    category: 'anniversaire',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=400&fit=crop',
    backgroundColor: '#fef3c7',
    objects: [
      {
        id: 'title-2',
        type: 'text',
        x: 540,
        y: 400,
        text: 'Joyeux Anniversaire!',
        fontSize: 40,
        fontFamily: 'Dancing Script',
        fill: '#f59e0b',
        textAlign: 'center',
        width: 600,
        offsetX: 300
      },
      {
        id: 'age-2',
        type: 'text',
        x: 540,
        y: 500,
        text: '30 ans',
        fontSize: 72,
        fontFamily: 'Bold',
        fill: '#dc2626',
        textAlign: 'center',
        width: 200,
        offsetX: 100
      },
      {
        id: 'party-2',
        type: 'text',
        x: 540,
        y: 1100,
        text: 'Venez faire la fête avec nous!\n🎉 🎂 🎈',
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#1f2937',
        textAlign: 'center',
        width: 400,
        offsetX: 200
      }
    ]
  },
  {
    id: 'business-meeting',
    name: 'Réunion Professionnelle',
    category: 'professionnel',
    thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop',
    backgroundColor: '#f8fafc',
    objects: [
      {
        id: 'title-3',
        type: 'text',
        x: 540,
        y: 300,
        text: 'RÉUNION ANNUELLE',
        fontSize: 36,
        fontFamily: 'Helvetica',
        fill: '#1e293b',
        textAlign: 'center',
        width: 600,
        offsetX: 300
      },
      {
        id: 'company-3',
        type: 'text',
        x: 540,
        y: 380,
        text: 'ENTREPRISE XYZ',
        fontSize: 20,
        fontFamily: 'Helvetica',
        fill: '#475569',
        textAlign: 'center',
        width: 400,
        offsetX: 200
      },
      {
        id: 'details-3',
        type: 'text',
        x: 540,
        y: 1000,
        text: 'Mercredi 20 Mars 2024\n14h00 - Salle de conférence\nPrésence requise',
        fontSize: 18,
        fontFamily: 'Arial',
        fill: '#334155',
        textAlign: 'center',
        width: 500,
        offsetX: 250
      },
      {
        id: 'accent-3',
        type: 'rect',
        x: 100,
        y: 0,
        width: 10,
        height: 1800,
        fill: '#3b82f6'
      }
    ]
  },
  {
    id: 'party-night',
    name: 'Soirée Festive',
    category: 'fete',
    thumbnail: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=400&fit=crop',
    backgroundColor: '#1a1a2e',
    objects: [
      {
        id: 'title-4',
        type: 'text',
        x: 540,
        y: 400,
        text: 'PARTY NIGHT',
        fontSize: 48,
        fontFamily: 'Arial Black',
        fill: '#ff6b6b',
        textAlign: 'center',
        width: 500,
        offsetX: 250
      },
      {
        id: 'subtitle-4',
        type: 'text',
        x: 540,
        y: 500,
        text: 'Une soirée inoubliable vous attend',
        fontSize: 20,
        fontFamily: 'Arial',
        fill: '#ffffff',
        textAlign: 'center',
        width: 600,
        offsetX: 300
      },
      {
        id: 'time-4',
        type: 'text',
        x: 540,
        y: 1200,
        text: 'Samedi 25 Mai\nÀ partir de 20h00',
        fontSize: 24,
        fontFamily: 'Arial',
        fill: '#4ecdc4',
        textAlign: 'center',
        width: 400,
        offsetX: 200
      }
    ]
  }
];

const categoryIcons = {
  mariage: Heart,
  anniversaire: PartyPopper,
  professionnel: Briefcase,
  fete: Sparkles
};

const categoryLabels = {
  mariage: 'Mariage',
  anniversaire: 'Anniversaire',
  professionnel: 'Professionnel',
  fete: 'Fête'
};

export default function TemplateLibrary({ onApplyTemplate }: { onApplyTemplate: (template: Template) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Bibliothèque de modèles
        </CardTitle>
        
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un modèle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              Tous
            </Button>
            {Object.entries(categoryLabels).map(([key, label]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => {
            const Icon = categoryIcons[template.category];
            return (
              <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <div 
                  className="h-48 bg-cover bg-center rounded-t-lg"
                  style={{ 
                    backgroundImage: `url(${template.thumbnail})`,
                    backgroundColor: template.backgroundColor
                  }}
                />
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {categoryLabels[template.category]}
                    </Badge>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => onApplyTemplate(template)}
                  >
                    Utiliser ce modèle
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Aucun modèle trouvé pour cette recherche</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
