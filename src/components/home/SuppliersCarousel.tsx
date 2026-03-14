import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Supplier {
  id: string;
  name: string;
  logo_url: string;
  display_order: number;
}

export default function SuppliersCarousel() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      const { data, error } = await supabase
        .from('suppliers')
        .select('id, name, logo_url, display_order')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || suppliers.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Our Trusted Suppliers
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            We partner with industry-leading brands to bring you the best products
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex animate-scroll gap-12 items-center">
            {[...suppliers, ...suppliers].map((supplier, index) => (
              <div
                key={`${supplier.id}-${index}`}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <img
                  src={supplier.logo_url}
                  alt={supplier.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
          width: max-content;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
