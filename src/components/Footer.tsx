import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight text-secondary">RTU Marketplace</span>
          </div>
          <p className="text-gray-400 text-sm">
            The official student-led marketplace for Rizal Technological University. 
            Empowering students to trade securely within the blue and gold community.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4 text-secondary">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="/marketplace" className="hover:text-white transition-colors">Browse Products</Link></li>
            <li><Link to="/create" className="hover:text-white transition-colors">Sell an Item</Link></li>
            <li><Link to="/auth" className="hover:text-white transition-colors">Sign Up</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4 text-secondary">Support</h4>
          <ul className="space-y-2 text-gray-400">
            <li><Link to="#" className="hover:text-white transition-colors">Safety Tips</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Community Guidelines</Link></li>
            <li><Link to="#" className="hover:text-white transition-colors">Report Fraud</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-4 text-secondary">Contact</h4>
          <p className="text-gray-400 text-sm">
            Boni Avenue, Mandaluyong City<br />
            Metro Manila, Philippines<br />
            contact@rtumarketplace.edu.ph
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} RTU Marketplace. Not an official RTU publication.</p>
      </div>
    </footer>
  );
}
