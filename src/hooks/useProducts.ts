import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Produit {
  id: string;
  nom: string;
  prix: number;
  taux_tva: number;
  description: string;
  categorie_id: string;
}

export function useProducts() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      console.log('🔍 Chargement des produits...');

      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
        console.error('❌ Erreur produits :', error);
        setError(error);
        setProduits([]);
      } else {
        console.log('✅ Produits chargés :', data);
        setProduits(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  return { produits, loading, error };
}
