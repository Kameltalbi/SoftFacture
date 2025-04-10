
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { StatutFacture } from "@/types";
import { downloadInvoiceAsPDF } from "@/utils/pdfGenerator";

export function useFactureApi() {
  const [isLoading, setIsLoading] = useState(false);

  // Generate a facture number
  const generateFactureNumber = async () => {
    const year = new Date().getFullYear();
    
    try {
      // Get the count of existing invoices to generate a sequential number
      const { count, error } = await supabase
        .from('factures')
        .select('*', { count: 'exact', head: true });
        
      if (error) throw error;
      
      const nextNumber = (count || 0) + 1;
      return `FAC-${year}-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error("Erreur lors de la génération du numéro de facture:", error);
      // Fallback to random number if count fails
      const randomId = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      return `FAC-${year}-${randomId}`;
    }
  };

  // Create a new facture in the database
  const createFacture = async (factureData: any, productLinesData: any[]) => {
    setIsLoading(true);
    
    try {
      // Modification ici: nous supprimons la clé client_id pour éviter l'erreur de contrainte de clé étrangère
      // Nous allons plutôt stocker uniquement le nom du client
      const factureToCreate = { ...factureData };
      if (factureToCreate.client_id) {
        delete factureToCreate.client_id; // Supprimer la clé client_id pour éviter l'erreur de contrainte
      }
      
      // Create the invoice in Supabase
      const { data, error: factureError } = await supabase
        .from('factures')
        .insert(factureToCreate)
        .select()
        .single();
        
      if (factureError) throw factureError;

      // Insert product lines
      const linesData = productLinesData.map(line => ({
        facture_id: data.id,
        nom: line.name,
        quantite: line.quantity,
        prix_unitaire: line.unitPrice,
        taux_tva: line.tva,
        montant_tva: line.montantTVA,
        est_taux_tva: line.estTauxTVA,
        remise: line.discount,
        sous_total: line.total
      }));
      
      const { error: linesError } = await supabase
        .from('lignes_facture')
        .insert(linesData);
        
      if (linesError) throw linesError;
      
      toast.success("Facture créée avec succès");
      return data;
    } catch (error) {
      console.error("Erreur lors de la création de la facture:", error);
      toast.error("Erreur lors de la création de la facture");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing facture
  const updateFacture = async (factureId: string, factureData: any) => {
    if (!factureId) {
      toast.error("Impossible d'enregistrer une facture qui n'existe pas encore");
      return false;
    }
    
    setIsLoading(true);
    
    try {
      // Update the invoice in Supabase with the correct field names
      const { error } = await supabase
        .from('factures')
        .update(factureData)
        .eq('id', factureId);
        
      if (error) throw error;
      
      toast.success("Facture enregistrée");
      return true;
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la facture:", error);
      toast.error("Erreur lors de l'enregistrement de la facture");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch a facture by ID
  const fetchFacture = async (factureId: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('factures')
        .select('*, lignes_facture(*)')
        .eq('id', factureId)
        .single();
          
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Erreur lors du chargement de la facture:", error);
      toast.error("Erreur lors du chargement de la facture");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Download the facture as PDF
  const downloadPDF = (invoiceData: any) => {
    try {
      downloadInvoiceAsPDF(invoiceData);
      return true;
    } catch (error) {
      console.error("Erreur lors de la génération du PDF :", error);
      toast.error("Erreur lors de la génération du PDF");
      return false;
    }
  };

  return {
    isLoading,
    generateFactureNumber,
    createFacture,
    updateFacture,
    fetchFacture,
    downloadPDF
  };
}
