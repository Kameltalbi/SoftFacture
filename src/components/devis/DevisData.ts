
// Sample data for quotes
export const devisData = [
  {
    id: 1,
    numero: "DEV2025-001",
    client: "Entreprise ABC",
    date: "2025-03-01",
    montant: 1250.00,
    statut: "draft"
  },
  {
    id: 2,
    numero: "DEV2025-002",
    client: "Société XYZ",
    date: "2025-03-05",
    montant: 3680.50,
    statut: "sent"
  },
  {
    id: 3,
    numero: "DEV2025-003",
    client: "Client Particulier",
    date: "2025-03-10",
    montant: 580.00,
    statut: "accepted"
  },
  {
    id: 4,
    numero: "DEV2025-004",
    client: "Entreprise 123",
    date: "2025-02-15",
    montant: 2340.00,
    statut: "rejected"
  },
  {
    id: 5,
    numero: "DEV2025-005",
    client: "Association DEF",
    date: "2025-03-20",
    montant: 4500.00,
    statut: "sent"
  }
];

// Demo data for quotes displayed in client detail view
export const devisDemo = [
  {
    id: "1",
    numero: "DEV2025-001",
    client: { id: "1", nom: "Entreprise ABC", email: "contact@abc.fr" },
    dateCreation: "2025-04-01",
    dateEcheance: "2025-05-01",
    totalTTC: 1200,
    statut: "draft"
  },
  {
    id: "2",
    numero: "DEV2025-002",
    client: { id: "2", nom: "Société XYZ", email: "info@xyz.fr" },
    dateCreation: "2025-04-03",
    dateEcheance: "2025-05-03",
    totalTTC: 850,
    statut: "sent"
  }
];
