import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Lecture des variables d'environnement
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function testConnexion() {
  console.log('🚀 Test de connexion Supabase...');

  const { data, error } = await supabase
    .from('entreprises') // mets ici une table EXISTANTE
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Connexion échouée :', error.message);
    process.exit(1);
  }

  console.log('✅ Supabase connecté. Exemple de données :', data);
}

testConnexion();
