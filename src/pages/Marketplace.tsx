import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List as ListIcon, X, SlidersHorizontal, ChevronDown, ShieldCheck } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function Marketplace() {
  const [listings, setListings] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (search) params.append('search', search);
    if (sort) params.append('sort', sort);

    fetch(`/api/listings?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setListings(data);
        setLoading(false);
      });
  }, [selectedCategory, search, sort]);

  const FilterSection = () => (
    <div className="space-y-8 bg-white p-6 rounded-2xl shadow-card border border-slate-100">
      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Main Categories</h3>
        <div className="space-y-1.5">
          <button 
            onClick={() => setSelectedCategory('')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-semibold",
              !selectedCategory ? "bg-slate-50 text-primary" : "text-slate-600 hover:bg-slate-50"
            )}
          >
            {!selectedCategory && <span className="w-2 h-2 bg-secondary rounded-full"></span>}
            All Items
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-semibold",
                selectedCategory === cat.id ? "bg-slate-50 text-primary" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              {selectedCategory === cat.id && <span className="w-2 h-2 bg-secondary rounded-full"></span>}
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sort By</h3>
        <select 
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="newest">Recently Posted</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </section>

      <section>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Verification</h3>
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold text-primary">RTU-ID Verified</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wider font-semibold">
            Only students with @rtu.edu.ph emails can sell here. Your safety is our priority.
          </p>
        </div>
      </section>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-72 shrink-0">
          <FilterSection />
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl shadow-card border border-slate-100">
            <div className="relative flex-grow w-full max-w-md">
              <input 
                type="text" 
                placeholder="Search for books, tech, dorm essentials..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowMobileFilters(true)}
                className="md:hidden flex items-center gap-2 bg-gray-100 px-4 py-2.5 rounded-xl font-bold"
              >
                <SlidersHorizontal className="w-4 h-4" /> Filters
              </button>
              <div className="hidden sm:flex items-center bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setView('grid')}
                  className={cn("p-1.5 rounded-lg transition-colors", view === 'grid' ? "bg-white shadow-sm text-primary" : "text-gray-400")}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setView('list')}
                  className={cn("p-1.5 rounded-lg transition-colors", view === 'list' ? "bg-white shadow-sm text-primary" : "text-gray-400")}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="bg-white aspect-[4/5] rounded-2xl"></div>
              ))}
            </div>
          ) : listings.length > 0 ? (
            <div className={cn(
              "grid gap-6",
              view === 'grid' ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2"
            )}>
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} compact={view === 'list'} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
               <div className="text-5xl mb-4">🔍</div>
               <h3 className="text-xl font-bold">No items found</h3>
               <p className="text-gray-500">Try adjusting your filters or search terms</p>
               <button 
                 onClick={() => { setSearch(''); setSelectedCategory(''); }}
                 className="mt-6 text-primary font-bold underline"
               >
                 Clear all filters
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setShowMobileFilters(false)}
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-4/5 bg-white p-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
              </div>
              <FilterSection />
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-primary text-white font-bold py-4 rounded-2xl mt-8"
              >
                Show Results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
