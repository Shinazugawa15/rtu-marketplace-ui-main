import { useState } from 'react';
import { 
  Users, 
  ShoppingBag, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  BarChart, 
  Search,
  MoreVertical,
  Flag
} from 'lucide-react';
import { cn, formatPrice } from '../lib/utils';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('moderation');

  const stats = [
    { label: 'Total Users', value: '4,120', trend: '+52 this wk', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pending Listings', value: '18', trend: '-2 since morning', icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Reports', value: '3', trend: 'Critical priority', icon: Flag, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Daily Volume', value: '₱124,000', trend: 'All campuses', icon: BarChart, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const pendingListings = [
    { id: '1', title: 'iPhone 13 Pro Max', seller: 'Rhenzel James', price: 35000, date: '2024-05-10', status: 'Pending' },
    { id: '2', title: 'Thermodynamics Reviewer', seller: 'Mark Gil', price: 250, date: '2024-05-09', status: 'Pending' },
    { id: '3', title: 'RTU Uniform (Medium)', seller: 'Sarah Cruz', price: 800, date: '2024-05-08', status: 'Pending' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10 space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-primary">Admin Control Center</h1>
          <p className="text-gray-500">Platform moderation and system health</p>
        </div>
        <div className="flex gap-2">
           <div className="bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
             <AlertCircle className="w-4 h-4" /> 3 Urgent Reports
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-gray-900">{stat.value}</h4>
              <p className={cn("text-[10px] font-bold mt-1", stat.trend.includes('-') || stat.trend.includes('Critical') ? 'text-red-500' : 'text-green-500')}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold">Listings Moderation</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search items..." className="bg-gray-50 border-none rounded-xl py-2 pl-10 pr-4 text-sm" />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 pt-2 font-bold text-gray-400 text-xs uppercase">Item Details</th>
                    <th className="pb-4 pt-2 font-bold text-gray-400 text-xs uppercase">Seller</th>
                    <th className="pb-4 pt-2 font-bold text-gray-400 text-xs uppercase">Status</th>
                    <th className="pb-4 pt-2 font-bold text-gray-400 text-xs uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pendingListings.map(item => (
                    <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                          <div>
                            <p className="font-bold text-sm text-gray-900">{item.title}</p>
                            <p className="text-xs text-primary font-bold">{formatPrice(item.price)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-600">{item.seller}</td>
                      <td className="py-4">
                        <span className="bg-amber-100 text-amber-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">{item.status}</span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2 px-2">
                           <button className="p-2 text-green-500 hover:bg-green-50 rounded-lg transition-all" title="Approve"><CheckCircle className="w-5 h-5" /></button>
                           <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Reject"><XCircle className="w-5 h-5" /></button>
                           <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-all"><MoreVertical className="w-5 h-5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-primary p-8 rounded-[2.5rem] text-white space-y-6">
              <h3 className="text-xl font-bold">Safety Center</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                   <h4 className="font-bold text-sm mb-1">New User Reports</h4>
                   <p className="text-xs text-blue-200">3 items reported for suspicious student IDs. Check audit logs.</p>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl border border-white/10">
                   <h4 className="font-bold text-sm mb-1">System Health</h4>
                   <p className="text-xs text-blue-200">Database performing optimally. WebSocket connections: 42 active.</p>
                </div>
              </div>
              <button className="w-full bg-secondary text-primary font-bold py-3.5 rounded-2xl">Download Audit Logs</button>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold">Recent Activity</h3>
              <div className="space-y-6">
                {[1,2,3].map(i => (
                  <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0"></div>
                    <div>
                      <p className="text-xs"><span className="font-bold">Admin Sarah</span> approved item <span className="font-bold">#4920</span></p>
                      <p className="text-[10px] text-gray-400">2 mins ago</p>
                    </div>
                  </div>
                ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
