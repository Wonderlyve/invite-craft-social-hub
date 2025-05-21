
export interface Guest {
  id: string;
  full_name: string;
  email: string | null;
  event_id: string;
  table_name: string | null;
  status: 'pending' | 'confirmed' | 'declined';
  checked_in: boolean;
  share_token: string;
  created_at: string;
}

// Fonction utilitaire pour convertir les données brutes de Supabase en objets Guest correctement typés
export const convertToGuest = (rawData: any): Guest => {
  return {
    ...rawData,
    // Garantir que le status est l'un des types autorisés
    status: rawData.status === 'pending' || 
            rawData.status === 'confirmed' || 
            rawData.status === 'declined' 
              ? rawData.status 
              : 'pending'
  };
};

export const convertToGuests = (rawData: any[]): Guest[] => {
  return rawData.map(convertToGuest);
};
