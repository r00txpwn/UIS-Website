import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  logo_url: string | null;
  footer_about: string | null;
  address: string | null;
  phone: string | null;
  sales_email: string | null;
  inspection_email: string | null;
}

export default function Footer() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('logo_url, footer_about, address, phone, sales_email, inspection_email')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading site settings for footer:', error);
        return;
      }

      if (data) {
        setSiteSettings({
          logo_url: data.logo_url ?? null,
          footer_about: data.footer_about ?? null,
          address: data.address ?? null,
          phone: data.phone ?? null,
          sales_email: data.sales_email ?? null,
          inspection_email: data.inspection_email ?? null,
        });
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="inline-block mb-4">
              <img
                src={siteSettings?.logo_url || '/images/logos/UIS-LOgo-300x300.jpg'}
                alt="UIS Logo"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-sm leading-relaxed">
              {siteSettings?.footer_about || 'Universal Integrated Services LLC provides comprehensive industrial services to the oil and gas sector in Azerbaijan.'}
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/clients" className="text-sm hover:text-white transition-colors">Clients</Link>
              </li>
              <li>
                <Link to="/accreditations" className="text-sm hover:text-white transition-colors">Accreditations</Link>
              </li>
              <li>
                <Link to="/business-ethics" className="text-sm hover:text-white transition-colors">Business Ethics</Link>
              </li>
              <li>
                <Link to="/news" className="text-sm hover:text-white transition-colors">News and Events</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services/fleet-management" className="text-sm hover:text-white transition-colors">Fleet Management</Link>
              </li>
              <li>
                <Link to="/services/ndt-inspection" className="text-sm hover:text-white transition-colors">NDT Inspection</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="text-sm">{siteSettings?.address || 'Baku, Azerbaijan'}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">{siteSettings?.phone || '+994 (12) 404-83-35'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <div>{siteSettings?.sales_email || 'sales\u0040uis\u002eaz'}</div>
                  <div>{siteSettings?.inspection_email || 'inspection\u0040uis\u002eaz'}</div>
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
