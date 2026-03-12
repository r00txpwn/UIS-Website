import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Plus, CreditCard as Edit2, Trash2, Save, X, Upload, FileText } from 'lucide-react';

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
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('accreditations')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('accreditations')
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: publicUrl });
    } catch (error) {
      console.error('Error uploading logo:', error);
      alert('Error uploading logo');
    }
    setUploadingLogo(false);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('accreditations')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('accreditations')
        .getPublicUrl(filePath);

      setFormData({ ...formData, certificate_pdf_url: publicUrl });
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert('Error uploading PDF');
    }
    setUploadingPdf(false);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let result;
      if (editingId === 'new') {
        result = await supabase.from('accreditations').insert([formData]);
      } else if (editingId) {
        result = await supabase.from('accreditations').update(formData).eq('id', editingId);
      }

      if (result?.error) {
        console.error('Error saving:', result.error);
        alert(`Error saving: ${result.error.message}`);
        setLoading(false);
        return;
      }

      await fetchAccreditations();
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
      const { error } = await supabase.from('accreditations').delete().eq('id', id);
      if (error) {
        console.error('Error deleting:', error);
        alert(`Error deleting: ${error.message}`);
        return;
      }
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
                <label className="block text-sm font-medium mb-2">Logo Image</label>
                <div className="space-y-3">
                  {formData.logo_url && (
                    <div className="relative inline-block">
                      <img
                        src={formData.logo_url}
                        alt="Logo preview"
                        className="h-32 w-auto rounded-lg border-2 border-gray-200 bg-white p-2"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, logo_url: null })}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
                      <Upload className="w-4 h-4" />
                      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    Accepted formats: JPG, PNG, WebP, SVG (Max 10MB)
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Certificate PDF (Optional)</label>
                <div className="space-y-3">
                  {formData.certificate_pdf_url && (
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-8 h-8 text-red-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Certificate uploaded</p>
                        <a
                          href={formData.certificate_pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View PDF
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, certificate_pdf_url: null })}
                        className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <label className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg cursor-pointer">
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
