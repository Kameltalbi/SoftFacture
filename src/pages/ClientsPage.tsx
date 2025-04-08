
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, MoreHorizontal, Trash2, UserPlus } from "lucide-react";
import { ClientFormModal } from "@/components/clients/ClientFormModal";
import { useTranslation } from "react-i18next";

// Données fictives pour les clients
const clientsDemo = [
  {
    id: "1",
    nom: "Entreprise ABC",
    societe: "ABC SAS",
    email: "contact@abc.fr",
    telephone: "01 23 45 67 89",
    adresse: "123 Rue de Paris, 75001 Paris",
  },
  {
    id: "2",
    nom: "Jean Dupont",
    societe: "Société XYZ",
    email: "jean.dupont@xyz.fr",
    telephone: "06 12 34 56 78",
    adresse: "456 Avenue des Clients, 69002 Lyon",
  },
  {
    id: "3",
    nom: "Marie Martin",
    societe: "Consulting DEF",
    email: "marie.martin@def.fr",
    telephone: "07 98 76 54 32",
    adresse: "789 Boulevard Central, 33000 Bordeaux",
  },
  {
    id: "4",
    nom: "Pierre Durand",
    societe: "Studio Design",
    email: "pierre.durand@studio.fr",
    telephone: "06 54 32 10 98",
    adresse: "10 Rue de la Création, 44000 Nantes",
  },
];

const ClientsPage = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleCreateClient = () => {
    setSelectedClient(null);
    setOpenModal(true);
  };

  const handleEditClient = (id: string) => {
    setSelectedClient(id);
    setOpenModal(true);
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
        <Button className="flex items-center" onClick={handleCreateClient}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('client.new')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t('client.list')}</CardTitle>
            <Input
              placeholder={t('client.search')}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('client.form.name')}</TableHead>
                <TableHead>{t('client.form.company')}</TableHead>
                <TableHead>{t('client.form.email')}</TableHead>
                <TableHead>{t('client.form.phone')}</TableHead>
                <TableHead className="text-right">{t('invoice.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientsDemo.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">{client.nom}</TableCell>
                  <TableCell>{client.societe}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.telephone}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleEditClient(client.id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t('invoice.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('invoice.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ClientFormModal
        open={openModal}
        onOpenChange={setOpenModal}
        clientId={selectedClient}
      />
    </MainLayout>
  );
};

export default ClientsPage;
