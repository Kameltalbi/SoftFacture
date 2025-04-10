
import PricingCard from "./PricingCard";
import { useAuth } from "@/contexts/auth-context";

interface PricingSectionProps {
  isStandalonePage?: boolean;
}

const PricingSection = ({ isStandalonePage = false }: PricingSectionProps) => {
  const { authStatus, hasActiveSubscription } = useAuth();
  
  // Ajuster les liens de redirection en fonction du contexte
  const getTrialLink = () => {
    // Si c'est une page autonome et que l'utilisateur est connecté
    if (isStandalonePage && authStatus === 'authenticated') {
      return "/dashboard";
    }
    // Si c'est une page autonome et que l'utilisateur n'est pas connecté  
    else if (isStandalonePage) {
      return "/register?plan=trial&redirect=dashboard";
    }
    // Comportement par défaut (page d'accueil)
    return "/register?plan=trial";
  };
  
  const getAnnualLink = () => {
    // Si c'est une page autonome et que l'utilisateur est connecté
    if (isStandalonePage && authStatus === 'authenticated') {
      return "/paiement?plan=annual&montant=390";
    }
    // Si c'est une page autonome et que l'utilisateur n'est pas connecté
    else if (isStandalonePage) {
      return "/register?plan=annual&redirect=paiement";
    }
    // Comportement par défaut (page d'accueil)
    return "/register?plan=annual";
  };
  
  const plans = [
    {
      name: "Essai Gratuit",
      price: "0",
      duration: "14 jours",
      description: "Accès complet à toutes les fonctionnalités pendant 14 jours",
      features: [
        "Gestion illimitée des factures",
        "Création de devis professionnels",
        "Gestion complète des clients",
        "Génération de bons de sortie",
        "Dashboard personnalisé",
        "Support par email"
      ],
      buttonText: "Commencer gratuitement",
      buttonVariant: "outline" as const,
      link: getTrialLink()
    },
    {
      name: "Abonnement Annuel",
      price: "390",
      duration: "par an (HT)",
      description: "Solution complète pour votre entreprise",
      features: [
        "Gestion illimitée des factures",
        "Création de devis professionnels",
        "Gestion complète des clients",
        "Génération de bons de sortie",
        "Dashboard personnalisé",
        "Support prioritaire",
        "Accès à toutes les mises à jour",
        "Intégration avec vos outils existants"
      ],
      buttonText: "S'abonner maintenant",
      buttonVariant: "default" as const,
      link: getAnnualLink(),
      popular: true
    }
  ];

  // Afficher différemment si l'utilisateur a déjà un abonnement actif
  const renderAbonnementActif = () => {
    return (
      <div className="text-center mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
        <h3 className="text-xl font-bold text-green-700 mb-2">Vous avez déjà un abonnement actif</h3>
        <p className="text-green-600">
          Vous pouvez accéder à toutes les fonctionnalités de l'application.
        </p>
        <a href="/dashboard" className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
          Accéder au tableau de bord
        </a>
      </div>
    );
  };

  return (
    <section className={`py-20 px-6 ${!isStandalonePage ? 'bg-gray-50' : 'bg-background'}`}>
      <div className="max-w-6xl mx-auto">
        {!isStandalonePage && (
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tarifs simples et transparents</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez le plan qui convient le mieux à vos besoins, sans frais cachés.
            </p>
          </div>
        )}

        {authStatus === 'authenticated' && hasActiveSubscription && renderAbonnementActif()}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <PricingCard 
              key={index}
              name={plan.name}
              price={plan.price}
              duration={plan.duration}
              description={plan.description}
              features={plan.features}
              buttonText={plan.buttonText}
              buttonVariant={plan.buttonVariant}
              link={plan.link}
              popular={plan.popular}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
