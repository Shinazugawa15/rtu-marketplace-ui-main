import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Share2, 
  MessageCircle, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  User, 
  ChevronLeft, 
  Tag,
  Star,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatPrice, cn } from '../lib/utils';
import ListingCard from '../components/ListingCard';

export default function ProductDetail({ user }: { user: any }) {
  const { id } = useParams();
  const [listing, setListing] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    fetch(`/api/listings`) // In a real app, use /api/listings/:id
      .then(res => res.json())
      .then(data => {
        const item = data.find((l: any) => l.id === id);
        setListing(item);
        setSimilar(data.filter((l: any) => l.id !== id && l.category_id === item?.category_id).slice(0, 4));
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-20 animate-pulse space-y-10">
      <div className="h-8 w-48 bg-gray-200 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-[4/3] bg-gray-200 rounded-3xl" />
        <div className="space-y-6">
          <div className="h-10 w-full bg-gray-200 rounded-lg" />
          <div className="h-32 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );

  if (!listing) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Listing not found</h1>
      <Link to="/marketplace" className="text-primary font-bold hover:underline">Back to Marketplace</Link>
    </div>
  );

  const images = listing.images || [];
  const mainImage = images[currentImage] || 'https://images.unsplash.com/photo-1544648154-15f26920f7f2?q=80&w=600&auto=format&fit=crop';

  const handleChat = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate(`/chat?listing=${listing.id}&seller=${listing.seller_id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
      <Link to="/marketplace" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
        <ChevronLeft className="w-4 h-4" /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images Column */}
        <div className="space-y-4">
          <motion.div 
            layoutId={`img-${listing.id}`}
            className="aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-gray-100 bg-white shadow-sm"
          >
            <img 
              src={mainImage} 
              alt={listing.title} 
              className="w-full h-full object-cover" 
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hide">
            {images.map((img: string, i: number) => (
              <button 
                key={i} 
                onClick={() => setCurrentImage(i)}
                className={cn(
                  "w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all",
                  currentImage === i ? "border-primary scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                )}
              >
                <img src={img} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                {listing.category_name}
              </span>
              <div className="flex gap-2">
                <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 leading-tight">{listing.title}</h1>
            <div className="flex items-center gap-4">
              <p className="text-4xl font-bold text-primary">{formatPrice(listing.price)}</p>
              <div className="bg-secondary text-primary px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest shadow-sm">
                CONDITION: {listing.condition}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-500 py-6 border-y border-gray-100">
             <div className="flex items-center gap-2">
               <MapPin className="w-4 h-4 text-primary" />
               <span className="font-medium">{listing.location || 'Meet-up at Boni Campus'}</span>
             </div>
             <div className="flex items-center gap-2">
               <Calendar className="w-4 h-4 text-primary" />
               <span className="font-medium">Posted {new Date(listing.created_at).toLocaleDateString()}</span>
             </div>
             <div className="flex items-center gap-2">
               <ShieldCheck className="w-4 h-4 text-secondary fill-secondary/20" />
               <span className="font-medium text-secondary-dark">Verified Student Seller</span>
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xl">Description</h3>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Seller Card */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary/20 border-2 border-secondary flex items-center justify-center text-primary font-bold text-2xl overflow-hidden">
                {listing.seller_avatar ? <img src={listing.seller_avatar} /> : listing.seller_name?.[0]}
              </div>
              <div>
                <h4 className="font-bold text-lg">{listing.seller_name}</h4>
                <div className="flex items-center gap-1 text-sm text-amber-500">
                   <Star className="w-3 h-3 fill-amber-500" />
                   <span className="font-bold">4.9 / 5.0</span>
                   <span className="text-gray-400 font-normal ml-1">(24 reviews)</span>
                </div>
              </div>
            </div>
            <Link to={`/profile/${listing.seller_id}`} className="text-primary font-bold hover:underline py-2 px-4">View Profile</Link>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={handleChat}
              className="flex-grow bg-primary text-secondary font-extrabold py-5 rounded-2xl text-xl flex items-center justify-center gap-3 hover:bg-opacity-95 shadow-xl shadow-primary/10 transition-all active:scale-95"
            >
              <MessageCircle className="w-6 h-6" />
              Chat with Seller
            </button>
          </div>

          <div className="bg-blue-50/50 p-4 rounded-2xl flex gap-3">
             <Info className="w-5 h-5 text-primary flex-shrink-0" />
             <p className="text-xs text-blue-800 leading-normal">
               Remember to use the in-app chat for your security. Do not share your personal phone number or GCash details until you meet in person.
             </p>
          </div>
        </div>
      </div>

      {/* Similar Items */}
      {similar.length > 0 && (
        <section className="mt-24 space-y-10">
          <div className="flex justify-between items-end">
            <h2 className="text-3xl font-bold">Similar Listings</h2>
            <Link to="/marketplace" className="text-primary font-bold hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {similar.map(item => (
              <ListingCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
