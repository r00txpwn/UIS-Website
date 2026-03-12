import { useState, useEffect } from 'react';
import { FileCheck, FileText, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Policy {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  display_order: number;
}

export default function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPolicies = async () => {
      const { data } = await supabase
        .from('policies')
        .select('*')
        .order('display_order', { ascending: true });

      if (data) setPolicies(data);
      setLoading(false);
    };

    fetchPolicies();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <FileCheck className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Our Policies
            </h1>
            <p className="text-gray-200 text-xl max-w-3xl mx-auto leading-relaxed">
              UIS is committed to maintaining the highest standards of quality, safety, and environmental responsibility. View our policy documents below.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading policies...</p>
          </div>
        ) : policies.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No policies available at this time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 hover:border-blue-200"
              >
                {policy.pdf_url ? (
                  <div className="aspect-video bg-slate-100 border-b border-gray-100">
                    <iframe
                      src={policy.pdf_url}
                      title={`Preview: ${policy.title}`}
                      className="w-full h-full min-h-[200px]"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <FileText className="w-16 h-16 text-blue-300" />
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {policy.title}
                  </h3>
                  {policy.description && (
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {policy.description}
                    </p>
                  )}
                  {policy.pdf_url && (
                    <a
                      href={policy.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-blue-600/30 hover:-translate-y-0.5 transition-all duration-300 font-medium text-sm"
                    >
                      <Download className="w-4 h-4" />
                      View Document
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-10 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Policy Compliance</h2>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto mb-6">
            Our policies are regularly reviewed and updated to ensure compliance with international standards and best practices across all our operations.
          </p>
          <div className="inline-block w-24 h-1 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
