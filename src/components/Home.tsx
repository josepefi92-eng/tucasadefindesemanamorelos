import Hero from './Hero';
import PropertyCard from './PropertyCard';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import { motion } from 'motion/react';
import { useState, useMemo, useEffect } from 'react';
import { Search } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { Property } from '../types';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ location: '', guests: 1 });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const q = query(collection(db, 'properties'), orderBy('title'));
        const querySnapshot = await getDocs(q);
        const props = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
        setProperties(props);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesLocation = filter.location === '' || p.location.toLowerCase().includes(filter.location.toLowerCase());
      const matchesGuests = p.capacity >= filter.guests;
      return matchesLocation && matchesGuests;
    });
  }, [filter, properties]);

  const handleSearch = (newFilters: { location: string; guests: number }) => {
    setFilter(newFilters);
  };

  return (
    <main>
      <Hero onSearch={handleSearch} />
      
      <section id="propiedades" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Nuestras <span className="text-brand-purple italic">Propiedades</span>
            </h2>
            <p className="text-gray-500 max-w-xl text-lg">
              Seleccionamos las mejores casas para que tu única preocupación sea disfrutar.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Todas', 'Cuernavaca', 'Oaxtepec', 'Tequesquitengo', 'Tepoztlán', 'Cocoyoc'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(prev => ({ ...prev, location: cat === 'Todas' ? '' : cat }))}
                className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                  (cat === 'Todas' && filter.location === '') || filter.location === cat
                    ? 'bg-brand-purple border-brand-purple text-white shadow-xl shadow-brand-purple/30 scale-105'
                    : 'bg-white border-gray-100 text-gray-500 hover:border-brand-purple hover:text-brand-purple hover:shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-32">
            <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 font-bold">Cargando propiedades...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredProperties.map((property, idx) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.05 }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-gray-100 shadow-inner">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-2xl font-display font-bold text-gray-900 mb-2">No encontramos casas con esos criterios</p>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Intenta ajustar tus filtros de ubicación o número de huéspedes para ver más opciones.</p>
            <button 
              onClick={() => setFilter({ location: '', guests: 1 })}
              className="bg-brand-purple text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-brand-purple/90 transition-all shadow-lg shadow-brand-purple/20"
            >
              Ver todas las propiedades
            </button>
          </div>
        )}
      </section>

      <Testimonials />
      <FAQ />

      {/* Why Morelos Section */}
      <section className="bg-brand-warm py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://res.cloudinary.com/dluthskrh/image/upload/v1778705605/VEN-VIVE-Y-REDESCUBRE-CUERNAVACA-ESTA-SEMANA-SANTA_tjaepo.jpg" 
                  alt="Cuernavaca Morelos" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl max-w-xs hidden md:block border border-gray-100">
                <p className="text-brand-teal font-bold text-3xl mb-1">365</p>
                <p className="text-gray-900 font-bold text-lg mb-2">Días de sol</p>
                <p className="text-gray-500 text-sm">Morelos es conocido por su clima perfecto durante todo el año.</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8">
                ¿Por qué elegir <br />
                <span className="text-brand-purple">Morelos</span> para tu descanso?
              </h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">☀️</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Clima Inmejorable</h4>
                    <p className="text-gray-500">La "Eterna Primavera" te garantiza días soleados y noches frescas para disfrutar de la alberca.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🚗</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Cerca de la CDMX</h4>
                    <p className="text-gray-500">A tan solo una hora y media de la capital, es el destino ideal para escapadas de fin de semana.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🌮</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Gastronomía y Cultura</h4>
                    <p className="text-gray-500">Desde cecina de Yecapixtla hasta los pueblos mágicos como Tepoztlán y Tlayacapan.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
