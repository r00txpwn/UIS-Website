import { useEffect, useState } from 'react';
import Section from '../components/Section';
import { supabase } from '../lib/supabase';

interface Client {
  id: string;
  name: string;
  logo_url: string | null;
}

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching clients:', error);
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">Our Clients</h1>
          <p className="text-gray-300 text-center mt-4 text-lg">
            Trusted by leading organizations worldwide
          </p>
        </div>
      </div>

      <Section title="">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">No clients available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
              {clients.map((client) => (
                <div
                  key={client.id}
                  className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 group"
                >
                  <div className="text-center">
                    <div className="relative h-16 flex items-center justify-center">
                      {client.logo_url ? (
                        <img
                          src={client.logo_url}
                          alt={`${client.name} logo`}
                          className="h-16 w-auto mx-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement('div');
                              fallback.className = 'text-sm font-semibold text-gray-700 px-2';
                              fallback.textContent = client.name;
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <div className="text-sm font-semibold text-gray-700 px-2">
                          {client.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-gray-600 text-lg">...and many more</p>
            </div>
          </>
        )}
      </Section>
    </div>
  );
}
