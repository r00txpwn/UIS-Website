import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, Save, X, Upload, Image } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_url: string | null;
  published: boolean;
  display_order: number;
}

export default function ServicesAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('display_order');
    if (data) setServices(data);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('services')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('services')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image');
    }
    setUploading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let result;
      if (editingId === 'new') {
        result = await supabase.from('services').insert([formData]);
      } else if (editingId) {
        result = await supabase.from('services').update(formData).eq('id', editingId);
      }

      if (result?.error) {
        console.error('Error saving:', result.error);
        alert(`Error saving: ${result.error.message}`);
        setLoading(false);
        return;
      }

      await fetchServices();
      setEditingId(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving:', error);
      alert(`Error: ${error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) {
      await supabase.from('services').delete().eq('id', id);
      fetchServices();
    }
  };

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData(service);
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      published: false,
      display_order: services.length
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Services Management</h1>
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        </div>

        {editingId && (
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-bold mb-4">
              {editingId === 'new' ? 'New Service' : 'Edit Service'}
            </h2>
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
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
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
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content || ''}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Service Image</label>
                <div className="space-y-3">
                  {formData.image_url && (
                    <div className="relative inline-block">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="h-32 w-auto rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: null })}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Accepted formats: JPG, PNG, WebP, SVG (Max 5MB)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.published || false}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="rounded"
                />
                <label className="text-sm font-medium">Published</label>
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
                <th className="text-left px-6 py-3 text-sm font-medium">Title</th>
                <th className="text-left px-6 py-3 text-sm font-medium">Slug</th>
                <th className="text-left px-6 py-3 text-sm font-medium">Published</th>
                <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4">{service.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{service.slug}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${service.published ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                      {service.published ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEdit(service)}
                      className="text-blue-600 hover:text-blue-700 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
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
