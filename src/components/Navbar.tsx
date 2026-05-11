import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingBag, MessageSquare, Heart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar({ user, setUser }: { user: any, setUser: any }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white sticky top-0 z-50 shadow-lg border-b-4 border-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <div className="w-7 h-7 bg-primary rounded-full"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight uppercase tracking-tight hidden sm:block">RTU Marketplace</span>
                <span className="text-[10px] uppercase text-secondary font-semibold tracking-widest hidden sm:block">Campus Community Hub</span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-6">
              <Link to="/marketplace" className="hover:text-secondary transition-colors font-medium">Marketplace</Link>
              <Link to="/create" className="hover:text-secondary transition-colors font-medium">Start Selling</Link>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search items..." 
                className="bg-white/10 border border-white/20 rounded-full py-1.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-secondary w-64 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            </div>

            {user ? (
              <div className="flex items-center gap-5">
                <Link title="Messages" to="/chat" className="hover:text-secondary transition-colors relative">
                  <MessageSquare className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
                </Link>
                <Link title="Favorites" to="/dashboard?tab=favorites" className="hover:text-secondary transition-colors">
                  <Heart className="w-6 h-6" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 hover:text-secondary transition-colors">
                    <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center border border-secondary text-secondary font-bold overflow-hidden">
                      {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name[0]}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 border border-gray-100">
                    <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100">My Listings</Link>
                    <Link to={`/profile/${user.id}`} className="block px-4 py-2 hover:bg-gray-100">View Profile</Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 flex items-center gap-2">
                       <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="bg-secondary text-primary px-6 py-2 rounded-full font-bold hover:bg-amber-400 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary-dark border-t border-white/10 px-4 py-4 space-y-4"
          >
            <Link to="/marketplace" className="block text-lg" onClick={() => setIsMenuOpen(false)}>Marketplace</Link>
            <Link to="/create" className="block text-lg" onClick={() => setIsMenuOpen(false)}>Sell Item</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="block text-lg" onClick={() => setIsMenuOpen(false)}>My Account</Link>
                <Link to="/chat" className="block text-lg" onClick={() => setIsMenuOpen(false)}>Messages</Link>
                <button onClick={handleLogout} className="block text-lg text-red-400">Logout</button>
              </>
            ) : (
              <Link to="/auth" className="block text-lg font-bold text-secondary" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
