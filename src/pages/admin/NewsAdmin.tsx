import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil as Edit2, Trash2, Save, X, Upload } from 'lucide-react';

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  published: boolean;
  featured_on_home: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

function formatDateTime(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  } catch {
    return iso;
  }
}

function toDatetimeLocal(iso: string) {
  try {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  } catch {
    return '';
  }
}

export default function NewsAdmin() {
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<NewsPost>>({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setFetchError(null);
    setFetchLoading(true);
    const { data, error } = await supabase
      .from('news_posts')
      .select('*')
      .order('published_at', { ascending: false });
    setFetchLoading(false);
    if (error) {
      setFetchError(error.message);
      // #region agent log
      fetch('http://127.0.0.1:7854/ingest/ef127c7f-c9d5-4790-868a-0089cfe19cfd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'04450d'},body:JSON.stringify({sessionId:'04450d',location:'NewsAdmin.tsx:fetchPosts',message:'NewsAdmin fetch error',data:{error:error.message},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
      // #endregion
      return;
    }
    setPosts(data ?? []);
    // #region agent log
    fetch('http://127.0.0.1:7854/ingest/ef127c7f-c9d5-4790-868a-0089cfe19cfd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'04450d'},body:JSON.stringify({sessionId:'04450d',location:'NewsAdmin.tsx:fetchPosts',message:'NewsAdmin fetch',data:{count:data?.length??0,error:null},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
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
        .from('news')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('news')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error('Error uploading image:', err);
      alert('Error uploading image');
    }
    setUploadingImage(false);
  };

  const handleSave = async () => {
    if (!formData.title?.trim() || !formData.slug?.trim()) {
      alert('Title and slug are required.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      let result;
      if (editingId === 'new') {
        result = await supabase.from('news_posts').insert([payload]);
      } else if (editingId) {
        result = await supabase.from('news_posts').update(payload).eq('id', editingId);
      }

      if (result?.error) {
        console.error('Error saving:', result.error);
        alert(`Error saving: ${result.error.message}`);
        setLoading(false);
        return;
      }

      await fetchPosts();
      setEditingId(null);
      setFormData({});
    } catch (err) {
      console.error('Error saving:', err);
      alert(`Error: ${err}`);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    const { error } = await supabase.from('news_posts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting:', error);
      alert(`Error deleting: ${error.message}`);
      return;
    }
    fetchPosts();
  };

  const startEdit = (post: NewsPost) => {
    setEditingId(post.id);
    setFormData(post);
  };

  const startNew = () => {
    setEditingId('new');
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: null,
      published: true,
      featured_on_home: false,
      published_at: new Date().toISOString(),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">News and Events</h1>
          <button
            onClick={startNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Post
          </button>
        </div>

        {editingId && (
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-bold mb-4">
              {editingId === 'new' ? 'New Post' : 'Edit Post'}
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
                <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={formData.slug ?? ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. our-new-office-opening"
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Excerpt (optional)</label>
                <textarea
                  value={formData.excerpt ?? ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Content</label>
                <textarea
                  value={formData.content ?? ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image</label>
                <div className="space-y-3">
                  {formData.image_url && (
                    <div className="relative inline-block">
                      <img
                        src={formData.image_url}
                        alt="Featured"
                        className="h-32 w-auto rounded-lg border-2 border-gray-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, image_url: null }))}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div>
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
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP (Max 10MB)</p>
                  </div>
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
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured_on_home ?? false}
                    onChange={(e) => setFormData((prev) => ({ ...prev, featured_on_home: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm font-medium">Show on homepage</span>
                </label>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Publish date & time</label>
                  <input
                    type="datetime-local"
                    value={formData.published_at ? toDatetimeLocal(formData.published_at) : ''}
                    onChange={(e) => setFormData((prev) => ({ ...prev, published_at: e.target.value ? new Date(e.target.value).toISOString() : new Date().toISOString() }))}
                    className="border rounded-lg px-3 py-2"
                  />
                </div>
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
          {fetchError && (
            <div className="p-4 bg-red-50 border-b border-red-200 text-red-800 text-sm">
              Failed to load: {fetchError}
              <button type="button" onClick={() => fetchPosts()} className="ml-3 underline font-medium">Retry</button>
            </div>
          )}
          {fetchLoading ? (
            <div className="p-8 text-center text-slate-500">Loading posts...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium">Title</th>
                  <th className="text-left px-6 py-3 text-sm font-medium">Slug</th>
                  <th className="text-left px-6 py-3 text-sm font-medium">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-medium">Published</th>
                  <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 font-medium">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{post.slug}</td>
                    <td className="px-6 py-4 text-sm">{formatDateTime(post.published_at)}</td>
                    <td className="px-6 py-4">{post.published ? 'Yes' : 'No'}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => startEdit(post)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
