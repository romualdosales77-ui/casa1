export type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'telefone' | 'aleatoria';

export interface PixConfig {
  enabled: boolean;
  title: string;
  keyType: PixKeyType;
  keyValue: string;
  beneficiaryName: string;
  city?: string;
  qrCodeImageUrl: string;
  instructions: string;
  discountNote?: string;
}

export interface BannerConfig {
  enabled: boolean;
  title: string;
  subtitle?: string;
  link?: string;
  linkText?: string;
  theme: 'emerald' | 'dark' | 'indigo' | 'slate';
}

export interface PresentationConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  description: string;
  videoUrl: string;
  highlightPoints: string[];
  imageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  videoUrl?: string;
  buyLink: string;
  badge?: string;
  category: string;
  active: boolean;
}

export type UsefulLinkIcon =
  | 'whatsapp'
  | 'instagram'
  | 'telegram'
  | 'link'
  | 'help'
  | 'truck'
  | 'shield'
  | 'mail'
  | 'star';

export interface UsefulLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon: UsefulLinkIcon;
}

export interface SiteData {
  storeName: string;
  storeTagline: string;
  banner: BannerConfig;
  pix: PixConfig;
  presentation: PresentationConfig;
  products: Product[];
  usefulLinks: UsefulLink[];
}
