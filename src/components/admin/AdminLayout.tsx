import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, FileText, Award, FileCheck, Package, Users, Boxes, Newspaper, Image as ImageIcon, Settings, MessageSquare, CircleUser as UserCircle, LogOut, ExternalLink } from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email || '');
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/services', icon: FileText, label: 'Services' },
    { path: '/admin/accreditations', icon: Award, label: 'Accreditations' },
    { path: '/admin/policies', icon: FileCheck, label: 'Policies' },
    { path: '/admin/products', icon: Package, label: 'Products' },
    { path: '/admin/news', icon: Newspaper, label: 'News and Events' },
    { path: '/admin/homepage-slides', icon: ImageIcon, label: 'Homepage Slides' },
    { path: '/admin/site-settings', icon: Settings, label: 'Site Settings' },
    { path: '/admin/contact-messages', icon: MessageSquare, label: 'Contact Messages' },
    { path: '/admin/clients', icon: Users, label: 'Clients' },
    { path: '/admin/suppliers', icon: Boxes, label: 'Suppliers' },
    { path: '/admin/users', icon: UserCircle, label: 'Users' }
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-52 bg-slate-900 text-white flex flex-col fixed h-screen">
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-xl font-bold">UIS CMS</h1>
          <p className="text-xs text-slate-400 mt-1">{userEmail}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <a
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm transition ${
                  active
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-5 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white w-full transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-52">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-900">
              {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
            </h2>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View Website
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
