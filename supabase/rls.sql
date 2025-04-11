-- Supprimer les politiques existantes
DROP POLICY IF EXISTS "Enable read access for all users" ON produits;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON produits;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON produits;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON produits;

-- Désactiver RLS temporairement pour permettre l'accès public
ALTER TABLE produits DISABLE ROW LEVEL SECURITY;

-- Permettre l'accès public à la table produits
ALTER TABLE produits FORCE ROW LEVEL SECURITY;

-- Créer une politique qui permet à tout le monde de lire les produits
CREATE POLICY "Enable read access for all users"
ON produits
FOR SELECT
USING (true);

-- Créer une politique qui permet à tout le monde de modifier les produits (temporairement)
CREATE POLICY "Enable write access for all users"
ON produits
USING (true)
WITH CHECK (true);
