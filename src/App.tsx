/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PropertyDetail from './components/PropertyDetail';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LoginModal from './components/LoginModal';
import Terms from './components/Terms';

export default function App() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar onLoginClick={() => setIsLoginModalOpen(true)} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/propiedad/:slug" element={<PropertyDetail />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/terminos" element={<Terms />} />
          </Routes>
        </div>
        <Footer />
        <WhatsAppButton />
        <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      </div>
    </Router>
  );
}
