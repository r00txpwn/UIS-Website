import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Save, Upload, X } from 'lucide-react';

interface SiteSettings {
  id: string;
  site_name: string | null;
  logo_url: string | null;
  footer_about: string | null;
  address: string | null;
  phone: string | null;
  sales_email: string | null;
  inspection_email: string | null;
  header_contact_label: string | null;
  header_contact_url: string | null;
}

export default function SiteSettingsAdmin() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [formData, setFormData] = useState<Partial<SiteSettings>>({});
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setFetchError(null);
    setFetchLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      // If table exists but no row, we'll create one below
      if (error.code !== 'PGRST116') {
        setFetchError(error.message);
        setFetchLoading(false);
        return;
      }
    }

    if (data) {
      setSettings(data as SiteSettings);
      setFormData(data as SiteSettings);
      setFetchLoading(false);
      return;
    }

    // No row yet – create a default one
    const { data: inserted, error: insertError } = await supabase
      .from('site_settings')
      .insert([{
        site_name: 'Universal Integrated Services LLC',
        footer_about: 'Universal Integrated Services LLC provides comprehensive industrial services to the oil and gas sector in Azerbaijan.',
        address: 'Baku, Azerbaijan',
        phone: '+994 (12) 404-83-35',
        sales_email: 'sales@uis.az',
        inspection_email: 'inspection@uis.az',
        header_contact_label: 'Contact',
        header_contact_url: '/contact',
      }])
      .select()
      .single();

    if (insertError) {
      setFetchError(insertError.message);
      setFetchLoading(false);
      return;
    }

    setSettings(inserted as SiteSettings);
    setFormData(inserted as SiteSettings);
    setFetchLoading(false);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${ext}`;
      const filePath = `branding/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, logo_url: publicUrl }));
    } catch (err) {
      console.error('Error uploading logo:', err);
      alert('Error uploading logo');
    }
    setUploadingLogo(false);
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!settings) return;
    setLoading(true);
    try {
      const payload = {
        site_name: formData.site_name,
        logo_url: formData.logo_url,
        footer_about: formData.footer_about,
        address: formData.address,
        phone: formData.phone,
        sales_email: formData.sales_email,
        inspection_email: formData.inspection_email,
        header_contact_label: formData.header_contact_label,
        header_contact_url: formData.header_contact_url,
      };

      const { data, error } = await supabase
        .from('site_settings')
        .update(payload)
        .eq('id', settings.id)
        .select()
        .single();

      if (error) {
        console.error('Error saving site settings:', error);
        alert(`Error saving: ${error.message}`);
        setLoading(false);
        return;
      }

      setSettings(data as SiteSettings);
      setFormData(data as SiteSettings);
    } catch (err) {
      console.error('Error saving site settings:', err);
      alert(`Error: ${err}`);
    }
    setLoading(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold">Site Settings</h1>
          <p className="text-slate-600 mt-1 text-sm">
            Manage global branding, footer content, and contact information used across the website.
          </p>
        </div>

        {fetchLoading ? (
          <div className="bg-white rounded-lg shadow-sm p-6 border text-slate-500">
            Loading settings...
          </div>
        ) : fetchError ? (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-red-200 text-red-700">
            Failed to load settings: {fetchError}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 border space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Branding</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Site Name</label>
                  <input
                    type="text"
                    value={formData.site_name ?? ''}
                    onChange={(e) => handleChange('site_name', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Logo</label>
                  <div className="space-y-3">
                    {formData.logo_url && (
                      <div className="relative inline-block">
                        <img
                          src={formData.logo_url}
                          alt="Logo preview"
                          className="h-16 w-auto rounded-lg border-2 border-gray-200 bg-white p-2"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, logo_url: null }))}
                          className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <label className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer">
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
                    <p className="text-xs text-gray-500">
                      Used in the header and footer. Recommended: transparent PNG or SVG.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Footer Content</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Footer About Text</label>
                  <textarea
                    value={formData.footer_about ?? ''}
                    onChange={(e) => handleChange('footer_about', e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Contact Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={formData.address ?? ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={formData.phone ?? ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sales Email</label>
                  <input
                    type="email"
                    value={formData.sales_email ?? ''}
                    onChange={(e) => handleChange('sales_email', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Inspection Email</label>
                  <input
                    type="email"
                    value={formData.inspection_email ?? ''}
                    onChange={(e) => handleChange('inspection_email', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">Header Contact Button</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Button Label</label>
                  <input
                    type="text"
                    value={formData.header_contact_label ?? ''}
                    onChange={(e) => handleChange('header_contact_label', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Contact"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Button URL</label>
                  <input
                    type="text"
                    value={formData.header_contact_url ?? ''}
                    onChange={(e) => handleChange('header_contact_url', e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="/contact"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

