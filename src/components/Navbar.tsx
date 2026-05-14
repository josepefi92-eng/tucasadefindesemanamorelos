import { Link } from 'react-router-dom';
import { Menu, User, LogIn, LogOut, Settings, MessageCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const { user, isAdmin } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20 sm:h-24">
          <Link to="/" className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dluthskrh/image/upload/v1778704132/Logo_EDD-02_xzp0wj.png"
              alt="EDD Morelos Logo" 
              className="h-12 sm:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-bold uppercase tracking-wider text-gray-600">
            <Link to="/" className="hover:text-brand-purple transition-colors">Inicio</Link>
            <a href="/#propiedades" className="hover:text-brand-teal transition-colors">Propiedades</a>
            {isAdmin && (
              <Link to="/admin" className="text-brand-purple flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Admin
              </Link>
            )}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-gray-900">{user.email}</span>
                    <button 
                      onClick={handleLogout}
                      className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-brand-purple/10 flex items-center justify-center border-2 border-brand-purple/20">
                    <User className="w-5 h-5 text-brand-purple" />
                  </div>
                </div>
              ) : (
                <button 
                  onClick={onLoginClick}
                  className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-brand-purple transition-colors"
                >
                  <LogIn className="w-5 h-5" />
                  Entrar
                </button>
              )}
              <a 
                href="https://wa.me/527774896062" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-brand-purple text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-brand-purple/90 transition-all shadow-lg shadow-brand-purple/20 flex items-center gap-2 group"
              >
                <MessageCircle className="w-5 h-5 fill-white/20 group-hover:scale-110 transition-transform" />
                Contacto Directo
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
