import { motion } from 'motion/react';
import { Search, MapPin, Users } from 'lucide-react';
import { useState } from 'react';

interface HeroProps {
  onSearch: (filters: { location: string; guests: number }) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    onSearch({ location, guests });
    const section = document.getElementById('propiedades');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative min-h-[600px] md:h-[90vh] md:min-h-[700px] flex items-center justify-center overflow-hidden pt-[100px] pb-[150px] md:pt-[150px] md:pb-[50px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://res.cloudinary.com/dluthskrh/image/upload/v1778705001/Diversio%CC%81n_en_familia_junto_a_la_piscina_3_xaogxi.png"
          alt="Alberca de lujo en Morelos"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-brand-warm/20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-block bg-white/10 backdrop-blur-md border border-white/20 px-6 py-2 rounded-full"
        >
          <span className="text-white text-sm font-bold tracking-widest uppercase">Las mejores rentas en Morelos</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-8xl font-display font-bold text-white mb-6 drop-shadow-2xl leading-tight"
        >
          Estilo, Descanso y <br />
          <span className="text-brand-orange italic">Diversión</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-2xl text-white mb-12 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
        >
          Encuentra la casa de tus sueños para este fin de semana. <br className="hidden md:block" />
          Seleccionamos las propiedades más exclusivas con alberca y jardín.
        </motion.p>

        {/* Search Bar UI - Fixed clipping and added Price */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-6xl mx-auto bg-white rounded-[2rem] shadow-2xl p-3 md:p-4 flex flex-col lg:flex-row items-center gap-2 border border-gray-100"
        >
          <div className="flex-1 w-full flex items-center gap-4 px-6 py-4 border-b lg:border-b-0 lg:border-r border-gray-100 hover:bg-gray-50 transition-colors rounded-t-2xl lg:rounded-l-3xl lg:rounded-tr-none">
            <div className="p-3 bg-brand-purple/10 rounded-2xl">
              <MapPin className="text-brand-purple w-6 h-6 flex-shrink-0" />
            </div>
            <div className="text-left w-full overflow-hidden">
              <p className="text-[11px] uppercase font-black text-gray-400 tracking-widest mb-1">Ubicación</p>
              <select 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-base font-bold text-gray-800 bg-transparent border-none focus:ring-0 p-0 cursor-pointer truncate"
              >
                <option value="">Todas las ubicaciones</option>
                <option value="Cuernavaca">Cuernavaca</option>
                <option value="Oaxtepec">Oaxtepec</option>
                <option value="Tequesquitengo">Tequesquitengo</option>
                <option value="Cocoyoc">Cocoyoc</option>
                <option value="Jiutepec">Jiutepec</option>
                <option value="Tepoztlán">Tepoztlán</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-brand-pink/10 rounded-2xl">
              <Users className="text-brand-pink w-6 h-6 flex-shrink-0" />
            </div>
            <div className="text-left w-full">
              <p className="text-[11px] uppercase font-black text-gray-400 tracking-widest mb-1">Huéspedes</p>
              <select 
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full text-base font-bold text-gray-800 bg-transparent border-none focus:ring-0 p-0 cursor-pointer"
              >
                {[1, 2, 4, 6, 8, 10, 12, 15, 20].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Persona' : 'Personas'}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            onClick={handleSearch}
            className="w-full lg:w-auto bg-brand-purple hover:bg-brand-purple/90 text-white px-12 py-5 rounded-2xl lg:rounded-[1.5rem] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-purple/30 group"
          >
            <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
            <span>Buscar</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
