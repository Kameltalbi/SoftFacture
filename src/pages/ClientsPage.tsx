
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { UserPlus, Import, Loader2 } from "lucide-react";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { ClientDetailView } from "@/components/clients/ClientDetailView";
import { ClientImportDialog } from "@/components/clients/ClientImportDialog";
import { ClientList } from "@/components/clients/ClientList";
import { useTranslation } from "react-i18next";
import { Client } from "@/types";
import { fetchClients } from "@/components/clients/ClientsData";
import { toast } from "sonner";

const ClientsPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openDetailView, setOpenDetailView] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [selectedDetailClient, setSelectedDetailClient] = useState<Client | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [clients, setClients] = useState<Client[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
      toast.error(t('client.load.error', 'Error loading clients'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClient = () => {
    setSelectedClient(null);
    setOpenModal(true);
  };

  const handleEditClient = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedClient(id);
    setOpenModal(true);
  };

  const handleViewClient = (client: Client) => {
    setSelectedDetailClient(client);
    setOpenDetailView(true);
  };

  return (
    <MainLayout title={t('common.clients')}>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {t('client.title')}
          </h2>
          <p className="text-muted-foreground">
            {t('client.subtitle')}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => setImportDialogOpen(true)}
            className="flex items-center"
          >
            <Import className="mr-2 h-4 w-4" />
            {t('common.import')}
          </Button>
          <Button className="flex items-center" onClick={handleCreateClient}>
            <UserPlus className="mr-2 h-4 w-4" />
            {t('client.new')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <ClientList 
          clients={clients}
          onEditClient={handleEditClient}
          onViewClient={handleViewClient}
        />
      )}

      <ClientFormModal
        open={openModal}
        onOpenChange={setOpenModal}
        clientId={selectedClient}
        onSuccess={loadClients}
      />

      <ClientDetailView
        open={openDetailView}
        onOpenChange={setOpenDetailView}
        client={selectedDetailClient}
      />
      
      <ClientImportDialog 
        open={importDialogOpen} 
        onOpenChange={setImportDialogOpen}
        onImportSuccess={loadClients}
      />
    </MainLayout>
  );
};

export default ClientsPage;
