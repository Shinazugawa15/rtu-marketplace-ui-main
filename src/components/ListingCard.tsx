import { Link } from 'react-router-dom';
import { MapPin, Heart, Clock, Tag } from 'lucide-react';
import { formatPrice, cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function ListingCard({ listing, compact = false }: { listing: any, compact?: boolean, key?: any }) {
  const images = listing.images || [];
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1544648154-15f26920f7f2?q=80&w=600&auto=format&fit=crop';

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "bg-white rounded-2xl shadow-card hover:shadow-lg transition-all overflow-hidden border border-transparent hover:border-primary group",
        compact ? "flex gap-4 p-3" : "flex flex-col"
      )}
    >
      <Link to={`/product/${listing.id}`} className={cn("block overflow-hidden relative", compact ? "w-24 h-24 rounded-lg flex-shrink-0" : "aspect-[4/3]")}>
        <img 
          src={mainImage} 
          alt={listing.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-md text-[10px] font-bold text-primary shadow-sm">
          {listing.location?.split(' ')[0].toUpperCase() || 'RTU CAMPUS'}
        </div>
        {listing.condition === 'New' && (
          <span className="absolute top-3 left-3 bg-secondary text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">New</span>
        )}
      </Link>

      <div className={cn("flex-grow", compact ? "py-1" : "p-5")}>
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${listing.id}`} className="hover:text-primary">
            <h3 className={cn("font-bold text-slate-800 line-clamp-1", compact ? "text-base" : "text-lg")}>
              {listing.title}
            </h3>
          </Link>
          {!compact && <span className="text-primary font-bold text-lg">{formatPrice(listing.price)}</span>}
        </div>
        
        {compact && (
          <p className="text-primary font-bold text-xl mb-3">
            {formatPrice(listing.price)}
          </p>
        )}

        {!compact && (
          <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
            <div className="w-5 h-5 bg-secondary text-primary rounded-full flex shrink-0 items-center justify-center font-bold text-[8px] border border-primary/10">
              {listing.seller_name?.[0]}
            </div>
            <span>Seller: {listing.seller_name}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
            <span className="text-green-600 font-medium">Verified</span>
          </div>
        )}

        {compact && (
          <span className="text-xs px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">{listing.category_name}</span>
        )}

        {!compact && (
           <button className="w-full py-2.5 bg-secondary text-primary font-bold rounded-xl hover:shadow-lg hover:brightness-105 transition-all text-sm">
             View Item
           </button>
        )}
      </div>
    </motion.div>
  );
}
