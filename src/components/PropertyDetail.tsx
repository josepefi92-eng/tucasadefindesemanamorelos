import { useParams, Link, useNavigate } from 'react-router-dom';
import { Users, Bed, Bath, MapPin, Check, ChevronLeft, MessageCircle, Star, Car, Dog, Calendar as CalendarIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { Property, Amenity } from '../types';
import WhatsAppButton from './WhatsAppButton';
import ImageGallery from 'react-image-gallery';
import AmenityIcon from './AmenityIcon';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { DayPicker } from 'react-day-picker';
import { parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import 'react-image-gallery/styles/image-gallery.css';
import 'leaflet/dist/leaflet.css';
import 'react-day-picker/dist/style.css';
import L from 'leaflet';

// Fix Leaflet marker icon issue
// @ts-ignore
import markerIcon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function PropertyDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchData = async () => {
      if (!slug) return;
      try {
        // Fetch Property by slug
        const q = query(collection(db, 'properties'), where('slug', '==', slug));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setProperty({ id: docSnap.id, ...docSnap.data() } as Property);
        }

        // Fetch All Amenities
        const amenitiesSnap = await getDocs(collection(db, 'amenities'));
        const ams = amenitiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Amenity));
        setAllAmenities(ams);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-bold">Cargando detalles...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <MapPin className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">Propiedad no encontrada</h2>
        <p className="text-gray-500 mb-8">Lo sentimos, no pudimos encontrar la casa que buscas.</p>
        <Link to="/" className="bg-brand-purple text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-brand-purple/20">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const phoneNumber = "527774896062";
  const message = encodeURIComponent(`Hola! Me interesa reservar la propiedad: ${property.title}`);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  const galleryImages = [
    { original: property.mainImage, thumbnail: property.mainImage },
    ...(property.images || []).map(img => ({ original: img, thumbnail: img }))
  ];

  const openGallery = (index: number) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const blockedDates = (property.blockedDates || []).map(d => parseISO(d));

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-brand-purple transition-colors mb-6 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Volver
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-brand-purple font-bold text-sm uppercase tracking-widest mb-2">
            <Star className="w-4 h-4 fill-brand-purple" />
            <span>Propiedad Destacada</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="flex-grow">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-brand-purple" />
                <span className="font-medium">{property.location}</span>
              </div>
            </div>
            {property.priceFrom && (
              <div className="bg-brand-purple/5 border border-brand-purple/10 p-6 rounded-[2rem] text-right self-start md:min-w-[200px]">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Precio desde</p>
                <p className="text-4xl font-display font-bold text-brand-purple">${property.priceFrom.toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section - Carousel on mobile, Bento on desktop */}
        <div className="mb-12">
          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 no-scrollbar">
              <div 
                onClick={() => openGallery(0)}
                className="flex-shrink-0 w-[85vw] aspect-[4/3] snap-center rounded-3xl overflow-hidden shadow-lg"
              >
                <img 
                  src={property.mainImage} 
                  alt={property.title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {(property.images || []).map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => openGallery(idx + 1)}
                  className="flex-shrink-0 w-[85vw] aspect-[4/3] snap-center rounded-3xl overflow-hidden shadow-lg"
                >
                  <img 
                    src={img} 
                    alt={`${property.title} ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">
              Desliza para ver más fotos
            </p>
          </div>

          {/* Desktop Bento Grid */}
          <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-4 h-[600px]">
            {/* Main Image */}
            <div 
              onClick={() => openGallery(0)}
              className="md:col-span-2 md:row-span-2 relative group cursor-pointer overflow-hidden rounded-[2.5rem] shadow-lg"
            >
              <img 
                src={property.mainImage} 
                alt={property.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>

            {/* Secondary Images */}
            {(property.images || []).slice(0, 3).map((img, idx) => (
              <div 
                key={idx} 
                onClick={() => openGallery(idx + 1)}
                className={`relative group cursor-pointer overflow-hidden rounded-[2rem] shadow-md ${
                  idx === 2 ? 'md:col-span-2 md:row-span-1' : ''
                }`}
              >
                <img 
                  src={img} 
                  alt={`${property.title} ${idx + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                {idx === 2 && (property.images || []).length > 3 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                    <span className="text-white font-bold text-xl">
                      +{(property.images || []).length - 2} fotos
                    </span>
                  </div>
                )}
              </div>
            ))}

            {/* Fallback if no gallery images */}
            {(!property.images || property.images.length === 0) && (
              <div className="md:col-span-2 row-span-2 bg-gray-50 rounded-[2.5rem] flex items-center justify-center border-2 border-dashed border-gray-200">
                <p className="text-gray-400 font-medium">No hay más fotos disponibles</p>
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Info */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-gray-100 mb-8">
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                <Users className="w-6 h-6 text-brand-purple mb-2" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Capacidad</p>
                <p className="font-bold text-gray-900">{property.capacity} Huéspedes</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                <Bed className="w-6 h-6 text-brand-purple mb-2" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Recámaras</p>
                <p className="font-bold text-gray-900">{property.bedrooms} Dormitorios</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                <Bath className="w-6 h-6 text-brand-purple mb-2" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Baños</p>
                <p className="font-bold text-gray-900">{property.bathrooms} Completos</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl text-center">
                <Car className="w-6 h-6 text-brand-purple mb-2" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Estacionamiento</p>
                <p className="font-bold text-gray-900">{property.parking} Autos</p>
              </div>
            </div>

            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-2xl font-bold text-gray-900">Descripción</h3>
                {property.petsAllowed && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    <Dog className="w-3 h-3" />
                    Mascotas permitidas
                  </div>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
                {property.description}
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Amenidades</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {allAmenities
                  .filter(am => (property.amenities || []).includes(am.id))
                  .map((amenity) => (
                    <div key={amenity.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <AmenityIcon name={amenity.icon} className="w-5 h-5 text-brand-purple" />
                      </div>
                      <span className="font-bold text-gray-700 text-sm">{amenity.name}</span>
                    </div>
                  ))}
              </div>
              {(!property.amenities || property.amenities.length === 0) && (
                <p className="text-gray-400 italic">No hay amenidades especificadas para esta propiedad.</p>
              )}
            </div>

            {/* Map Section */}
            {(property.googleMapsUrl || property.coordinates) && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Ubicación</h3>
                <div className="h-[400px] rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100">
                  {property.googleMapsUrl ? (
                    <iframe 
                      src={property.googleMapsUrl}
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen={true} 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : property.coordinates ? (
                    <MapContainer 
                      center={[property.coordinates.lat, property.coordinates.lng]} 
                      zoom={15} 
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={[property.coordinates.lat, property.coordinates.lng]}>
                        <Popup>
                          {property.title}
                        </Popup>
                      </Marker>
                    </MapContainer>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="w-5 h-5 text-brand-purple" />
                  <h3 className="text-xl font-bold text-gray-900">Disponibilidad</h3>
                </div>
                <div className="bg-gray-50 p-4 rounded-3xl flex justify-center">
                  <DayPicker
                    mode="multiple"
                    selected={blockedDates}
                    disabled={blockedDates}
                    locale={es}
                    className="property-calendar"
                    modifiers={{
                      blocked: blockedDates
                    }}
                    modifiersClassNames={{
                      blocked: 'bg-red-100 text-red-400 line-through cursor-not-allowed'
                    }}
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-4 text-center uppercase font-bold tracking-widest">
                  Las fechas tachadas no están disponibles
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Huéspedes</p>
                  <p className="text-sm font-medium text-gray-700">{property.capacity} personas máx.</p>
                </div>
              </div>

              <a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-brand-purple hover:bg-brand-purple/90 text-white py-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-purple/30"
              >
                <MessageCircle className="w-6 h-6" />
                Consultar por WhatsApp
              </a>
              
              <p className="text-center text-gray-400 text-xs mt-6">
                Consulta disponibilidad y detalles <br />
                directamente con el anfitrión.
              </p>
            </div>
          </div>
        </div>
      </div>
      <WhatsAppButton />
      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
          >
            <button 
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-[110] bg-white/10 p-2 rounded-full backdrop-blur-md"
            >
              <X className="w-8 h-8" />
            </button>
            
            <div className="w-full max-w-6xl h-full flex items-center justify-center">
              <ImageGallery 
                items={galleryImages} 
                startIndex={currentImageIndex}
                showPlayButton={false}
                showFullscreenButton={false}
                showThumbnails={true}
                showIndex={true}
                additionalClass="fullscreen-gallery"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .fullscreen-gallery .image-gallery-image {
          max-height: 70vh;
          object-fit: contain;
          border-radius: 1.5rem;
        }
        .fullscreen-gallery .image-gallery-thumbnail {
          border-radius: 0.75rem;
          overflow: hidden;
          border: 2px solid transparent;
        }
        .fullscreen-gallery .image-gallery-thumbnail.active {
          border-color: #7c3aed;
        }
        .property-calendar {
          margin: 0;
        }
        .rdp-day_selected {
          background-color: transparent !important;
          color: inherit !important;
        }
      `}</style>
    </div>
  );
}
