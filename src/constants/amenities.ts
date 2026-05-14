import { Amenity } from '../types';

export const INITIAL_AMENITIES: Omit<Amenity, 'id'>[] = [
  // BÁSICAS
  { name: 'Alberca privada', icon: 'Waves', category: 'Básicas' },
  { name: 'WiFi', icon: 'Wifi', category: 'Básicas' },
  { name: 'Cocina equipada', icon: 'UtensilsCrossed', category: 'Básicas' },
  { name: 'Sala / área de descanso', icon: 'Sofa', category: 'Básicas' },
  { name: 'TV / Smart TV', icon: 'Tv', category: 'Básicas' },
  { name: 'Aire acondicionado o ventiladores', icon: 'Wind', category: 'Básicas' },
  { name: 'Agua caliente', icon: 'Thermometer', category: 'Básicas' },
  { name: 'Estacionamiento', icon: 'Car', category: 'Básicas' },

  // EXTERIOR / LUJO
  { name: 'Jacuzzi', icon: 'Bath', category: 'Exterior / Lujo' },
  { name: 'Área de asador / parrilla', icon: 'Flame', category: 'Exterior / Lujo' },
  { name: 'Jardín amplio', icon: 'Trees', category: 'Exterior / Lujo' },
  { name: 'Terraza con vista', icon: 'Mountain', category: 'Exterior / Lujo' },
  { name: 'Fogatero', icon: 'FireExtinguisher', category: 'Exterior / Lujo' }, // FireExtinguisher as placeholder for fire pit
  { name: 'Camastros', icon: 'Sun', category: 'Exterior / Lujo' },
  { name: 'Comedor exterior', icon: 'Table', category: 'Exterior / Lujo' },
  { name: 'Hamacas', icon: 'Palmtree', category: 'Exterior / Lujo' },
  { name: 'Caldera', icon: 'Zap', category: 'Exterior / Lujo' },
  { name: 'Alberca climatizada', icon: 'ThermometerSun', category: 'Exterior / Lujo' },

  // ENTRETENIMIENTO
  { name: 'Bocinas / sistema de sonido', icon: 'Speaker', category: 'Entretenimiento' },
  { name: 'Área para eventos', icon: 'PartyPopper', category: 'Entretenimiento' },
  { name: 'Mesa de billar', icon: 'Circle', category: 'Entretenimiento' },
  { name: 'Ping pong', icon: 'Trophy', category: 'Entretenimiento' },
  { name: 'Luces ambientales', icon: 'Lightbulb', category: 'Entretenimiento' },
  { name: 'Espacio para fiestas', icon: 'Music', category: 'Entretenimiento' },

  // SEGURIDAD / EXTRA
  { name: 'Pet friendly', icon: 'Dog', category: 'Seguridad / Extra' },
  { name: 'Seguridad / acceso privado', icon: 'ShieldCheck', category: 'Seguridad / Extra' },
  { name: 'Check-in autónomo', icon: 'Key', category: 'Seguridad / Extra' },
  { name: 'Limpieza incluida', icon: 'Sparkles', category: 'Seguridad / Extra' },
  { name: 'Cámaras exteriores', icon: 'Cctv', category: 'Seguridad / Extra' },
  { name: 'Cercado', icon: 'Fence', category: 'Seguridad / Extra' },
];
