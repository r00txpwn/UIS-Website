import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil as Edit2, Trash2, Save, X } from 'lucide-react';

type Section = 'quick' | 'services';

interface FooterLink {
  id: string;
  section: Section;
  label: string;
  path: string;
  display_order: number;
  published: boolean;
}

const SECTION_LABELS: Record<Section, string> = {
  quick: 'Quick Links',
  services: 'Services',
};

export default function FooterLinksAdmin() {
  const [links, setLinks] = useState<FooterLink[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('quick');
  const [formData, setFormData] = useState<Partial<FooterLink>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    const { data, error } = await supabase
      .from('footer_links')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching footer links:', error);
      return;
    }
    setLinks(data ?? []);
  };

  const handleSave = async () => {
    if (!formData.label?.trim() || !formData.path?.trim()) {
      alert('Label and path are required.');
      return;
    }
    if (!formData.section) {
      alert('Section is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        section: formData.section,
        label: formData.label.trim(),
        path: formData.path.trim(),
        display_order: formData.display_order ?? 0,
        published: formData.published ?? true,
      };

      let result;
      if (editingId === 'new') {
        result = await supabase.from('footer_links').insert([payload]);
      } else if (editingId) {
        result = await supabase.from('footer_links').update(payload).eq('id', editingId);
      }

      if (result?.error) {
        console.error('Error saving footer link:', result.error);
        alert(`Error saving: ${result.error.message}`);
        setLoading(false);
        return;
      }

      await fetchLinks();
      setEditingId(null);
      setFormData({});
    } catch (err) {
      console.error('Error saving footer link:', err);
      alert(`Error: ${err}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;
    const { error } = await supabase.from('footer_links').delete().eq('id', id);
    if (error) {
      console.error('Error deleting footer link:', error);
      alert(`Error deleting: ${error.message}`);
      return;
    }
    fetchLinks();
  };

  const startNew = (section: Section) => {
    setFormData({
      section,
      label: '',
      path: '/',
      display_order: links.filter((l) => l.section === section).length,
      published: true,
    });
    setEditingId('new');
  };

  const startEdit = (link: FooterLink) => {
    setFormData({ ...link });
    setEditingId(link.id);
  };

  const filteredLinks = links.filter((l) => l.section === activeSection);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Footer Links</h1>
          <button
            onClick={() => startNew(activeSection)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Add link
          </button>
        </div>

        <div className="flex gap-2 border-b border-slate-200">
          {(['quick', 'services'] as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => setActiveSection(s)}
              className={`px-4 py-2 font-medium border-b-2 -mb-px ${
                activeSection === s
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {SECTION_LABELS[s]}
            </button>
          ))}
        </div>

        {editingId && (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              {editingId === 'new' ? 'New link' : 'Edit link'}
            </h2>
            <div className="grid gap-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                <select
                  value={formData.section ?? 'quick'}
                  onChange={(e) => setFormData((p) => ({ ...p, section: e.target.value as Section }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                >
                  <option value="quick">Quick Links</option>
                  <option value="services">Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Label</label>
                <input
                  type="text"
                  value={formData.label ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, label: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  placeholder="e.g. Home"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Path</label>
                <input
                  type="text"
                  value={formData.path ?? ''}
                  onChange={(e) => setFormData((p) => ({ ...p, path: e.target.value }))}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  placeholder="e.g. / or /about"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Display order</label>
                <input
                  type="number"
                  value={formData.display_order ?? 0}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, display_order: parseInt(e.target.value, 10) || 0 }))
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published ?? true}
                  onChange={(e) => setFormData((p) => ({ ...p, published: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                <label htmlFor="published" className="text-sm text-slate-700">
                  Published
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({});
                }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Order</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Label</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Path</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    No links in this section. Click &quot;Add link&quot; to create one.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-700">{link.display_order}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{link.label}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{link.path}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          link.published ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {link.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => startEdit(link)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded ml-1"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
