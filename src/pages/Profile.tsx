import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, Mail, MapPin, Calendar, MessageCircle, AlertTriangle } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { formatPrice } from '../lib/utils';

export default function Profile() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // In a real app we'd have a specific profile API
    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        const sellerItems = data.filter((l: any) => l.seller_id === id);
        if (sellerItems.length > 0) {
          setProfile({
            id,
            name: sellerItems[0].seller_name,
            avatar: sellerItems[0].seller_avatar,
            bio: "Final year RTU Student. Selling some of my old books and gadgets to save up for graduation fees. Open for meetups within Boni Campus.",
            joined: "Sept 2024",
            rating: 4.8,
            reviews: 24,
            isVerified: true
          });
        }
        setListings(sellerItems);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-20 text-center animate-pulse">Loading profile...</div>;
  if (!profile) return <div className="p-20 text-center">User not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 bg-primary"></div>
            <div className="px-8 pb-8 -mt-16 text-center">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-xl mx-auto mb-6">
                 <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center text-primary text-4xl font-bold uppercase overflow-hidden">
                   {profile.avatar ? <img src={profile.avatar} /> : profile.name[0]}
                 </div>
              </div>
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-3xl font-extrabold text-gray-900">{profile.name}</h2>
                {profile.isVerified && <ShieldCheck className="w-6 h-6 text-primary fill-primary/10" />}
              </div>
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
                 <div className="flex items-center gap-1">
                   <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                   <span className="font-bold text-gray-900">{profile.rating}</span>
                   <span>({profile.reviews} reviews)</span>
                 </div>
                 <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                 <div className="flex items-center gap-1">
                   <Calendar className="w-4 h-4" />
                   <span>Joined {profile.joined}</span>
                 </div>
              </div>
              <p className="text-gray-600 leading-relaxed italic mb-8">"{profile.bio}"</p>
              <div className="flex flex-col gap-3">
                 <Link 
                   to={`/chat?seller=${id}`}
                   className="w-full bg-primary text-secondary font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-primary/10 transition-all"
                 >
                   <MessageCircle className="w-5 h-5" /> Message Seller
                 </Link>
                 <button className="w-full bg-gray-50 text-gray-600 font-bold py-3.5 rounded-2xl border border-gray-100 flex items-center justify-center gap-2">
                   <Mail className="w-5 h-5" /> student@rtu.edu.ph
                 </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex gap-4">
             <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
             <p className="text-xs text-amber-800 leading-normal">
               This seller is a verified RTU student. However, we always recommend meeting in campus high-traffic areas for safety.
             </p>
          </div>
        </div>

        {/* User Listings */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h3 className="text-3xl font-extrabold text-primary mb-2">Listings</h3>
            <p className="text-gray-500 font-medium">{listings.length} active items currently listed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {listings.map(list => (
              <ListingCard key={list.id} listing={list} />
            ))}
            {listings.length === 0 && (
              <div className="col-span-2 text-center py-20 bg-white rounded-3xl border border-dashed text-gray-400">
                This user hasn't posted any items yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
