import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src="/images/logos/UIS-LOgo-300x300.jpg"
                alt="UIS Logo"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              Universal Integrated Services LLC provides comprehensive industrial services to the oil and gas sector in Azerbaijan.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/clients" className="text-sm hover:text-white transition-colors">
                  Clients
                </Link>
              </li>
              <li>
                <Link to="/accreditations" className="text-sm hover:text-white transition-colors">
                  Accreditations
                </Link>
              </li>
              <li>
                <Link to="/business-ethics" className="text-sm hover:text-white transition-colors">
                  Business Ethics
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-sm hover:text-white transition-colors">
                  News and Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/fleet-management" className="text-sm hover:text-white transition-colors">
                  Fleet Management
                </Link>
              </li>
              <li>
                <Link to="/services/ndt-inspection" className="text-sm hover:text-white transition-colors">
                  NDT Inspection
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">Baku, Azerbaijan</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+994 (12) 404-83-35</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <div>sales&#64;uis&#46;az</div>
                  <div>inspection&#64;uis&#46;az</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Universal Integrated Services LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
