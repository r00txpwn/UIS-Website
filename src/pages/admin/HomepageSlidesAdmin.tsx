import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil as Edit2, Trash2, Save, X, Upload } from 'lucide-react';

interface HomepageSlide {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  button_label: string | null;
  button_url: string | null;
  display_order: number;
  published: boolean;
}

export default function HomepageSlidesAdmin() {
  const [slides, setSlides] = useState<HomepageSlide[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<HomepageSlide>>({});
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    const { data, error } = await supabase
      .from('homepage_slides')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching homepage slides:', error);
      return;
    }
    setSlides(data ?? []);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('homepage')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('homepage')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error('Error uploading hero image:', err);
      alert('Error uploading image');
    }
    setUploadingImage(false);
  };

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.image_url?.trim()) {
      alert('Title and image are required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        subtitle: formData.subtitle ?? null,
        image_url: formData.image_url,
        button_label: formData.button_label ?? null,
        button_url: formData.button_url ?? null,
        display_order: formData.display_order ?? slides.length,
        published: formData.published ?? true,
      };

      let result;
      if (editingId === 'new') {
        result = await supabase.from('homepage_slides').insert([payload]);
      } else if (editingId) {
        result = await supabase.from('homepage_slides').update(payload).eq('id', editingId);
      }

      if (result?.error) {
        console.error('Error saving homepage slide:', result.error);
        alert(`Error saving: ${result.error.message}`);
        setLoading(false);
        return;
      }

      await fetchSlides();
      setEditingId(null);
      setFormData({});
    } catch (err) {
      console.error('Error saving homepage slide:', err);
      alert(`Error: ${err}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;
    const { error } = await supabase.from('homepage_slides').delete().eq('id', id);
    if (error) {
      console.error('Error deleting slide:', error);
      alert(`Error deleting: ${error.message}`);
      return;
    }
    fetchSlides();
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      button_label: '',
      button_url: '',
      display_order: slides.length,
      published: true,
    });
  };

  const startEdit = (slide: HomepageSlide) => {
    setEditingId(slide.id);
    setFormData(slide);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Homepage Hero Slides</h1>
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Slide
          </button>
        </div>

        {editingId && (
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-bold mb-4">
              {editingId === 'new' ? 'New Slide' : 'Edit Slide'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title ?? ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtitle (optional)</label>
                <input
                  type="text"
                  value={formData.subtitle ?? ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button Label (optional)</label>
                <input
                  type="text"
                  value={formData.button_label ?? ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, button_label: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="e.g. Learn more"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Button URL (optional)</label>
                <input
                  type="text"
                  value={formData.button_url ?? ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, button_url: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="/services/fleet-management"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.display_order ?? 0}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, display_order: Number(e.target.value) }))
                  }
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Background Image</label>
                <div className="space-y-3">
                  {formData.image_url && (
                    <div className="relative inline-block">
                      <img
                        src={formData.image_url}
                        alt="Slide preview"
                        className="h-32 w-auto rounded-lg border-2 border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image_url: '' }))}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer w-fit">
                    <Upload className="w-4 h-4" />
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploadingImage}
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Large, wide images work best for the homepage hero.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.published ?? true}
                    onChange={(e) => setFormData((prev) => ({ ...prev, published: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Published</span>
                </label>
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
                <th className="text-left px-6 py-3 text-sm font-medium">Order</th>
                <th className="text-left px-6 py-3 text-sm font-medium">Published</th>
                <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {slides.map((slide) => (
                <tr key={slide.id}>
                  <td className="px-6 py-4">{slide.title}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{slide.display_order}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {slide.published ? 'Yes' : 'No'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => startEdit(slide)}
                      className="text-blue-600 hover:text-blue-700 mr-3"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(slide.id)}
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

