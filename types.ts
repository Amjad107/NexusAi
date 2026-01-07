
export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export interface WebsiteSection {
  id: string;
  type: 'header' | 'hero' | 'features' | 'cta' | 'pricing' | 'footer' | 'content';
  content: any;
  styles: {
    backgroundColor?: string;
    textColor?: string;
    padding?: string;
    [key: string]: any;
  };
}

export interface Project {
  id: string;
  name: string;
  description: string;
  sections: WebsiteSection[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  userId: string;
  thumbnail?: string;
  theme: {
    primaryColor: string;
    fontFamily: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  plan: 'free' | 'pro' | 'enterprise';
  avatar?: string;
}

export interface AppSettings {
  primaryColor: string;
  buttonColor: string;
  fontFamily: string;
  siteName: string;
  logo: string;
  databaseMode: 'local' | 'neon';
  neonConnectionString?: string;
  neonApiKey?: string;
  isDbVerified?: boolean;
  pricing: {
    pro: { price: number; credits: number; name: string };
    enterprise: { price: number; credits: number; name: string };
  };
}
