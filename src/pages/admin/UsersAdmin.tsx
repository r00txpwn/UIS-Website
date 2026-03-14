import { useState, FormEvent, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { UserPlus, AlertCircle, CheckCircle, Pencil, Trash2, X } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: string;
  created_at: string;
  last_login: string | null;
}

function formatDate(iso: string | null) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function UsersAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ full_name: string; role: string }>({ full_name: '', role: 'editor' });
  const [saving, setSaving] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(''), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const fetchUsers = async () => {
    setUsersError(null);
    setUsersLoading(true);
    const { data, error: fetchErr } = await supabase
      .from('user_profiles')
      .select('id, email, full_name, role, created_at, last_login')
      .order('created_at', { ascending: false });
    setUsersLoading(false);
    if (fetchErr) {
      setUsersError(fetchErr.message);
      return;
    }
    setUsers(data ?? []);
  };

  const handleCreateUser = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'admin'
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        setSuccess(`Admin user created successfully: ${email}`);
        setEmail('');
        setPassword('');
        await fetchUsers();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (user: UserProfile) => {
    setEditingId(user.id);
    setEditForm({
      full_name: user.full_name ?? '',
      role: user.role ?? 'editor'
    });
  };

  const handleSaveEdit = async () => {
    if (!editingId) return;
    setSaving(true);
    setError('');
    try {
      const { error: updateErr } = await supabase
        .from('user_profiles')
        .update({
          full_name: editForm.full_name || null,
          role: editForm.role
        })
        .eq('id', editingId);

      if (updateErr) throw updateErr;
      setSuccess('User updated.');
      setEditingId(null);
      await fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id === currentUserId) {
      setError('You cannot remove your own profile from the list.');
      return;
    }
    if (!confirm('Remove this user from the list? They will no longer appear in the CMS. To fully delete the account, use Supabase Dashboard → Authentication → Users.')) return;
    setError('');
    try {
      const { error: deleteErr } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id);

      if (deleteErr) throw deleteErr;
      setSuccess('User removed from list.');
      setEditingId(null);
      await fetchUsers();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to remove user');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">User Management</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
            <button type="button" onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">Dismiss</button>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-green-800 text-sm">{success}</p>
            <button type="button" onClick={() => setSuccess('')} className="ml-auto text-green-700 hover:text-green-900">Dismiss</button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6 border max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Create New Admin User</h2>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="newadmin@uis.az"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Minimum 6 characters"
                required
              />
              <p className="mt-1 text-xs text-slate-500">Minimum 6 characters required</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              {loading ? 'Creating User...' : 'Create Admin User'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900 font-medium">Important:</p>
            <ul className="mt-2 text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Only authenticated admin users can access this page</li>
              <li>New users will have admin privileges</li>
              <li>Share credentials securely with the new user</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
          <h2 className="text-xl font-bold p-6 pb-2">Existing Admin Users</h2>
          <p className="text-sm text-slate-600 px-6 pb-4">View, edit role/name, or remove from the list.</p>

          {usersError && (
            <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
              {usersError}
              <button type="button" onClick={() => fetchUsers()} className="ml-3 underline font-medium">Retry</button>
            </div>
          )}

          {usersLoading ? (
            <div className="p-8 text-center text-slate-500">Loading users...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium">Email</th>
                  <th className="text-left px-6 py-3 text-sm font-medium">Full name</th>
                  <th className="text-left px-6 py-3 text-sm font-medium">Role</th>
                  <th className="text-left px-6 py-3 text-sm font-medium">Created</th>
                  <th className="text-right px-6 py-3 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 font-medium">{user.email ?? '—'}</td>
                    <td className="px-6 py-4">{user.full_name ?? '—'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => startEdit(user)}
                        className="text-blue-600 hover:text-blue-700 mr-3"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUserId}
                        className="text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Remove from list"
                        title={user.id === currentUserId ? 'You cannot remove yourself' : 'Remove from list'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!usersLoading && users.length === 0 && !usersError && (
            <div className="p-8 text-center text-slate-500">No users yet. Create one above.</div>
          )}
        </div>

        {editingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Edit User</h3>
                <button type="button" onClick={() => setEditingId(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
                  <input
                    type="text"
                    value={editForm.full_name}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm((prev) => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="admin">admin</option>
                    <option value="editor">editor</option>
                  </select>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
