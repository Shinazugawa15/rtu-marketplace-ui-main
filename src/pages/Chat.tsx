import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Image, MoreHorizontal, ChevronLeft, MapPin, AlertCircle, MessageCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { io, Socket } from 'socket.io-client';

export default function Chat({ user }: { user: any }) {
  const [searchParams] = useSearchParams();
  const listingId = searchParams.get('listing');
  const sellerId = searchParams.get('seller');
  
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [listing, setListing] = useState<any>(null);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (listingId) {
      fetch('/api/listings')
        .then(res => res.json())
        .then(data => setListing(data.find((l: any) => l.id === listingId)));
    }

    // Connect to Socket.io
    socketRef.current = io();
    socketRef.current.emit('join', user.id);

    socketRef.current.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [listingId, user.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const msg = {
      sender_id: user.id,
      receiver_id: sellerId,
      listing_id: listingId,
      content: newMessage,
      created_at: new Date().toISOString()
    };

    socketRef.current?.emit('message', msg);
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-64px)] flex overflow-hidden">
      {/* Sidebar - Recent Chats */}
      <div className="hidden md:flex flex-col w-80 border-r border-gray-100 bg-white">
        <div className="p-6 border-bottom">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="flex-grow overflow-y-auto px-3 space-y-2 py-4">
          <div className="bg-primary/5 p-4 rounded-2xl flex gap-3 border border-primary/10">
            <div className="w-12 h-12 bg-secondary rounded-full flex-shrink-0" />
            <div className="flex-grow overflow-hidden">
               <div className="flex justify-between items-start">
                 <h4 className="font-bold text-sm truncate">Rhenzel James</h4>
                 <span className="text-[10px] text-gray-400">12m</span>
               </div>
               <p className="text-xs text-gray-500 truncate">Is this still available?</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow flex flex-col bg-gray-50 relative">
        {/* Chat Header */}
        <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="md:hidden"><ChevronLeft /></button>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-secondary rounded-full" />
               <div>
                 <h3 className="font-bold text-sm">Rhenzel James</h3>
                 <span className="text-[10px] text-green-500 font-bold uppercase">Online Now</span>
               </div>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-full"><MoreHorizontal className="w-5 h-5 text-gray-400" /></button>
        </div>

        {/* Listing Context Bar */}
        {listing && (
          <div className="bg-white px-6 py-3 border-b border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <img src={listing.images?.[0]} className="w-10 h-10 object-cover rounded-lg border" />
              <div>
                 <h4 className="text-xs font-bold truncate max-w-[200px]">{listing.title}</h4>
                 <p className="text-xs text-primary font-bold">₱{listing.price}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="bg-primary text-secondary text-[10px] font-bold px-4 py-1.5 rounded-lg">Make Offer</button>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          <div className="flex justify-center">
             <div className="bg-blue-50 text-blue-600 text-[10px] px-4 py-1.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-2 border border-blue-100">
               <AlertCircle className="w-3 h-3" />
               Safety First: Meeting in public campus areas is recommended.
             </div>
          </div>

          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={cn(
                "flex items-end gap-2",
                msg.sender_id === user.id ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className="w-6 h-6 rounded-full bg-gray-200 border" />
              <div className={cn(
                "max-w-[70%] p-3.5 rounded-2xl shadow-sm",
                msg.sender_id === user.id 
                  ? "bg-primary text-white rounded-br-none" 
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-100"
              )}>
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <span className={cn("text-[9px] block mt-1", msg.sender_id === user.id ? "text-white/50" : "text-gray-400")}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          
          {messages.length === 0 && (
            <div className="text-center py-20 text-gray-400">
               <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
               <p className="text-sm italic">Start the conversation with the seller...</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto flex gap-3 items-center">
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><Image className="w-5 h-5 text-gray-400" /></button>
            <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><MapPin className="w-5 h-5 text-gray-400" /></button>
            <div className="flex-grow relative">
              <input 
                type="text" 
                placeholder="Type your message..."
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                className="w-full bg-gray-50 border-none rounded-2xl py-3 px-4 focus:ring-2 focus:ring-primary pr-12"
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-xl hover:bg-opacity-90 active:scale-95 transition-all"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
