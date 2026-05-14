import { Link } from 'react-router-dom';
import { Users, Bed, Bath, Car, Dog } from 'lucide-react';
import { Property } from '../types';
import { motion } from 'motion/react';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <Link to={`/propiedad/${property.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.mainImage} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
          {property.location.split(',')[0]}
        </div>
        {property.petsAllowed && (
          <div className="absolute top-4 right-4 bg-brand-teal/90 backdrop-blur-sm p-2 rounded-full shadow-sm" title="Mascotas permitidas">
            <Dog className="w-4 h-4 text-white" />
          </div>
        )}
      </Link>
      
      <div className="p-6">
        <div className="flex justify-between items-start gap-4 mb-4">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-purple transition-colors line-clamp-2">
            {property.title}
          </h3>
          {property.priceFrom && (
            <div className="text-right flex-shrink-0">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Desde</p>
              <p className="text-lg font-bold text-brand-purple">${property.priceFrom.toLocaleString()}</p>
            </div>
          )}
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="grid grid-cols-4 gap-2 mb-6 text-gray-600">
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
            <Users className="w-4 h-4 text-brand-purple mb-1" />
            <span className="text-[10px] font-bold uppercase text-gray-400">Huésp.</span>
            <span className="text-xs font-bold">{property.capacity}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
            <Bed className="w-4 h-4 text-brand-purple mb-1" />
            <span className="text-[10px] font-bold uppercase text-gray-400">Recám.</span>
            <span className="text-xs font-bold">{property.bedrooms}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
            <Bath className="w-4 h-4 text-brand-purple mb-1" />
            <span className="text-[10px] font-bold uppercase text-gray-400">Baños</span>
            <span className="text-xs font-bold">{property.bathrooms}</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-gray-50 rounded-xl">
            <Car className="w-4 h-4 text-brand-purple mb-1" />
            <span className="text-[10px] font-bold uppercase text-gray-400">Autos</span>
            <span className="text-xs font-bold">{property.parking}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Disponible</span>
          </div>
          <Link 
            to={`/propiedad/${property.id}`}
            className="bg-brand-purple text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-purple/90 transition-all shadow-lg shadow-brand-purple/20"
          >
            Ver detalles
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
