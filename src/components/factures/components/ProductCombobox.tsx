import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "cmdk";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Product } from "@/hooks/useProducts";

interface ProductComboboxProps {
  products: Product[];
  value: string;
  onChange: (value: string, product: Product | null) => void;
  disabled?: boolean;
}

export function ProductCombobox({ products, value, onChange, disabled }: ProductComboboxProps) {
  console.log('💭 ProductCombobox - Props reçus:', { 
    products, 
    value, 
    disabled,
    productsLength: products?.length,
    productsType: typeof products,
    isArray: Array.isArray(products)
  });

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredProducts = products?.filter(product => {
    console.log('🔍 Filtrage produit:', product);
    return product.nom.toLowerCase().includes(search.toLowerCase());
  }) || [];

  console.log('💾 Produits filtrés:', filteredProducts);

  return (
    <div className="relative">
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        disabled={disabled}
        onClick={() => setOpen(!open)}
      >
        {value || "Sélectionner un produit"}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {open && (
        <div className="absolute z-50 w-full bg-white border rounded-md shadow-lg mt-1">
          <input
            className="w-full p-2 border-b"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="max-h-60 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="p-2 text-sm text-gray-500">Aucun produit trouvé.</div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={cn(
                    "flex items-center px-2 py-1 cursor-pointer hover:bg-gray-100",
                    value === product.nom && "bg-gray-100"
                  )}
                  onClick={() => {
                    onChange(product.nom, product);
                    setOpen(false);
                    setSearch("");
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.nom ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {product.nom}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
