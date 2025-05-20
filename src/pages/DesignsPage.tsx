
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateCard from "@/components/designs/TemplateCard";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Données factices pour la démo
const mockTemplates = [
  {
    id: "1",
    title: "Élégance Florale",
    category: "Mariage",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "2",
    title: "Modern Business",
    category: "Conférence",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "3",
    title: "Fête Colorée",
    category: "Anniversaire",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "4",
    title: "Minimaliste Blanc",
    category: "Mariage",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "5",
    title: "Tech Summit",
    category: "Conférence",
    imageUrl: "/placeholder.svg"
  },
  {
    id: "6",
    title: "Ballons et Confettis",
    category: "Anniversaire",
    imageUrl: "/placeholder.svg"
  }
];

const DesignsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const navigate = useNavigate();
  
  const handleTemplateSelect = (templateId: string) => {
    toast.success("Modèle sélectionné ! Créez maintenant votre événement.");
    navigate(`/editor?template=${templateId}`);
  };
  
  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "all" || template.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  
  return (
    <>
      <Navbar />
      <PageContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Modèles d'Invitation</h1>
          <p className="text-muted-foreground">
            Parcourez notre collection de modèles et personnalisez-les selon vos besoins.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher un modèle..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
            <TabsTrigger value="all">Tous</TabsTrigger>
            <TabsTrigger value="mariage">Mariage</TabsTrigger>
            <TabsTrigger value="anniversaire">Anniversaire</TabsTrigger>
            <TabsTrigger value="conférence">Conférence</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <TemplateCard 
                  key={template.id} 
                  id={template.id} 
                  title={template.title} 
                  imageUrl={template.imageUrl} 
                  category={template.category} 
                  onClick={handleTemplateSelect}
                />
              ))}
            </div>
          </TabsContent>
          {["mariage", "anniversaire", "conférence"].map((category) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map((template) => (
                  <TemplateCard 
                    key={template.id} 
                    id={template.id} 
                    title={template.title} 
                    imageUrl={template.imageUrl} 
                    category={template.category} 
                    onClick={handleTemplateSelect}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </PageContainer>
      <Footer />
    </>
  );
};

export default DesignsPage;
