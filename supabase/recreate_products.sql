-- Supprimer la table existante
DROP TABLE IF EXISTS produits CASCADE;

-- Recréer la table
CREATE TABLE produits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nom TEXT NOT NULL,
    prix DECIMAL(10,2) NOT NULL,
    taux_tva DECIMAL(5,2) NOT NULL,
    description TEXT,
    categorie_id UUID REFERENCES categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Désactiver RLS pour permettre l'accès public
ALTER TABLE produits DISABLE ROW LEVEL SECURITY;

-- Donner les permissions
GRANT ALL ON produits TO authenticated;
GRANT SELECT ON produits TO anon;

-- Insérer quelques produits de test
INSERT INTO produits (nom, prix, taux_tva, description) VALUES
    ('Développement site web', 1200, 20, 'Création d''un site web professionnel'),
    ('Maintenance mensuelle', 150, 20, 'Maintenance et mise à jour du site'),
    ('Design logo', 300, 20, 'Création de logo professionnel');

-- Vérifier les produits insérés
SELECT * FROM produits;
