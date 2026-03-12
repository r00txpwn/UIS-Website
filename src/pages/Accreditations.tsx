import { useState, useEffect } from 'react';
import { Award, CheckCircle, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Accreditation {
  name: string;
  logo_url: string;
  description: string;
  certificate_pdf_url?: string;
}

export default function Accreditations() {
  const [accreditations, setAccreditations] = useState<Accreditation[]>([]);

  useEffect(() => {
    const fetchAccreditations = async () => {
      const { data } = await supabase
        .from('accreditations')
        .select('*')
        .order('display_order', { ascending: true });

      if (data) setAccreditations(data);
    };

    fetchAccreditations();
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
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Accreditations & Certifications
            </h1>
            <p className="text-gray-200 text-xl max-w-3xl mx-auto leading-relaxed">
              Our commitment to excellence is demonstrated through internationally recognized certifications and accreditations earned over years of dedicated service.
            </p>
            <div className="flex items-center justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-white">{accreditations.length}+</div>
                <div className="text-gray-300 text-sm mt-1">Certifications</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">ISO</div>
                <div className="text-gray-300 text-sm mt-1">Certified</div>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">100%</div>
                <div className="text-gray-300 text-sm mt-1">Compliant</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border-2 border-blue-100 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assured</h3>
            <p className="text-gray-600">
              All certifications meet international standards and regulations
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-xl border-2 border-slate-100 text-center">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verified Standards</h3>
            <p className="text-gray-600">
              Independently audited and regularly maintained certifications
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-xl border-2 border-blue-100 text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Industry Leading</h3>
            <p className="text-gray-600">
              Recognized by major organizations and regulatory bodies
            </p>
          </div>
        </div>

        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-blue-600 tracking-wider uppercase">Our Credentials</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">Certificates & Accreditations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {accreditations.map((accreditation, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group border-2 border-gray-100 hover:border-blue-200"
            >
              <div className="relative">
                <div className="aspect-square flex items-center justify-center p-10 bg-gradient-to-br from-gray-50 to-white">
                  <img
                    src={accreditation.logo_url}
                    alt={accreditation.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="p-6 border-t-2 border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 text-center mb-2">
                  {accreditation.name}
                </h3>
                <p className="text-sm text-gray-600 text-center">
                  {accreditation.description}
                </p>
                {accreditation.certificate_pdf_url && (
                  <a
                    href={accreditation.certificate_pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 block text-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    View Certificate →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-10 md:p-12 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Commitment to Excellence</h2>
          <p className="text-gray-200 text-lg max-w-3xl mx-auto mb-6">
            These certifications represent our ongoing dedication to maintaining the highest standards in safety, quality, and environmental responsibility across all our operations.
          </p>
          <div className="inline-block w-24 h-1 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
