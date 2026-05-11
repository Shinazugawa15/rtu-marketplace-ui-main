import { ArrowRight, ShieldCheck, Zap, Users, Star, ShoppingBag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { formatPrice } from '../lib/utils';

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/listings?limit=4')
      .then(res => res.json())
      .then(data => setFeatured(data));
  }, []);

  const categories = [
    { id: '1', name: 'Books', icon: '📚', count: 124 },
    { id: '2', name: 'Electronics', icon: '💻', count: 45 },
    { id: '3', name: 'Fashion', icon: '👔', count: 89 },
    { id: '4', name: 'Services', icon: '🧠', count: 32 },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[650px] flex items-center justify-center overflow-hidden bg-primary shadow-2xl border-b-8 border-secondary">
        <div className="absolute inset-0 z-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1541339907198-e08759df9a13?q=80&w=2070&auto=format&fit=crop" 
            alt="University Background"
            className="w-full h-full object-cover mix-blend-luminosity"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
              <Star className="w-4 h-4 fill-primary" />
              <span>Campus Hub for RTUians</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              TRADE <span className="text-secondary">SMARTER</span> ON CAMPUS
            </h1>
            <p className="text-xl text-blue-100 max-w-xl font-medium leading-relaxed">
              The official student-led marketplace. Buy from seniors, sell to freshmen. Clean your dorm, fill your wallet.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/marketplace" 
                className="bg-secondary text-primary font-black px-10 py-5 rounded-2xl text-lg flex items-center gap-3 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,184,28,0.4)]"
              >
                Browse Marketplace <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/create" 
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-10 py-5 rounded-2xl text-lg border border-white/30 backdrop-blur-md transition-all"
              >
                Start Selling
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="hidden lg:block relative"
          >
            <div className="bg-white rounded-3xl p-6 shadow-2xl space-y-6 max-w-sm ml-auto transform rotate-3">
              <div className="aspect-[4/3] rounded-2xl bg-gray-100 overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1522881451255-f59ad4c00046?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <span className="absolute top-2 right-2 bg-secondary text-primary text-xs font-bold px-2 py-1 rounded">HOT DEAL</span>
              </div>
              <div>
                <h3 className="font-bold text-xl">MacBook Air M2 (Student Discount)</h3>
                <p className="text-primary font-bold text-2xl mt-1">₱52,000</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <span>Seller: Rhenzel James</span>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 rounded-xl">View Deal</button>
            </div>
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold">Featured Categories</h2>
            <p className="text-gray-500">Find exactly what you need for this semester</p>
          </div>
          <Link to="/marketplace" className="text-primary font-bold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <motion.div 
              key={cat.id}
              whileHover={{ y: -5 }}
              className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all cursor-pointer border border-gray-100"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h3 className="font-bold text-xl">{cat.name}</h3>
              <p className="text-gray-400 text-sm">{cat.count} items</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-16">Why trust RTU Marketplace?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-blue-100 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Student-Only Access</h3>
              <p className="text-gray-600">Verification via RTU email ensures that only students can join the platform.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Instant Campus Connection</h3>
              <p className="text-gray-600">Meet-up right at the campus. No expensive shipping fees required.</p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Community Driven</h3>
              <p className="text-gray-600">Built by RTUians, for RTUians. We prioritize school spirit and student needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-primary rounded-[2.5rem] p-12 md:p-20 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Turn your unused items into extra allowance.</h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join 1,000+ RTUians who are already buying and selling locally. Start listing your items in under 60 seconds.
            </p>
            <Link 
              to="/create" 
              className="bg-secondary text-primary font-bold px-10 py-4 rounded-xl text-lg inline-flex items-center gap-2 hover:scale-105 transition-transform"
            >
              List an Item Now <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>
          <div className="absolute top-0 right-0 h-full w-1/3 hidden lg:block overflow-hidden pointer-events-none">
            <div className="w-[150%] h-[150%] bg-secondary/10 absolute -top-1/4 -right-1/4 rounded-full blur-[100px]" />
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <ShoppingBag className="w-48 h-48 text-secondary opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
