-- Désactiver RLS complètement pour la table produits
ALTER TABLE produits DISABLE ROW LEVEL SECURITY;

-- Permettre l'accès public à la table
GRANT SELECT ON produits TO anon;
GRANT SELECT ON produits TO authenticated;
