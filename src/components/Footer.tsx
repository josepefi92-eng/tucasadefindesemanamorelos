import { Home, Instagram, Facebook, Mail, Phone, Settings, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Footer() {
  const { isAdmin } = useAuth();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center">
              <img 
                src="https://res.cloudinary.com/dluthskrh/image/upload/v1778704132/Logo_EDD-02_xzp0wj.png"
                alt="EDD Morelos Logo" 
                className="h-12 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="text-gray-500 leading-relaxed">
              Estilo, Descanso y Diversión. Las mejores experiencias vacacionales en el corazón de México.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.facebook.com/share/1AJywWSvyc/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-warm transition-all shadow-sm border border-gray-100"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-brand-purple hover:bg-brand-warm transition-all shadow-sm border border-gray-100"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-6">Explorar</h4>
            <ul className="space-y-4 text-gray-500">
              <li><Link to="/" className="hover:text-brand-orange transition-colors">Inicio</Link></li>
              <li><a href="/#propiedades" className="hover:text-brand-orange transition-colors">Propiedades</a></li>
              {isAdmin && (
                <li>
                  <Link to="/admin" className="text-brand-purple font-bold flex items-center gap-2 hover:opacity-80 transition-all">
                    <Settings className="w-4 h-4" />
                    Administrar Casas
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-6">Soporte</h4>
            <ul className="space-y-4 text-gray-500">
              <li><a href="/#faq" className="hover:text-brand-orange transition-colors">Preguntas Frecuentes</a></li>
              <li><Link to="/terminos" className="hover:text-brand-orange transition-colors">Términos y Condiciones</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gray-900 font-bold mb-6">Contacto</h4>
            <ul className="space-y-4 text-gray-500">
              <li className="flex items-start gap-4">
                <div className="flex flex-col gap-3">
                  <a href="https://wa.me/527774896062" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-medium text-gray-700">+52 777 489 6062</span>
                  </a>
                  <a href="https://wa.me/527775135256" target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange transition-colors flex items-center gap-3 group">
                    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-5 h-5 fill-current" />
                    </div>
                    <span className="font-medium text-gray-700">+52 777 513 5256</span>
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-gray-50 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} EDD Morelos. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
