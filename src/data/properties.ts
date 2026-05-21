import { Property } from "../types";

export const properties: Property[] = [
  {
    id: "casa-sol-cuernavaca",
    slug: "casa-sol-cuernavaca",
    title: "Casa del Sol - Cuernavaca",
    description: "Hermosa villa con jardín exuberante y alberca climatizada. Perfecta para reuniones familiares en la ciudad de la eterna primavera.",
    capacity: 12,
    bedrooms: 5,
    bathrooms: 4,
    parking: 3,
    petsAllowed: true,
    location: "Cuernavaca, Morelos",
    mainImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Alberca", "Jardín", "WiFi", "Estacionamiento", "Asador", "Cocina Equipada"],
    coordinates: { lat: 18.9225, lng: -99.2342 }
  },
  {
    id: "quinta-las-palmas",
    slug: "quinta-las-palmas-oaxtepec",
    title: "Quinta Las Palmas - Oaxtepec",
    description: "Moderna casa vacacional a pocos minutos de Six Flags Hurricane Harbor. Amplios espacios y diseño contemporáneo.",
    capacity: 10,
    bedrooms: 4,
    bathrooms: 3,
    parking: 2,
    petsAllowed: false,
    location: "Oaxtepec, Morelos",
    mainImage: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Alberca", "Aire Acondicionado", "Smart TV", "Seguridad 24/7", "Terraza"],
    coordinates: { lat: 18.9042, lng: -98.9714 }
  },
  {
    id: "villa-teques",
    slug: "villa-teques-vista-al-lago",
    title: "Villa Teques Vista al Lago",
    description: "Disfruta de los mejores atardeceres frente al lago de Tequesquitengo. Acceso directo al lago y muelle privado.",
    capacity: 8,
    bedrooms: 3,
    bathrooms: 3,
    parking: 2,
    petsAllowed: true,
    location: "Tequesquitengo, Morelos",
    mainImage: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Vista al Lago", "Muelle Privado", "Alberca Infinity", "Jacuzzi", "Kayak"],
    coordinates: { lat: 18.6125, lng: -99.2714 }
  },
  {
    id: "hacienda-cocoyoc",
    slug: "hacienda-estilo-colonial-cocoyoc",
    title: "Hacienda Estilo Colonial - Cocoyoc",
    description: "Vive la experiencia de una hacienda mexicana con todas las comodidades modernas. Techos altos y arcos coloniales.",
    capacity: 15,
    bedrooms: 6,
    bathrooms: 5,
    parking: 5,
    petsAllowed: true,
    location: "Cocoyoc, Morelos",
    mainImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687940-4e524cb35797?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Alberca Grande", "Cancha de Tenis", "Salón de Juegos", "Personal de Servicio", "Jardines"],
    coordinates: { lat: 18.8753, lng: -98.9836 }
  },
  {
    id: "loft-moderno-jiutepec",
    slug: "loft-moderno-con-alberca-jiutepec",
    title: "Loft Moderno con Alberca - Jiutepec",
    description: "Espacio minimalista ideal para parejas or grupos pequeños. Ubicado en zona tranquila con clima inmejorable.",
    capacity: 4,
    bedrooms: 2,
    bathrooms: 2,
    parking: 1,
    petsAllowed: true,
    location: "Jiutepec, Morelos",
    mainImage: "https://images.unsplash.com/photo-1449156001437-3a1442737a31?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1449156001437-3a1442737a31?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Alberca Compartida", "Diseño Moderno", "Pet Friendly", "Seguridad"],
    coordinates: { lat: 18.8833, lng: -99.1667 }
  },
  {
    id: "casa-jardin-tepoztlan",
    slug: "casa-jardin-mistico-tepoztlan",
    title: "Casa Jardín Místico - Tepoztlán",
    description: "Rodeada de naturaleza y con vista al Tepozteco. Un refugio de paz y tranquilidad.",
    capacity: 6,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    petsAllowed: false,
    location: "Tepoztlán, Morelos",
    mainImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    amenities: ["Vista a la Montaña", "Chimenea", "Jardín Zen", "Terraza de Yoga"],
    coordinates: { lat: 18.9833, lng: -99.1 }
  }
];
