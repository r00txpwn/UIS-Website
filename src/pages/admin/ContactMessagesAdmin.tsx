import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../lib/supabase';
import { Mail, Trash2, ChevronLeft } from 'lucide-react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

type Filter = 'all' | 'unread' | 'read';

export default function ContactMessagesAdmin() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contact messages:', error);
      return;
    }
    setMessages(data ?? []);
  };

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking as read:', error);
      return;
    }
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
    );
  };

  const handleSelect = (msg: ContactMessage) => {
    setSelectedId(msg.id);
    if (!msg.is_read) markAsRead(msg.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) {
      console.error('Error deleting message:', error);
      alert(`Error: ${error.message}`);
      return;
    }
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const filtered =
    filter === 'all'
      ? messages
      : filter === 'unread'
        ? messages.filter((m) => !m.is_read)
        : messages.filter((m) => m.is_read);

  const selected = messages.find((m) => m.id === selectedId);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
        </div>

        <div className="flex gap-2">
          {(['all', 'unread', 'read'] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className={`lg:col-span-1 bg-white border border-slate-200 rounded-lg overflow-hidden ${
              selected ? 'lg:block hidden' : 'block'
            }`}
          >
            <div className="max-h-[60vh] overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="p-4 text-slate-500 text-center">No messages</p>
              ) : (
                filtered.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => handleSelect(msg)}
                    className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 flex items-start gap-3 ${
                      selectedId === msg.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                  >
                    <span
                      className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                        msg.is_read ? 'bg-slate-300' : 'bg-blue-600'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-900 truncate">{msg.subject}</p>
                      <p className="text-sm text-slate-600 truncate">{msg.name} · {msg.email}</p>
                      <p className="text-xs text-slate-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <div className="bg-white border border-slate-200 rounded-lg p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="lg:hidden flex items-center gap-1 text-slate-600 hover:text-slate-900"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </button>
                  <div className="flex gap-2 ml-auto">
                    <a
                      href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      Reply
                    </a>
                    <button
                      onClick={() => handleDelete(selected.id)}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-slate-900 mb-2">{selected.subject}</h2>
                <p className="text-sm text-slate-500 mb-4">
                  {selected.name} · {selected.email}
                  {selected.phone && ` · ${selected.phone}`} ·{' '}
                  {new Date(selected.created_at).toLocaleString()}
                </p>
                <div className="prose prose-slate max-w-none">
                  <p className="whitespace-pre-wrap text-slate-700">{selected.message}</p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center text-slate-500">
                Select a message to view
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
