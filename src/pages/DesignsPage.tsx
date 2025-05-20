
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplateCard from "@/components/designs/TemplateCard";
import PageContainer from "@/components/layout/PageContainer";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface Template {
  id: string;
  name: string;
  category: string;
  preview_image_url: string;
}

const DesignsPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const navigate = useNavigate();
  
  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('is_public', true);
      
      if (error) {
        toast.error("Erreur lors du chargement des modèles");
        throw error;
      }
      
      return data.map((template: any) => ({
        id: template.id,
        name: template.name,
        category: template.category,
        preview_image_url: template.preview_image_url || "/placeholder.svg"
      }));
    }
  });
  
  const handleTemplateSelect = (templateId: string) => {
    toast.success("Modèle sélectionné ! Créez maintenant votre événement.");
    navigate(`/editor?template=${templateId}`);
  };
  
  const filteredTemplates = templates.filter((template: Template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || template.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });
  
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-invitation-purple to-invitation-purple-dark">
          Modèles d'Invitation
        </h1>
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
      
      <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="mariage">Mariage</TabsTrigger>
          <TabsTrigger value="anniversaire">Anniversaire</TabsTrigger>
          <TabsTrigger value="conference">Conférence</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-invitation-purple" />
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucun modèle trouvé pour cette recherche.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template: Template) => (
                <TemplateCard 
                  key={template.id} 
                  id={template.id} 
                  title={template.name} 
                  imageUrl={template.preview_image_url} 
                  category={template.category} 
                  onClick={handleTemplateSelect}
                />
              ))}
            </div>
          )}
        </TabsContent>
        {["mariage", "anniversaire", "conference"].map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-invitation-purple" />
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun modèle trouvé pour cette catégorie.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter((template: Template) => template.category.toLowerCase() === category)
                  .map((template: Template) => (
                    <TemplateCard 
                      key={template.id} 
                      id={template.id} 
                      title={template.name} 
                      imageUrl={template.preview_image_url} 
                      category={template.category} 
                      onClick={handleTemplateSelect}
                    />
                  ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </PageContainer>
  );
};

export default DesignsPage;
