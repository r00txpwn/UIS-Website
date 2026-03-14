import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronDown, X, Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Service {
  title: string;
  slug: string;
  description: string;
}

interface SiteSettings {
  logo_url: string | null;
  header_contact_label: string | null;
  header_contact_url: string | null;
}

export default function Header() {
  const location = useLocation();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('title, slug, description')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (data) setServices(data);
    };

    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('logo_url, header_contact_label, header_contact_url')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading site settings for header:', error);
        return;
      }

      if (data) {
        setSiteSettings({
          logo_url: data.logo_url ?? null,
          header_contact_label: data.header_contact_label ?? null,
          header_contact_url: data.header_contact_url ?? null,
        });
      }
    };

    fetchServices();
    fetchSettings();
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isServicesActive = () => {
    return location.pathname.startsWith('/services');
  };

  const isNewsActive = () => {
    return location.pathname.startsWith('/news');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    setMobileAboutOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center group" onClick={closeMobileMenu}>
          <div className="relative">
            <img
              src={siteSettings?.logo_url || '/images/logos/UIS-LOgo-300x300.jpg'}
              alt="UIS Logo"
              className="h-14 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 rounded-lg transition-colors duration-300"></div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-2">
          <Link
            to="/"
            className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
              isActive('/')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className="relative z-10">Home</span>
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              isActive('/')
                ? 'bg-blue-50'
                : 'bg-gray-50/0 group-hover:bg-gray-50'
            }`}></div>
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              className={`relative px-4 py-2 rounded-lg transition-all duration-300 group flex items-center gap-1 ${
                isActive('/about') || isActive('/policies')
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="relative z-10">About</span>
              <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${aboutOpen ? 'rotate-180' : ''}`} />
              <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                isActive('/about') || isActive('/policies')
                  ? 'bg-blue-50'
                  : 'bg-gray-50/0 group-hover:bg-gray-50'
              }`}></div>
            </button>

            {aboutOpen && (
              <div className="absolute top-full left-0 pt-3">
                <div className="w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-3 overflow-hidden">
                  <Link
                    to="/about"
                    className="group flex items-start gap-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex-1">
                      <div className="font-medium group-hover:text-blue-600 transition-colors">About Us</div>
                      <div className="text-sm text-gray-500 mt-0.5">Company overview</div>
                    </div>
                  </Link>
                  <Link
                    to="/policies"
                    className="group flex items-start gap-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300"
                  >
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="flex-1">
                      <div className="font-medium group-hover:text-blue-600 transition-colors">Our Policies</div>
                      <div className="text-sm text-gray-500 mt-0.5">Policy documents</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            to="/clients"
            className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
              isActive('/clients')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className="relative z-10">Clients</span>
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              isActive('/clients')
                ? 'bg-blue-50'
                : 'bg-gray-50/0 group-hover:bg-gray-50'
            }`}></div>
          </Link>

          <Link
            to="/products"
            className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
              isActive('/products')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className="relative z-10">Products</span>
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              isActive('/products')
                ? 'bg-blue-50'
                : 'bg-gray-50/0 group-hover:bg-gray-50'
            }`}></div>
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={`relative px-4 py-2 rounded-lg transition-all duration-300 group flex items-center gap-1 ${
                isServicesActive()
                  ? 'text-blue-600 font-semibold'
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              <span className="relative z-10">Our Services</span>
              <ChevronDown className={`w-4 h-4 relative z-10 transition-transform duration-300 ${servicesOpen ? 'rotate-180' : ''}`} />
              <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                isServicesActive()
                  ? 'bg-blue-50'
                  : 'bg-gray-50/0 group-hover:bg-gray-50'
              }`}></div>
            </button>

            {servicesOpen && (
              <div className="absolute top-full left-0 pt-3">
                <div className="w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-3 overflow-hidden max-h-96 overflow-y-auto">
                  {services.map((service, index) => (
                    <Link
                      key={index}
                      to={`/services/${service.slug}`}
                      className="group flex items-start gap-3 px-5 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent transition-all duration-300"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="flex-1">
                        <div className="font-medium group-hover:text-blue-600 transition-colors">{service.title}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{service.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link
            to="/accreditations"
            className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
              isActive('/accreditations')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className="relative z-10">Accreditations</span>
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              isActive('/accreditations')
                ? 'bg-blue-50'
                : 'bg-gray-50/0 group-hover:bg-gray-50'
            }`}></div>
          </Link>

          <Link
            to="/business-ethics"
            className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
              isActive('/business-ethics')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className="relative z-10">Business Ethics</span>
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              isActive('/business-ethics')
                ? 'bg-blue-50'
                : 'bg-gray-50/0 group-hover:bg-gray-50'
            }`}></div>
          </Link>

          <Link
            to="/news"
            className={`relative px-4 py-2 rounded-lg transition-all duration-300 group ${
              isNewsActive()
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <span className="relative z-10">News and Events</span>
            <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
              isNewsActive()
                ? 'bg-blue-50'
                : 'bg-gray-50/0 group-hover:bg-gray-50'
            }`}></div>
          </Link>

          <Link
            to={siteSettings?.header_contact_url || '/contact'}
            className="relative px-4 py-2 ml-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 font-medium"
          >
            <span className="relative z-10">{siteSettings?.header_contact_label || 'Contact'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </nav>

        <button
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Home
            </Link>
            <div>
              <button
                onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isActive('/about') || isActive('/policies') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                About
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileAboutOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileAboutOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    to="/about"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    About Us
                  </Link>
                  <Link
                    to="/policies"
                    onClick={closeMobileMenu}
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                  >
                    Our Policies
                  </Link>
                </div>
              )}
            </div>
            <Link
              to="/clients"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/clients') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Clients
            </Link>
            <Link
              to="/products"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/products') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Products
            </Link>

            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${isServicesActive() ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Our Services
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileServicesOpen && (
                <div className="ml-4 mt-1 space-y-1">
                  {services.map((service, index) => (
                    <Link
                      key={index}
                      to={`/services/${service.slug}`}
                      onClick={closeMobileMenu}
                      className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              to="/accreditations"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/accreditations') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Accreditations
            </Link>
            <Link
              to="/business-ethics"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/business-ethics') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Business Ethics
            </Link>
            <Link
              to="/news"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${isNewsActive() ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              News and Events
            </Link>
            <Link
              to="/contact"
              onClick={closeMobileMenu}
              className={`block px-4 py-3 rounded-lg transition-colors ${isActive('/contact') ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
