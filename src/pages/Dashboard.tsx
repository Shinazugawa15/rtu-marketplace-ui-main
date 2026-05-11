import { useState, useEffect } from 'react';
import { ShoppingBag, Heart, BarChart2, Settings, MessageSquare, Plus, Trash2, Edit } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn, formatPrice } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard({ user }: { user: any }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'listings';
  const [listings, setListings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        setListings(data.filter((l: any) => l.seller_id === user.id));
        // Mock favorites
        setFavorites(data.slice(0, 2));
        setLoading(false);
      });
  }, [user.id]);

  const tabs = [
    { id: 'listings', label: 'My Listings', icon: ShoppingBag },
    { id: 'favorites', label: 'Wishlist', icon: Heart },
    { id: 'analytics', label: 'Performance', icon: BarChart2 },
    { id: 'settings', label: 'Account', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
          <div className="p-6 bg-primary text-white text-center">
             <div className="w-20 h-20 bg-secondary rounded-full mx-auto mb-3 flex items-center justify-center text-primary font-bold text-3xl">
               {user.name[0]}
             </div>
             <h3 className="font-bold text-lg">{user.name}</h3>
             <p className="text-blue-200 text-xs">RTU Student Seller</p>
          </div>
          <nav className="p-2">
            {tabs.map(tab => (
              <button 
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all",
                  currentTab === tab.id ? "bg-primary/5 text-primary" : "text-gray-500 hover:bg-gray-50"
                )}
              >
                <tab.icon className={cn("w-5 h-5", currentTab === tab.id ? "text-primary" : "text-gray-400")} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-extrabold text-primary capitalize">{currentTab.replace('_', ' ')}</h2>
          {currentTab === 'listings' && (
            <Link to="/create" className="bg-secondary text-primary font-bold px-6 py-2.5 rounded-2xl flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-secondary/20">
              <Plus className="w-5 h-5" /> Post Item
            </Link>
          )}
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-48 animate-pulse text-gray-400">Loading your data...</div>
          ) : (
            <AnimatePresence mode="wait">
              {currentTab === 'listings' && (
                <motion.div 
                   key="listings"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="space-y-4"
                >
                  {listings.length > 0 ? listings.map(list => (
                    <div key={list.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-primary/20 transition-all">
                       <img src={list.images?.[0]} className="w-24 h-24 object-cover rounded-2xl" />
                       <div className="flex-grow">
                          <h4 className="font-bold text-lg">{list.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                             <p className="text-primary font-bold">{formatPrice(list.price)}</p>
                             <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
                          </div>
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                             <div className="flex items-center gap-1"><BarChart2 className="w-3 h-3" /> 142 views</div>
                             <div className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> 3 chats</div>
                          </div>
                       </div>
                       <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100"><Edit className="w-4 h-4" /></button>
                          <button className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100"><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>
                  )) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                       <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                       <h3 className="text-xl font-bold text-gray-400">You haven't listed anything yet</h3>
                       <Link to="/create" className="text-primary font-bold mt-4 inline-block underline">Start selling now</Link>
                    </div>
                  )}
                </motion.div>
              )}

              {currentTab === 'favorites' && (
                <motion.div 
                   key="favorites"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                >
                  {favorites.map(fav => (
                    <div key={fav.id} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex gap-4">
                       <img src={fav.images?.[0]} className="w-20 h-20 object-cover rounded-xl" />
                       <div className="flex flex-col justify-center">
                          <h4 className="font-bold text-sm line-clamp-1">{fav.title}</h4>
                          <p className="text-primary font-bold">{formatPrice(fav.price)}</p>
                          <Link to={`/product/${fav.id}`} className="text-[10px] text-gray-400 font-bold hover:text-primary underline mt-1">View Details</Link>
                       </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {currentTab === 'analytics' && (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                   <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-2">
                      <p className="text-sm text-gray-500 font-medium">Total Views</p>
                      <h4 className="text-4xl font-extrabold text-primary">1,204</h4>
                      <p className="text-green-500 text-xs font-bold">+12% from last wk</p>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-2">
                      <p className="text-sm text-gray-500 font-medium">Potential Buyers</p>
                      <h4 className="text-4xl font-extrabold text-primary">28</h4>
                      <p className="text-green-500 text-xs font-bold">+5 new today</p>
                   </div>
                   <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center space-y-2">
                      <p className="text-sm text-gray-500 font-medium">Estimated Revenue</p>
                      <h4 className="text-4xl font-extrabold text-primary">₱8,450</h4>
                      <p className="text-gray-400 text-xs font-bold">Unrealized gains</p>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
