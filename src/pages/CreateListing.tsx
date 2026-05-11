import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, X, MapPin, Tag, Info, AlertCircle, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function CreateListing({ user }: { user: any }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [condition, setCondition] = useState('New');
  const [location, setLocation] = useState('Quadrangle / Pavilion');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));
  }, []);

  const addImage = () => {
    if (imageUrl && images.length < 5) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, description, price: parseFloat(price), 
          category_id: categoryId, condition, location, images 
        })
      });
      if (res.ok) {
        navigate('/marketplace');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-primary mb-2">Create New Listing</h1>
        <p className="text-gray-500 font-medium">Turn your unused items into profit within the RTU community.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Product Title</label>
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Calculus 1 Textbook by Ron Larson"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Price (₱)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="0.00"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Category</label>
                  <select 
                    required
                    value={categoryId}
                    onChange={e => setCategoryId(e.target.value)}
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary appearance-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Images (Max 5)</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter image URL..."
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="flex-grow bg-gray-50 border-gray-100 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary"
                  />
                  <button 
                    type="button"
                    onClick={addImage}
                    className="bg-primary text-white p-3.5 rounded-2xl hover:opacity-90 active:scale-95 transition-all"
                  >
                    <ImageIcon className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="grid grid-cols-5 gap-3 mt-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 bg-gray-50">
                      <img src={img} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <div className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 ml-1">Item Description</label>
                <textarea 
                  required 
                  rows={4}
                  placeholder="Describe your item (condition, years used, any issues...)"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3.5 px-4 focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Condition</label>
                  <div className="flex bg-gray-50 p-1 rounded-2xl">
                    {['New', 'Used', 'Good'].map(cond => (
                      <button 
                        key={cond}
                        type="button"
                        onClick={() => setCondition(cond)}
                        className={cn("flex-grow py-2.5 rounded-xl font-bold text-sm transition-all", condition === cond ? "bg-white shadow-sm text-primary" : "text-gray-400")}
                      >
                        {cond}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Meet-up Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="e.g. Student Pavilion"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-secondary font-extrabold py-5 rounded-2xl text-xl flex items-center justify-center gap-2 hover:bg-opacity-95 shadow-xl shadow-primary/10 transition-all disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Listing'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h4 className="font-bold text-lg flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Listing Tips
            </h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center font-bold">1</div>
                <p className="text-gray-600">Be honest about the item's condition. Happy buyers leave better ratings!</p>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center font-bold">2</div>
                <p className="text-gray-600">Use high-quality photos. Listings with clear images sell 3x faster.</p>
              </li>
              <li className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex-shrink-0 flex items-center justify-center font-bold">3</div>
                <p className="text-gray-600">Set a competitive price. Check similar items in the marketplace first.</p>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 p-6 rounded-3xl border border-red-100 space-y-3">
            <h4 className="font-bold text-lg flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              Platform Rules
            </h4>
            <p className="text-xs text-red-600/80 leading-relaxed">
              Selling of illegal items, coursework, or services that violate university academic integrity policies is strictly prohibited and will result in a permanent ban.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
