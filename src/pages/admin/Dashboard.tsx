import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { FileText, Award, FileCheck, Package, Users, Boxes } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    services: 0,
    accreditations: 0,
    policies: 0,
    products: 0,
    clients: 0,
    suppliers: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [services, accreditations, policies, products, clients, suppliers] = await Promise.all([
      supabase.from('services').select('id', { count: 'exact', head: true }),
      supabase.from('accreditations').select('id', { count: 'exact', head: true }),
      supabase.from('policies').select('id', { count: 'exact', head: true }),
      supabase.from('products').select('id', { count: 'exact', head: true }),
      supabase.from('clients').select('id', { count: 'exact', head: true }),
      supabase.from('suppliers').select('id', { count: 'exact', head: true })
    ]);

    setStats({
      services: services.count || 0,
      accreditations: accreditations.count || 0,
      policies: policies.count || 0,
      products: products.count || 0,
      clients: clients.count || 0,
      suppliers: suppliers.count || 0
    });
    // #region agent log
    const errors = [services.error?.message,accreditations.error?.message,policies.error?.message,products.error?.message,clients.error?.message,suppliers.error?.message].filter(Boolean);
    fetch('http://127.0.0.1:7854/ingest/ef127c7f-c9d5-4790-868a-0089cfe19cfd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'04450d'},body:JSON.stringify({sessionId:'04450d',location:'Dashboard.tsx:fetchStats',message:'Dashboard stats',data:{services:services.count??0,accreditations:accreditations.count??0,policies:policies.count??0,products:products.count??0,clients:clients.count??0,suppliers:suppliers.count??0,errors:errors},timestamp:Date.now(),hypothesisId:'H5'})}).catch(()=>{});
    // #endregion
  };

  const statCards = [
    { label: 'Services', value: stats.services, icon: FileText, color: 'bg-blue-500' },
    { label: 'Accreditations', value: stats.accreditations, icon: Award, color: 'bg-green-500' },
    { label: 'Policies', value: stats.policies, icon: FileCheck, color: 'bg-orange-500' },
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-red-500' },
    { label: 'Clients', value: stats.clients, icon: Users, color: 'bg-teal-500' },
    { label: 'Suppliers', value: stats.suppliers, icon: Boxes, color: 'bg-amber-500' }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome to UIS CMS</h1>
          <p className="text-slate-600 mt-2">Manage your website content from this dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Package className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-slate-900">Manage Products</p>
                <p className="text-sm text-slate-600">Add or edit products</p>
              </div>
            </a>
            <a
              href="/admin/clients"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Users className="w-5 h-5 text-teal-600" />
              <div>
                <p className="font-medium text-slate-900">Manage Clients</p>
                <p className="text-sm text-slate-600">Add or edit client logos</p>
              </div>
            </a>
            <a
              href="/admin/suppliers"
              className="flex items-center gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
            >
              <Boxes className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-slate-900">Manage Suppliers</p>
                <p className="text-sm text-slate-600">Add or edit supplier logos</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
