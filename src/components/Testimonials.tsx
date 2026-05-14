import { Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alejandra Torres",
    location: "CDMX",
    rating: 5,
    comment: "La casa 7 Gotas en Cuernavaca superó nuestras expectativas. El diseño es único y el área de la alberca es un paraíso privado. ¡Volveremos seguro!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 2,
    name: "Ricardo Mendoza",
    location: "Puebla",
    rating: 5,
    comment: "Excelente fin de semana en Oaxtepec. La casa es moderna, espaciosa y perfecta para familias grandes. La atención de EDD Morelos fue de primera.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 3,
    name: "Sofía García",
    location: "Toluca",
    rating: 5,
    comment: "Increíble estancia en Acapulco. La vista al mar desde la terraza es inmejorable y la casa tiene todo lo necesario para unas vacaciones de lujo.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 4,
    name: "Carlos Rivera",
    location: "Querétaro",
    rating: 5,
    comment: "La casa 7 Gotas en Cuernavaca es simplemente mágica. El clima de la ciudad junto con las comodidades de la casa hicieron de nuestro viaje algo inolvidable.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 5,
    name: "Mariana López",
    location: "Cuernavaca",
    rating: 5,
    comment: "Súper recomendado el servicio para rentar en Oaxtepec. Casas muy limpias, seguras y con albercas impecables. Ideal para niños.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
  },
  {
    id: 6,
    name: "Eduardo Sánchez",
    location: "CDMX",
    rating: 5,
    comment: "Buscábamos una opción cerca de la playa y la casa en Acapulco fue perfecta. Privacidad total y una atención personalizada increíble.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-warm rounded-full text-brand-orange font-bold text-sm uppercase tracking-widest mb-4"
          >
            <Star className="w-4 h-4 fill-brand-orange" />
            <span>Testimonios</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
          >
            Lo que dicen nuestros <span className="text-brand-orange italic">Huéspedes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-2xl mx-auto text-lg"
          >
            La confianza de nuestros clientes es nuestra mejor garantía. Descubre por qué eligen EDD Morelos para sus escapadas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative p-8 bg-brand-warm rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow group"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-brand-orange/10 group-hover:text-brand-orange/20 transition-colors" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-brand-orange fill-brand-orange' : 'text-gray-300'}`} 
                  />
                ))}
              </div>

              <p className="text-gray-700 italic mb-8 leading-relaxed relative z-10">
                "{testimonial.comment}"
              </p>

              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500 font-medium">Desde {testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
