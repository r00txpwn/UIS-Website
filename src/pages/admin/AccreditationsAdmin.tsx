import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, Save, X } from 'lucide-react';

interface Accreditation {
  id: string;
  name: string;
  description: string;
  logo_url: string | null;
  certificate_pdf_url: string | null;
  display_order: number;
}

export default function AccreditationsAdmin() {
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Accreditation>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccreditations();
  }, []);

  const fetchAccreditations = async () => {
    const { data } = await supabase
      .from('accreditations')
      .select('*')
      .order('display_order');
    if (data) setAccreditations(data);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingId === 'new') {
        await supabase.from('accreditations').insert([formData]);
      } else if (editingId) {
        await supabase.from('accreditations').update(formData).eq('id', editingId);
      }
      await fetchAccreditations();
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await supabase.from('accreditations').delete().eq('id', id);
      fetchAccreditations();
    }
  };

  const startEdit = (accreditation: Accreditation) => {
    setEditingId(accreditation.id);
    setFormData(accreditation);
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      name: '',
      description: '',
      display_order: accreditations.length
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Accreditations Management</h1>
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Accreditation
          </button>
        </div>

        {editingId && (
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-bold mb-4">
              {editingId === 'new' ? 'New Accreditation' : 'Edit Accreditation'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Logo URL</label>
                <input
                  type="text"
                  value={formData.logo_url || ''}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="/images/cert-logo.svg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Certificate PDF URL</label>
                <input
                  type="text"
                  value={formData.certificate_pdf_url || ''}
                  onChange={(e) => setFormData({ ...formData, certificate_pdf_url: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="/certificates/cert.pdf"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button
                  onClick={() => { setEditingId(null); setFormData({}); }}
                  className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium">Description</th>
                <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {accreditations.map((accreditation) => (
                <tr key={accreditation.id}>
                  <td className="px-6 py-4">{accreditation.name}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{accreditation.description}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEdit(accreditation)}
                      className="text-blue-600 hover:text-blue-700 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(accreditation.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
