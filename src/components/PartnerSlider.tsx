import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Supplier {
  id: string;
  name: string;
  logo_url: string | null;
}

export default function PartnerSlider() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching suppliers:', error);
    } else {
      setSuppliers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (suppliers.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % suppliers.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [suppliers.length]);

  const getVisibleSuppliers = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % suppliers.length;
      visible.push(suppliers[index]);
    }
    return visible;
  };

  const visibleSuppliers = suppliers.length > 0 ? getVisibleSuppliers() : [];

  if (loading) {
    return (
      <div className="relative overflow-hidden py-8">
        <div className="flex items-center justify-center gap-12">
          <div className="text-slate-500">Loading partners...</div>
        </div>
      </div>
    );
  }

  if (suppliers.length === 0) {
    return null;
  }

  return (
    <div className="relative overflow-hidden py-8">
      <div className="flex items-center justify-center gap-12">
        {visibleSuppliers.map((supplier, index) => (
          <div
            key={`${supplier.id}-${currentIndex}-${index}`}
            className="flex items-center justify-center w-64 h-40 transition-opacity duration-500"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {supplier.logo_url ? (
                <img
                  src={supplier.logo_url}
                  alt={`${supplier.name} logo`}
                  className="max-h-32 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const fallback = document.createElement('div');
                      fallback.className = 'text-gray-700 font-semibold text-lg text-center px-4';
                      fallback.textContent = supplier.name;
                      parent.appendChild(fallback);
                    }
                  }}
                />
              ) : (
                <div className="text-gray-700 font-semibold text-lg text-center px-4">
                  {supplier.name}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {suppliers.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'w-8 bg-gray-700'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
