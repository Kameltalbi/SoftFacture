-- Insérer des produits de test
INSERT INTO produits (id, nom, prix, taux_tva, description)
VALUES 
  (gen_random_uuid(), 'Développement site web', 1200, 20, 'Création d''un site web professionnel'),
  (gen_random_uuid(), 'Maintenance mensuelle', 150, 20, 'Maintenance et mise à jour du site'),
  (gen_random_uuid(), 'Design logo', 300, 20, 'Création de logo professionnel');

-- Vérifier les produits insérés
SELECT * FROM produits;
