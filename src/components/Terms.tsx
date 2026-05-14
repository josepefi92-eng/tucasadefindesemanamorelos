import { motion } from 'motion/react';
import { FileText, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-warm rounded-full text-brand-purple font-bold text-sm uppercase tracking-widest mb-4 shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Documentación Legal</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-display font-bold text-gray-900 mb-6"
          >
            Términos y <span className="text-brand-purple italic">Condiciones</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Información importante sobre el proceso de reservación y estancia en nuestras propiedades.
          </motion.p>
        </div>

        <div className="space-y-12 text-gray-600 leading-relaxed">
          <section className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-6 h-6 text-brand-purple" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Proceso de Reservación</h2>
            </div>
            <p className="mb-4">
              Para garantizar tu fecha, se requiere el pago de un <strong>anticipo del 30% del total</strong> de la renta. Este pago puede realizarse vía transferencia, depósito o mediante Mercado Pago.
            </p>
            <p>
              El 70% restante deberá ser liquidado al momento de recibir la propiedad. Sin la liquidación total, no se podrá hacer entrega de las llaves ni permitir el acceso a la casa.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-brand-warm rounded-2xl flex items-center justify-center shadow-sm">
                <Scale className="w-6 h-6 text-brand-purple" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. Depósito de Garantía</h2>
            </div>
            <p className="mb-4">
              Se solicita un depósito de garantía de <strong>$2,000 MXN</strong> por cada reservación. Este depósito tiene como objetivo cubrir posibles daños menores a la propiedad, mobiliario o equipo durante la estancia.
            </p>
            <p>
              Dicho depósito será <strong>totalmente reembolsable</strong> al finalizar el periodo de renta, una vez que se haya verificado que la propiedad se encuentra en las mismas condiciones en que fue entregada.
            </p>
          </section>

          <section className="bg-brand-warm/30 p-8 rounded-[2.5rem]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <AlertCircle className="w-6 h-6 text-brand-purple" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Reglas de la Propiedad</h2>
            </div>
            <ul className="list-disc pl-6 space-y-3">
              <li>El horario de entrada es a las 12:00 PM y la salida a las 4:00 PM del día siguiente.</li>
              <li>El cupo de personas acordado al momento de la reservación debe respetarse estrictamente.</li>
              <li>En casas Pet Friendly, es responsabilidad del dueño la limpieza y cuidado de sus mascotas.</li>
              <li>El ruido excesivo después de las 11:00 PM está sujeto a las reglas de cada fraccionamiento o zona.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Cancelaciones</h2>
            <p>
              En caso de cancelación por parte del cliente, el anticipo del 30% no es reembolsable, pero bajo ciertas condiciones y disponibilidad, podría ser aplicado para una fecha futura si se notifica con al menos 15 días de anticipación.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-400">
            Última actualización: Mayo 2026. Al reservar con EDD Morelos, aceptas estos términos y condiciones.
          </p>
        </div>
      </div>
    </div>
  );
}
