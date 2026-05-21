export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: 'Básicas' | 'Exterior / Lujo' | 'Entretenimiento' | 'Seguridad / Extra';
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  petsAllowed: boolean;
  location: string;
  mainImage: string;
  images: string[];
  amenities: string[]; // Array of Amenity IDs
  blockedDates?: string[]; // ISO date strings (YYYY-MM-DD)
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
  priceFrom?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName: string;
}
