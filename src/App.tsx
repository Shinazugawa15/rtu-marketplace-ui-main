/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetail from './pages/ProductDetail';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreateListing from './pages/CreateListing';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Footer from './components/Footer';

export default function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const ProtectedRoute = ({ children }: { children: any }) => {
    if (!user) return <Navigate to="/auth" />;
    return <>{children}</>;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar user={user} setUser={setUser} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/product/:id" element={<ProductDetail user={user} />} />
            <Route path="/auth" element={<Auth setUser={setUser} />} />
            <Route path="/dashboard" element={<ProtectedRoute children={<Dashboard user={user} />} />} />
            <Route path="/create" element={<ProtectedRoute children={<CreateListing user={user} />} />} />
            <Route path="/chat/:id?" element={<ProtectedRoute children={<Chat user={user} />} />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
