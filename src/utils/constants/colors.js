// SOFTFACTURE Color Palette
export const COLORS = {
  // Primary Colors
  PRIMARY: '#4B7090', // Bleu-gris clair - Main brand color
  PRIMARY_DARK: '#2C4159', // Bleu profond - Important text and navigation
  WHITE: '#FFFFFF', // White - Main background
  LIGHT_GRAY: '#F5F7FA', // Gris clair - Secondary backgrounds and cards
  BLACK: '#000000', // Black - Text and icons

  // Status Colors
  SUCCESS: '#6BB98C', // Accents verts doux - Positive status
  WARNING: '#E8A562', // Orange doux - Pending status
  ERROR: '#E57373', // Rouge atténué - Overdue status
  SECONDARY_TEXT: '#A0A8B3', // Gris moyen - Secondary text and icons

  // Semantic Colors
  TEXT_PRIMARY: '#2C4159', // Primary text color
  TEXT_SECONDARY: '#A0A8B3', // Secondary text color
  BORDER: '#E5E9F0', // Border color
  BACKGROUND: '#F5F7FA', // Main background color
  CARD_BACKGROUND: '#FFFFFF', // Card background color

  // Additional Utility Colors
  HOVER: '#3D5A73', // Darker shade of primary for hover states
  DISABLED: '#D1D5DB', // Disabled state color
  LINK: '#4B7090', // Link color
  LINK_HOVER: '#3D5A73', // Link hover color
  SHADOW: 'rgba(0, 0, 0, 0.1)', // Shadow color
};

// Status Colors Mapping
export const STATUS_COLORS = {
  paid: COLORS.SUCCESS,
  pending: COLORS.WARNING,
  overdue: COLORS.ERROR,
  draft: COLORS.SECONDARY_TEXT,
  cancelled: COLORS.ERROR,
  sent: COLORS.PRIMARY,
};

// Export individual colors for direct use
export const {
  PRIMARY,
  PRIMARY_DARK,
  WHITE,
  LIGHT_GRAY,
  BLACK,
  SUCCESS,
  WARNING,
  ERROR,
  SECONDARY_TEXT,
  TEXT_PRIMARY,
  TEXT_SECONDARY,
  BORDER,
  BACKGROUND,
  CARD_BACKGROUND,
  HOVER,
  DISABLED,
  LINK,
  LINK_HOVER,
  SHADOW,
} = COLORS;

export const SECONDARY = '#2E3A59';
export const INFO = '#1890FF';
export const DARK_GRAY = '#A0A8B3';
export const GRAY = '#A6ADB4';
export const LIGHT_BLUE = '#2C4159';
export const DARK_BLUE = '#001529';
export const LIGHT_GREEN = '#F6FFED';
export const DARK_GREEN = '#6BB98C';
export const LIGHT_RED = '#FFF1F0';
export const DARK_RED = '#E57373';  