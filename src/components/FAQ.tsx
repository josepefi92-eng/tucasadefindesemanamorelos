import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "¿Cómo realizo una reservación?",
    answer: "Las reservaciones se hacen exclusivamente a través de nuestros canales oficiales de WhatsApp o Facebook, los cuales puedes encontrar directamente en esta página."
  },
  {
    question: "¿Cuáles son los métodos de pago?",
    answer: "Aceptamos depósito, transferencia bancaria o pago con tarjeta de crédito/débito a través de Mercado Pago para tu mayor seguridad."
  },
  {
    question: "¿Se permiten mascotas?",
    answer: "No todas las casas lo permiten, pero contamos con una amplia variedad de propiedades pet-friendly para que tu mascota también disfrute del viaje."
  },
  {
    question: "¿Cuáles son los horarios de Check-in y Check-out?",
    answer: "El horario de entrada (check-in) es a las 12:00 PM y la salida (check-out) es a las 4:00 PM del día siguiente."
  },
  {
    question: "¿Cómo se garantiza la seguridad de mi reservación?",
    answer: "Para tu tranquilidad, solo se requiere un anticipo del 30% para reservar la fecha. El 70% restante se liquida al momento de entregarte la casa."
  },
  {
    question: "¿Se requiere depósito de garantía?",
    answer: "Sí, se solicita un depósito de garantía de $2,000 pesos por posibles daños a la propiedad. Este monto es totalmente reembolsable al finalizar tu estancia si la casa se encuentra en las mismas condiciones en que fue entregada."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-brand-warm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full text-brand-purple font-bold text-sm uppercase tracking-widest mb-4 shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Ayuda</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4"
          >
            Preguntas <span className="text-brand-purple italic">Frecuentes</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Todo lo que necesitas saber antes de tu próxima escapada.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900 text-lg">{faq.question}</span>
                <ChevronDown 
                  className={`w-6 h-6 text-brand-purple transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-8 pb-8 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
