import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, Save, X, Upload, FileText } from 'lucide-react';

interface Policy {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  category: string;
  display_order: number;
}

export default function PoliciesAdmin() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Policy>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    const { data } = await supabase.from('policies').select('*').order('display_order');
    if (data) setPolicies(data);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('policies')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('policies')
        .getPublicUrl(filePath);

      setFormData({ ...formData, pdf_url: publicUrl });
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF');
    }
    setUploadingPdf(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (editingId === 'new') {
        await supabase.from('policies').insert([formData]);
      } else if (editingId) {
        await supabase.from('policies').update(formData).eq('id', editingId);
      }
      await fetchPolicies();
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await supabase.from('policies').delete().eq('id', id);
      fetchPolicies();
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Policies Management</h1>
          <button
            onClick={() => {
              setEditingId('new');
              setFormData({ title: '', description: '', pdf_url: '', category: 'general', display_order: policies.length });
            }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Policy
          </button>
        </div>

        {editingId && (
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-bold mb-4">{editingId === 'new' ? 'New Policy' : 'Edit Policy'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <label className="block text-sm font-medium mb-2">Policy PDF Document</label>
                <div className="space-y-3">
                  {formData.pdf_url && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-8 h-8 text-red-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">PDF uploaded</p>
                        <a
                          href={formData.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View PDF
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, pdf_url: '' })}
                        className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {uploadingPdf ? 'Uploading...' : 'Upload PDF'}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                        disabled={uploadingPdf}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PDF format only (Max 10MB)
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button onClick={() => { setEditingId(null); setFormData({}); }} className="flex items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg">
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
                <th className="text-left px-6 py-3 text-sm font-medium">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium">Category</th>
                <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {policies.map((policy) => (
                <tr key={policy.id}>
                  <td className="px-6 py-4">{policy.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{policy.category}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => { setEditingId(policy.id); setFormData(policy); }} className="text-blue-600 hover:text-blue-700 mr-3">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(policy.id)} className="text-red-600 hover:text-red-700">
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
