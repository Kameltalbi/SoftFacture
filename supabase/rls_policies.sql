-- Réinitialiser les politiques existantes
DROP POLICY IF EXISTS "Enable read access for all users" ON produits;
DROP POLICY IF EXISTS "Enable write access for all users" ON produits;

-- Activer RLS sur la table produits
ALTER TABLE produits ENABLE ROW LEVEL SECURITY;

-- Créer une politique permettant la lecture publique
CREATE POLICY "Allow public read access"
ON produits
FOR SELECT
TO anon
USING (true);

-- Créer une politique permettant la modification pour les utilisateurs authentifiés
CREATE POLICY "Allow authenticated write access"
ON produits
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
