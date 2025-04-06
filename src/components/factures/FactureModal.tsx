
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Settings, Save, ArrowUpRight } from "lucide-react";
import { FactureSettingsPanel } from "./FactureSettingsPanel";

interface FactureModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  factureId: string | null;
}

export function FactureModal({
  open,
  onOpenChange,
  factureId,
}: FactureModalProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [applyTVA, setApplyTVA] = useState(true);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showAdvancePayment, setShowAdvancePayment] = useState(false);
  const [currency, setCurrency] = useState("EUR");

  const isEditing = factureId !== null;

  // Lignes de produits fictives
  const [productLines, setProductLines] = useState([
    {
      id: "1",
      name: "Développement site web",
      quantity: 1,
      unitPrice: 1200,
      tva: 20,
      discount: 0,
      total: 1200,
    },
  ]);

  const addProductLine = () => {
    const newLine = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      unitPrice: 0,
      tva: 20,
      discount: 0,
      total: 0,
    };
    setProductLines([...productLines, newLine]);
  };

  const removeProductLine = (id: string) => {
    setProductLines(productLines.filter((line) => line.id !== id));
  };

  const subtotal = productLines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0
  );

  const totalTVA = applyTVA
    ? productLines.reduce(
        (sum, line) =>
          sum + line.quantity * line.unitPrice * (line.tva / 100),
        0
      )
    : 0;

  const totalTTC = subtotal + totalTVA;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95vw] sm:max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">
              {isEditing ? "Modifier la facture" : "Nouvelle facture"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Modifiez les détails de la facture existante"
                : "Créez une nouvelle facture pour un client"}
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <Tabs defaultValue="edition" className="mb-6">
              <TabsList>
                <TabsTrigger value="edition">Édition</TabsTrigger>
                <TabsTrigger value="apercu">Aperçu</TabsTrigger>
              </TabsList>
              <TabsContent value="edition" className="space-y-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="numero">Numéro de facture</Label>
                    <Input
                      id="numero"
                      defaultValue={isEditing ? "FAC2025-001" : "FAC2025-005"}
                      readOnly
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="date">Date d'émission</Label>
                    <Input
                      id="date"
                      type="date"
                      defaultValue={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="echeance">Date d'échéance</Label>
                    <Input
                      id="echeance"
                      type="date"
                      defaultValue={
                        new Date(
                          new Date().setDate(new Date().getDate() + 30)
                        )
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="client">Client</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Entreprise ABC</SelectItem>
                        <SelectItem value="2">Société XYZ</SelectItem>
                        <SelectItem value="3">Consulting DEF</SelectItem>
                        <SelectItem value="4">Studio Design</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="statut">Statut</Label>
                    <Select defaultValue="brouillon">
                      <SelectTrigger>
                        <SelectValue placeholder="Statut de la facture" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brouillon">Brouillon</SelectItem>
                        <SelectItem value="envoyee">Envoyée</SelectItem>
                        <SelectItem value="payee">Payée</SelectItem>
                        <SelectItem value="retard">En retard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">
                      Produits et services
                    </Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addProductLine}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter une ligne
                    </Button>
                  </div>

                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[40%]">
                            Produit / Service
                          </TableHead>
                          <TableHead className="text-center">Quantité</TableHead>
                          <TableHead className="text-center">
                            Prix unitaire
                          </TableHead>
                          {applyTVA && (
                            <TableHead className="text-center">
                              TVA (%)
                            </TableHead>
                          )}
                          {showDiscount && (
                            <TableHead className="text-center">
                              Remise (%)
                            </TableHead>
                          )}
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {productLines.map((line) => (
                          <TableRow key={line.id}>
                            <TableCell>
                              <Input
                                placeholder="Description"
                                defaultValue={line.name}
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Input
                                type="number"
                                min="1"
                                defaultValue={line.quantity.toString()}
                                className="w-16 mx-auto text-center"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-center">
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  defaultValue={line.unitPrice.toString()}
                                  className="w-24 text-center"
                                />
                                <span className="ml-1">€</span>
                              </div>
                            </TableCell>
                            {applyTVA && (
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  defaultValue={line.tva.toString()}
                                  className="w-16 mx-auto text-center"
                                />
                              </TableCell>
                            )}
                            {showDiscount && (
                              <TableCell className="text-center">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  defaultValue={line.discount.toString()}
                                  className="w-16 mx-auto text-center"
                                />
                              </TableCell>
                            )}
                            <TableCell className="text-right font-medium">
                              {line.total.toLocaleString("fr-FR")} €
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProductLine(line.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
                      <span>{subtotal.toLocaleString("fr-FR")} €</span>
                    </div>
                    {applyTVA && (
                      <div className="flex justify-between">
                        <span>TVA</span>
                        <span>{totalTVA.toLocaleString("fr-FR")} €</span>
                      </div>
                    )}
                    {showDiscount && (
                      <div className="flex justify-between">
                        <span>Remise globale</span>
                        <span>0.00 €</span>
                      </div>
                    )}
                    {showAdvancePayment && (
                      <div className="flex justify-between">
                        <span>Avance perçue</span>
                        <span>0.00 €</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t font-bold">
                      <span>Total TTC</span>
                      <span>{totalTTC.toLocaleString("fr-FR")} €</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    placeholder="Ajouter des notes ou des conditions particulières"
                  />
                </div>
              </TabsContent>
              <TabsContent value="apercu" className="mt-4">
                <div className="invoice-paper animate-fade-in py-8 px-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <div className="w-52 h-14 bg-invoice-blue-100 flex items-center justify-center rounded">
                        <p className="font-bold text-invoice-blue-700">
                          VOTRE LOGO
                        </p>
                      </div>
                      <div className="mt-4 text-sm">
                        <p className="font-semibold">Votre Entreprise</p>
                        <p>123 Rue de Paris</p>
                        <p>75001 Paris, France</p>
                        <p>Tél: 01 23 45 67 89</p>
                        <p>Email: contact@votreentreprise.fr</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-bold text-invoice-blue-600 mb-2">
                        FACTURE
                      </h1>
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">№ :</span> FAC2025-005
                        </p>
                        <p>
                          <span className="font-medium">Date d'émission :</span>{" "}
                          {new Date().toLocaleDateString("fr-FR")}
                        </p>
                        <p>
                          <span className="font-medium">
                            Date d'échéance :
                          </span>{" "}
                          {new Date(
                            new Date().setDate(new Date().getDate() + 30)
                          ).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-b py-6 my-8">
                    <h2 className="text-sm font-semibold mb-1 text-muted-foreground">
                      FACTURER À
                    </h2>
                    <div>
                      <p className="font-semibold">Entreprise ABC</p>
                      <p>456 Avenue des Clients</p>
                      <p>69002 Lyon, France</p>
                      <p>Email: contact@abc.fr</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-semibold">
                            Description
                          </th>
                          <th className="text-center py-2 font-semibold">
                            Quantité
                          </th>
                          <th className="text-right py-2 font-semibold">
                            Prix unitaire
                          </th>
                          {applyTVA && (
                            <th className="text-right py-2 font-semibold">
                              TVA (%)
                            </th>
                          )}
                          {showDiscount && (
                            <th className="text-right py-2 font-semibold">
                              Remise (%)
                            </th>
                          )}
                          <th className="text-right py-2 font-semibold">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {productLines.map((line) => (
                          <tr key={line.id} className="border-b">
                            <td className="py-3">{line.name}</td>
                            <td className="py-3 text-center">
                              {line.quantity}
                            </td>
                            <td className="py-3 text-right">
                              {line.unitPrice.toLocaleString("fr-FR")} €
                            </td>
                            {applyTVA && (
                              <td className="py-3 text-right">{line.tva}%</td>
                            )}
                            {showDiscount && (
                              <td className="py-3 text-right">
                                {line.discount}%
                              </td>
                            )}
                            <td className="py-3 text-right">
                              {line.total.toLocaleString("fr-FR")} €
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end mb-8">
                    <div className="w-64">
                      <div className="flex justify-between py-1">
                        <span>Sous-total</span>
                        <span>{subtotal.toLocaleString("fr-FR")} €</span>
                      </div>
                      {applyTVA && (
                        <div className="flex justify-between py-1">
                          <span>TVA</span>
                          <span>{totalTVA.toLocaleString("fr-FR")} €</span>
                        </div>
                      )}
                      {showDiscount && (
                        <div className="flex justify-between py-1">
                          <span>Remise globale</span>
                          <span>0.00 €</span>
                        </div>
                      )}
                      {showAdvancePayment && (
                        <div className="flex justify-between py-1">
                          <span>Avance perçue</span>
                          <span>0.00 €</span>
                        </div>
                      )}
                      <div className="flex justify-between py-2 border-t border-t-gray-300 font-bold">
                        <span>Total TTC</span>
                        <span>{totalTTC.toLocaleString("fr-FR")} €</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-invoice-blue-50 p-4 rounded-md mb-8">
                    <p className="text-sm">
                      <span className="font-semibold">
                        Montant à payer en toutes lettres :
                      </span>{" "}
                      Mille deux cents euros
                    </p>
                  </div>

                  <div className="text-xs text-muted-foreground border-t pt-4">
                    <p className="font-medium mb-2">Conditions de paiement</p>
                    <p>Payable sous 30 jours.</p>
                    <p>
                      Coordonnées bancaires : IBAN FR76 1234 5678 9101 1121 3141
                      5161
                    </p>
                    <p className="mt-2">
                      Merci pour votre confiance. Pour toute question concernant
                      cette facture, veuillez nous contacter.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {showSettings && (
            <FactureSettingsPanel
              applyTVA={applyTVA}
              setApplyTVA={setApplyTVA}
              showDiscount={showDiscount}
              setShowDiscount={setShowDiscount}
              showAdvancePayment={showAdvancePayment}
              setShowAdvancePayment={setShowAdvancePayment}
              currency={currency}
              setCurrency={setCurrency}
            />
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button variant="outline">
            <ArrowUpRight className="mr-2 h-4 w-4" />
            Envoyer
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
