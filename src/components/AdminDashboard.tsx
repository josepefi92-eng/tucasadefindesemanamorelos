import { useState, useEffect, FormEvent } from 'react';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, writeBatch, setDoc, where } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { Property, Amenity } from '../types';
import { Plus, Edit2, Trash2, X, Save, Image as ImageIcon, Database, Calendar as CalendarIcon, Car, Dog, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { properties as initialProperties } from '../data/properties';
import { INITIAL_AMENITIES } from '../constants/amenities';
import AmenityIcon from './AmenityIcon';
import { DayPicker } from 'react-day-picker';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { generateSlug } from '../lib/utils';
import 'react-day-picker/dist/style.css';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: any, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function AdminDashboard() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [allAmenities, setAllAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isSeedingAmenities, setIsSeedingAmenities] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Partial<Property> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAmenityModalOpen, setIsAmenityModalOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<Partial<Amenity> | null>(null);
  const [confirmDeleteAmenityId, setConfirmDeleteAmenityId] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (isAdmin) {
      fetchProperties();
      fetchAmenities();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (editingProperty?.blockedDates) {
      setSelectedDates(editingProperty.blockedDates.map(d => parseISO(d)));
    } else {
      setSelectedDates([]);
    }
  }, [editingProperty?.id]);

  const fetchProperties = async () => {
    const path = 'properties';
    try {
      const q = query(collection(db, path), orderBy('title'));
      const querySnapshot = await getDocs(q);
      const props = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(props);
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  const fetchAmenities = async () => {
    const path = 'amenities';
    try {
      const querySnapshot = await getDocs(collection(db, path));
      const ams = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Amenity));
      setAllAmenities(ams);
    } catch (error) {
      console.error("Error fetching amenities:", error);
    }
  };

  const handleSeedAmenities = async () => {
    try {
      console.log("Starting handleSeedAmenities execution...");
      setIsSeedingAmenities(true);
      const path = 'amenities';
      
      // Fetch existing amenities to avoid duplicates
      const existingSnapshot = await getDocs(collection(db, path));
      const existingNames = new Set(existingSnapshot.docs.map(doc => doc.data().name));
      
      for (const am of INITIAL_AMENITIES) {
        if (existingNames.has(am.name)) {
          console.log(`Skipping duplicate amenity: ${am.name}`);
          continue;
        }
        try {
          console.log("Attempting to add amenity:", am.name);
          await addDoc(collection(db, path), am);
        } catch (innerError) {
          console.error(`Failed to add amenity ${am.name}:`, innerError);
        }
      }
      
      console.log("Seeding process finished");
      alert('Amenidades cargadas con éxito (se omitieron duplicados).');
      await fetchAmenities();
    } catch (error) {
      console.error("CRITICAL ERROR in handleSeedAmenities:", error);
      alert("Error crítico al cargar: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsSeedingAmenities(false);
    }
  };

  const handleSaveAmenity = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingAmenity) return;

    const path = 'amenities';
    try {
      const amenityData = {
        name: editingAmenity.name,
        icon: editingAmenity.icon,
        category: editingAmenity.category,
      };

      if (editingAmenity.id) {
        await updateDoc(doc(db, path, editingAmenity.id), amenityData);
        showNotification('Amenidad actualizada con éxito.', 'success');
      } else {
        await addDoc(collection(db, path), amenityData);
        showNotification('Amenidad creada con éxito.', 'success');
      }
      setEditingAmenity(null);
      await fetchAmenities();
    } catch (error: any) {
      console.error("Error saving amenity:", error);
      showNotification("Error al guardar amenidad: " + error.message, 'error');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleEditAmenity = (amenity: Amenity) => {
    setEditingAmenity(amenity);
    // Scroll to form for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteAmenity = async (id: string) => {
    if (!id) return;
    
    const path = `amenities/${id}`;
    console.log("Attempting to delete amenity:", id);
    
    try {
      await deleteDoc(doc(db, 'amenities', id));
      console.log("Amenity deleted successfully:", id);
      showNotification('Amenidad eliminada con éxito.', 'success');
      setConfirmDeleteAmenityId(null);
      await fetchAmenities();
    } catch (error: any) {
      console.error("Error deleting amenity:", error);
      showNotification("Error al eliminar amenidad: " + error.message, 'error');
    }
  };

  const handleSeed = async () => {
    if (!window.confirm('¿Quieres cargar las propiedades iniciales en la base de datos?')) return;
    setIsSeeding(true);
    const path = 'properties';
    try {
      const batch = writeBatch(db);
      for (const prop of initialProperties) {
        const { id, ...data } = prop;
        const newDocRef = doc(collection(db, path));
        // Simple slug for seeding (assumes initial data has unique titles or we don't care as much for seed)
        const baseSlug = generateSlug(data.title);
        batch.set(newDocRef, {
          ...data,
          slug: baseSlug,
          createdAt: new Date().toISOString(),
        });
      }
      await batch.commit();
      alert('Propiedades cargadas con éxito.');
      fetchProperties();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setIsSeeding(false);
    }
  };

  const getUniqueSlug = async (title: string, currentId?: string) => {
    const baseSlug = generateSlug(title);
    let uniqueSlug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const q = query(collection(db, 'properties'), where('slug', '==', uniqueSlug));
      const querySnapshot = await getDocs(q);
      
      const otherDocs = querySnapshot.docs.filter(doc => doc.id !== currentId);
      if (otherDocs.length === 0) {
        isUnique = true;
      } else {
        uniqueSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }
    return uniqueSlug;
  };

  const handleMigrateSlugs = async () => {
    if (!window.confirm('¿Quieres generar slugs para todas las propiedades existentes? Esto arreglará los enlaces rotos.')) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'properties'));
      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      let count = 0;
      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        // Generate unique slug (checking against what's already in the snapshot to avoid collisions within migration)
        const newSlug = await getUniqueSlug(data.title, docSnap.id);
        batch.update(doc(db, 'properties', docSnap.id), { slug: newSlug });
        count++;
      }
      
      await batch.commit();
      showNotification(`${count} propiedades actualizadas con éxito.`, 'success');
      fetchProperties();
    } catch (error: any) {
      console.error("Error migrating slugs:", error);
      showNotification("Error al migrar slugs: " + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProperty) return;

    const path = 'properties';
    const blockedDates = selectedDates.map(d => format(d, 'yyyy-MM-dd'));
    
    try {
      const slug = await getUniqueSlug(editingProperty.title || '', editingProperty.id);

      const propertyData = {
        ...editingProperty,
        slug,
        images: (editingProperty.images || []).filter(url => url.trim() !== ''),
        blockedDates,
        updatedAt: new Date().toISOString(),
      };

      if (editingProperty.id) {
        const { id, ...data } = propertyData;
        await updateDoc(doc(db, path, id as string), data as any);
      } else {
        await addDoc(collection(db, path), {
          ...propertyData,
          createdAt: new Date().toISOString(),
        });
      }
      setIsModalOpen(false);
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta propiedad?')) {
      const path = `properties/${id}`;
      try {
        await deleteDoc(doc(db, 'properties', id));
        fetchProperties();
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, path);
      }
    }
  };

  if (authLoading) return <div className="pt-32 text-center">Cargando...</div>;
  if (!isAdmin) return <div className="pt-32 text-center text-red-500 font-bold">Acceso Denegado. Debes ser administrador.</div>;

  return (
    <div className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900">Panel de <span className="text-brand-purple">Administración</span></h1>
          <p className="text-gray-500 mt-2">Gestiona las casas, departamentos y su disponibilidad.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={handleMigrateSlugs}
            className="bg-brand-teal/10 text-brand-teal px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-teal/20 transition-all"
            title="Generar slugs amigables para todas las propiedades"
          >
            <Sparkles className="w-5 h-5" />
            Arreglar Enlaces (Slugs)
          </button>
          <button 
            onClick={() => setIsAmenityModalOpen(true)}
            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all"
          >
            <Sparkles className="w-5 h-5" />
            Gestionar Amenidades
          </button>
          <button 
            onClick={handleSeedAmenities}
            disabled={isSeedingAmenities}
            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50"
            title="Carga forzada de amenidades si el gestor no responde"
          >
            <Database className="w-5 h-5" />
            {isSeedingAmenities ? 'Cargando...' : 'Cargar Amenidades'}
          </button>
          <button 
            onClick={handleSeed}
            disabled={isSeeding}
            className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            <Database className="w-5 h-5" />
            {isSeeding ? 'Cargando...' : 'Cargar Iniciales'}
          </button>
          <button 
            onClick={() => { 
              setEditingProperty({ 
                parking: 0, 
                petsAllowed: false, 
                images: [], 
                amenities: [],
                coordinates: { lat: 18.922, lng: -99.234 }
              }); 
              setIsModalOpen(true); 
            }}
            className="bg-brand-purple text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-purple/90 transition-all shadow-lg shadow-brand-purple/20"
          >
            <Plus className="w-5 h-5" />
            Nueva Propiedad
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">Cargando propiedades...</div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-gray-100 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Propiedad</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider">Ubicación</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-center">Capacidad</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-center">Estacionamiento</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-center">Mascotas</th>
                <th className="px-6 py-4 font-bold text-gray-600 uppercase text-xs tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.map((prop) => (
                <tr key={prop.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={prop.mainImage} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <span className="font-bold text-gray-900">{prop.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{prop.location}</td>
                  <td className="px-6 py-4 text-center text-gray-600 font-medium">{prop.capacity} pers.</td>
                  <td className="px-6 py-4 text-center text-gray-600">{prop.parking} autos</td>
                  <td className="px-6 py-4 text-center">
                    {prop.petsAllowed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Sí</span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => { setEditingProperty(prop); setIsModalOpen(true); }}
                        className="p-2 text-gray-400 hover:text-brand-purple hover:bg-brand-purple/10 rounded-lg transition-all"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(prop.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl p-8 md:p-12"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-display font-bold text-gray-900 mb-8">
                {editingProperty?.id ? 'Editar' : 'Nueva'} <span className="text-brand-purple">Propiedad</span>
              </h2>

              <form onSubmit={handleSave} className="space-y-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Título</label>
                        <input 
                          required
                          type="text"
                          value={editingProperty?.title || ''}
                          onChange={e => setEditingProperty({...editingProperty, title: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all"
                          placeholder="Ej: Villa Paraíso"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Ubicación</label>
                        <input 
                          required
                          type="text"
                          value={editingProperty?.location || ''}
                          onChange={e => setEditingProperty({...editingProperty, location: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all"
                          placeholder="Ej: Cuernavaca, Morelos"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Capacidad (Personas)</label>
                        <input 
                          required
                          type="number"
                          value={editingProperty?.capacity || ''}
                          onChange={e => setEditingProperty({...editingProperty, capacity: Number(e.target.value)})}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Recámaras</label>
                        <input 
                          required
                          type="number"
                          value={editingProperty?.bedrooms || ''}
                          onChange={e => setEditingProperty({...editingProperty, bedrooms: Number(e.target.value)})}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Baños</label>
                        <input 
                          required
                          type="number"
                          value={editingProperty?.bathrooms || ''}
                          onChange={e => setEditingProperty({...editingProperty, bathrooms: Number(e.target.value)})}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Estacionamiento (Autos)</label>
                        <div className="relative">
                          <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input 
                            required
                            type="number"
                            value={editingProperty?.parking || 0}
                            onChange={e => setEditingProperty({...editingProperty, parking: Number(e.target.value)})}
                            className="w-full pl-12 pr-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Precio desde ($)</label>
                        <input 
                          type="number"
                          value={editingProperty?.priceFrom || ''}
                          onChange={e => setEditingProperty({...editingProperty, priceFrom: Number(e.target.value)})}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all"
                          placeholder="Ej: 2500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                      <Dog className="w-6 h-6 text-brand-purple" />
                      <div className="flex-grow">
                        <p className="font-bold text-gray-900">¿Se aceptan mascotas?</p>
                        <p className="text-xs text-gray-500">Indica si la propiedad es amigable con animales.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProperty({...editingProperty, petsAllowed: !editingProperty?.petsAllowed})}
                        className={`w-14 h-8 rounded-full transition-all relative ${editingProperty?.petsAllowed ? 'bg-brand-teal' : 'bg-gray-300'}`}
                      >
                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${editingProperty?.petsAllowed ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Descripción</label>
                      <textarea 
                        required
                        rows={6}
                        value={editingProperty?.description || ''}
                        onChange={e => setEditingProperty({...editingProperty, description: e.target.value})}
                        className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all resize-none whitespace-pre-wrap"
                        placeholder="Describe la propiedad..."
                      />
                    </div>

                    <div className="space-y-6">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-wider block">Amenidades</label>
                      {['Básicas', 'Exterior / Lujo', 'Entretenimiento', 'Seguridad / Extra'].map(category => (
                        <div key={category} className="space-y-3">
                          <h4 className="text-xs font-bold text-brand-purple uppercase tracking-widest">{category}</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {allAmenities.filter(am => am.category === category).map(amenity => {
                              const isSelected = (editingProperty?.amenities || []).includes(amenity.id);
                              return (
                                <button
                                  key={amenity.id}
                                  type="button"
                                  onClick={() => {
                                    const current = editingProperty?.amenities || [];
                                    const next = isSelected 
                                      ? current.filter(id => id !== amenity.id)
                                      : [...current, amenity.id];
                                    setEditingProperty({...editingProperty, amenities: next});
                                  }}
                                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                                    isSelected 
                                      ? 'bg-brand-purple/5 border-brand-purple text-brand-purple' 
                                      : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'
                                  }`}
                                >
                                  <AmenityIcon name={amenity.icon} className={`w-4 h-4 ${isSelected ? 'text-brand-purple' : 'text-gray-400'}`} />
                                  <span className="text-xs font-bold">{amenity.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {allAmenities.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No hay amenidades cargadas. Usa el botón "Cargar Amenidades" en el panel principal.</p>
                      )}
                    </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Imagen Principal (URL)</label>
                        <input 
                          required
                          type="url"
                          value={editingProperty?.mainImage || ''}
                          onChange={e => setEditingProperty({...editingProperty, mainImage: e.target.value})}
                          className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-brand-purple transition-all"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Galería de Imágenes</label>
                          <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-md font-bold text-gray-400">
                            {(editingProperty?.images || []).length} fotos
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {(editingProperty?.images || []).map((url, idx) => (
                            <div key={idx} className="flex flex-col gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                              <div className="flex gap-2">
                                <input 
                                  type="url"
                                  value={url}
                                  onChange={e => {
                                    const newImages = [...(editingProperty?.images || [])];
                                    newImages[idx] = e.target.value;
                                    setEditingProperty({...editingProperty, images: newImages});
                                  }}
                                  className="flex-grow px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple transition-all text-sm"
                                  placeholder="https://..."
                                />
                                <button 
                                  type="button"
                                  onClick={() => {
                                    const newImages = (editingProperty?.images || []).filter((_, i) => i !== idx);
                                    setEditingProperty({...editingProperty, images: newImages});
                                  }}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              {url && (
                                <div className="mt-2 aspect-video rounded-lg overflow-hidden border border-gray-200">
                                  <img src={url} alt={`Preview ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                              )}
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => setEditingProperty({...editingProperty, images: [...(editingProperty?.images || []), '']})}
                            className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 hover:border-brand-purple hover:text-brand-purple transition-all text-sm font-bold flex items-center justify-center gap-2 bg-white"
                          >
                            <Plus className="w-5 h-5" />
                            Añadir imagen a la galería
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Right Column: Availability */}
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="w-5 h-5 text-brand-purple" />
                          <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Calendario de Disponibilidad</label>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Selecciona las fechas que deseas **bloquear** (no disponibles).</p>
                        <div className="bg-gray-50 p-6 rounded-[2rem] flex justify-center">
                          <DayPicker
                            mode="multiple"
                            selected={selectedDates}
                            onSelect={(dates) => setSelectedDates(dates || [])}
                            locale={es}
                            className="admin-calendar"
                            modifiers={{
                              blocked: selectedDates
                            }}
                            modifiersClassNames={{
                              blocked: 'bg-red-500 text-white rounded-full'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-8 border-t border-gray-100">
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-8 py-4 text-gray-500 font-bold hover:text-gray-700 transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="bg-brand-purple text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-purple/90 transition-all shadow-xl shadow-brand-purple/30"
                    >
                      <Save className="w-5 h-5" />
                      Guardar Propiedad
                    </button>
                  </div>
                </form>
              </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Amenity Manager Modal */}
      <AnimatePresence>
        {isAmenityModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAmenityModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-display font-bold text-gray-900">Gestionar <span className="text-brand-purple">Amenidades</span></h2>
                  <p className="text-sm text-gray-500">Activa o elimina las amenidades disponibles en el sistema.</p>
                </div>
                <button 
                  onClick={() => setIsAmenityModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8">
                {/* Add/Edit Amenity Form */}
                <div className="mb-10 bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    {editingAmenity?.id ? <Edit2 className="w-5 h-5 text-brand-purple" /> : <Plus className="w-5 h-5 text-brand-purple" />}
                    {editingAmenity?.id ? 'Editar' : 'Nueva'} Amenidad
                  </h3>
                  <form onSubmit={handleSaveAmenity} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</label>
                      <input 
                        required
                        type="text"
                        value={editingAmenity?.name || ''}
                        onChange={e => setEditingAmenity({...editingAmenity, name: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple transition-all"
                        placeholder="Ej: Alberca Climatizada"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Icono (Lucide)</label>
                      <select 
                        required
                        value={editingAmenity?.icon || ''}
                        onChange={e => setEditingAmenity({...editingAmenity, icon: e.target.value})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple transition-all"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Wifi">Wifi</option>
                        <option value="Waves">Alberca (Waves)</option>
                        <option value="Car">Cochera (Car)</option>
                        <option value="Tv">TV</option>
                        <option value="Coffee">Café</option>
                        <option value="Utensils">Cocina</option>
                        <option value="Wind">Aire Acondicionado</option>
                        <option value="Flame">Fogata / Parrilla</option>
                        <option value="Shield">Seguridad</option>
                        <option value="Users">Capacidad</option>
                        <option value="Dog">Mascotas</option>
                        <option value="Sparkles">Lujo</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</label>
                      <select 
                        required
                        value={editingAmenity?.category || ''}
                        onChange={e => setEditingAmenity({...editingAmenity, category: e.target.value as any})}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-brand-purple transition-all"
                      >
                        <option value="">Seleccionar...</option>
                        <option value="Básicas">Básicas</option>
                        <option value="Exterior / Lujo">Exterior / Lujo</option>
                        <option value="Entretenimiento">Entretenimiento</option>
                        <option value="Seguridad / Extra">Seguridad / Extra</option>
                      </select>
                    </div>
                    <div className="md:col-span-3 flex justify-end gap-3 mt-2">
                      {editingAmenity && (
                        <button 
                          type="button"
                          onClick={() => setEditingAmenity(null)}
                          className="px-6 py-3 text-gray-500 font-bold hover:text-gray-700 transition-all"
                        >
                          Cancelar
                        </button>
                      )}
                      <button 
                        type="submit"
                        className="bg-brand-purple text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-purple/90 transition-all shadow-lg shadow-brand-purple/20"
                      >
                        <Save className="w-5 h-5" />
                        {editingAmenity?.id ? 'Actualizar' : 'Crear'} Amenidad
                      </button>
                    </div>
                  </form>
                </div>

                {allAmenities.length === 0 ? (
                  <div className="text-center py-12">
                    <Sparkles className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">No hay amenidades en el sistema.</p>
                    <button 
                      onClick={handleSeedAmenities}
                      disabled={isSeedingAmenities}
                      className="bg-brand-purple text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-purple/90 transition-all disabled:opacity-50"
                    >
                      {isSeedingAmenities ? 'Cargando...' : 'Cargar Lista Inicial'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {['Básicas', 'Exterior / Lujo', 'Entretenimiento', 'Seguridad / Extra'].map(category => {
                      const categoryAms = allAmenities.filter(am => am.category === category);
                      if (categoryAms.length === 0) return null;
                      return (
                        <div key={category} className="space-y-4">
                          <h3 className="text-sm font-bold text-brand-purple uppercase tracking-widest">{category}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {categoryAms.map(amenity => (
                              <div key={amenity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 group">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <AmenityIcon name={amenity.icon} className="w-5 h-5 text-brand-purple" />
                                  </div>
                                  <span className="font-bold text-gray-700">{amenity.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {confirmDeleteAmenityId === amenity.id ? (
                                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-red-100">
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAmenity(amenity.id);
                                        }}
                                        className="px-3 py-2 text-xs font-bold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                                      >
                                        Sí, borrar
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setConfirmDeleteAmenityId(null);
                                        }}
                                        className="px-3 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-all"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <>
                                      <button 
                                        onClick={() => handleEditAmenity(amenity)}
                                        className="p-3 text-brand-purple hover:bg-brand-purple/5 rounded-xl transition-all border border-transparent hover:border-brand-purple/20 bg-white shadow-sm flex items-center justify-center font-bold"
                                        title="Editar amenidad"
                                      >
                                        <Edit2 className="w-5 h-5" />
                                      </button>
                                      <button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setConfirmDeleteAmenityId(amenity.id);
                                        }}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 bg-white shadow-sm flex items-center justify-center"
                                        title="Eliminar amenidad"
                                      >
                                        <Trash2 className="w-5 h-5" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                <p className="text-xs text-gray-400 font-medium">Total: {allAmenities.length} amenidades</p>
                <button 
                  onClick={() => setIsAmenityModalOpen(false)}
                  className="bg-brand-purple text-white px-8 py-3 rounded-2xl font-bold hover:bg-brand-purple/90 transition-all"
                >
                  Listo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border-2 ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white border-green-400' 
                : 'bg-red-500 text-white border-red-400'
            }`}
          >
            {notification.type === 'success' ? <Sparkles className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .admin-calendar {
          margin: 0;
        }
        .rdp-day_selected {
          background-color: #ef4444 !important;
          color: white !important;
        }
        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
          background-color: #f3f4f6 !important;
        }
      `}</style>
    </div>
  );
}
