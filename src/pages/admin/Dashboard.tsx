import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { FileText, Award, FileCheck, Package } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    accreditations: 0,
    policies: 0,
    products: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [services, accreditations, policies, products] = await Promise.all([
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('accreditations').select('id', { count: 'exact', head: true }),
      supabase.from('policies').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true })
    ]);

    setStats({
      services: services.count || 0,
      accreditations: accreditations.count || 0,
      policies: policies.count || 0,
      products: products.count || 0
    });
  };

  const statCards = [
    { label: 'Services', value: stats.services, icon: FileText, color: 'bg-blue-500' },
    { label: 'Accreditations', value: stats.accreditations, icon: Award, color: 'bg-green-500' },
    { label: 'Policies', value: stats.policies, icon: FileCheck, color: 'bg-orange-500' },
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-purple-500' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to UIS CMS</h1>
          <p className="text-slate-600 mt-2">Manage your website content from this dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/admin/services"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-slate-900">Manage Services</p>
                <p className="text-sm text-slate-600">Add or edit services</p>
              </div>
            </a>
            <a
              href="/admin/accreditations"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Award className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-slate-900">Manage Accreditations</p>
                <p className="text-sm text-slate-600">Add or edit certifications</p>
              </div>
            </a>
            <a
              href="/admin/policies"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <FileCheck className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-slate-900">Manage Policies</p>
                <p className="text-sm text-slate-600">Upload policy documents</p>
              </div>
            </a>
            <a
              href="/admin/products"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Package className="w-5 h-5 text-purple-600" />
              <div>
                <p className="font-medium text-slate-900">Manage Products</p>
                <p className="text-sm text-slate-600">Add or edit products</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
