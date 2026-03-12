import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Service {
  title: string;
  description: string;
  content: string;
  image_url: string;
  created_at: string;
}

interface ServiceImage {
  image_url: string;
  alt_text: string;
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [images, setImages] = useState<ServiceImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      if (!slug) return;

      const { data: serviceData } = await supabase
        .from('services')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .maybeSingle();

      if (serviceData) {
        setService(serviceData);

        const { data: imagesData } = await supabase
          .from('service_images')
          .select('image_url, alt_text')
          .eq('service_id', serviceData.id)
          .order('display_order', { ascending: true });

        if (imagesData) setImages(imagesData);
      }

      setLoading(false);
    };

    fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Not Found</h1>
          <p className="text-gray-600 mb-8">The service you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-slate-500 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {service.title}
              </h1>
              <p className="text-gray-200 text-xl leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={service.image_url}
                  alt={service.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose prose-lg max-w-none">
              <div className="bg-gradient-to-r from-blue-50 to-transparent p-8 rounded-xl mb-8 border-l-4 border-blue-600">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-0">About This Service</h2>
                <p className="text-gray-700 leading-relaxed mb-0">
                  {service.content}
                </p>
              </div>

              {images.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {images.map((image, index) => (
                      <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                        <img
                          src={image.image_url}
                          alt={image.alt_text}
                          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-gradient-to-br from-slate-800 to-blue-900 rounded-2xl p-10 text-white">
                <h3 className="text-2xl font-bold mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>Industry-leading expertise and certified professionals</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>Compliance with international standards and regulations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>Cost-effective solutions tailored to your needs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-blue-300 flex-shrink-0 mt-0.5" />
                    <span>24/7 support and rapid response times</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-white rounded-xl border-2 border-gray-100 p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
              <p className="text-gray-600 mb-6">
                Interested in this service? Contact us to discuss your requirements and get a customized solution.
              </p>
              <Link
                to="/contact"
                className="block w-full bg-blue-600 text-white text-center px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                Contact Us
              </Link>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Related Services</h4>
                <Link
                  to="/"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Services →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
