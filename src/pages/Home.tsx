import { useState, useEffect } from 'react';
import { Award, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import Section from '../components/Section';
import ClientSlider from '../components/ClientSlider';
import PartnerSlider from '../components/PartnerSlider';
import { supabase } from '../lib/supabase';

interface Service {
  title: string;
  description: string;
  image_url: string;
  slug: string;
}

interface Accreditation {
  name: string;
  logo_url: string;
}

interface NewsSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string;
}

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [featuredAccreditations, setFeaturedAccreditations] = useState<Accreditation[]>([]);
  const [latestNews, setLatestNews] = useState<NewsSummary[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('title, description, image_url, slug')
        .eq('published', true)
        .order('display_order', { ascending: true })
        .limit(8);

      if (data) setServices(data);
      // #region agent log
      fetch('http://127.0.0.1:7854/ingest/ef127c7f-c9d5-4790-868a-0089cfe19cfd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'04450d'},body:JSON.stringify({sessionId:'04450d',location:'Home.tsx:fetchServices',message:'Home services fetch',data:{count:data?.length??0,hasError:false},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
    };

    const fetchAccreditations = async () => {
      const { data } = await supabase
        .from('accreditations')
        .select('name, logo_url')
        .order('display_order', { ascending: true })
        .limit(4);

      if (data) setFeaturedAccreditations(data);
      // #region agent log
      fetch('http://127.0.0.1:7854/ingest/ef127c7f-c9d5-4790-868a-0089cfe19cfd',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'04450d'},body:JSON.stringify({sessionId:'04450d',location:'Home.tsx:fetchAccreditations',message:'Home accreditations fetch',data:{count:data?.length??0,hasError:false},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
      // #endregion
    };

    const fetchHomepageNews = async () => {
      // Try featured posts first
      const { data: featured, error: featuredError } = await supabase
        .from('news_posts')
        .select('id, title, slug, excerpt, image_url, published_at')
        .eq('published', true)
        .eq('featured_on_home', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (featuredError) {
        console.error('Error loading homepage news (featured):', featuredError);
        return;
      }

      if (featured && featured.length > 0) {
        setLatestNews(featured);
        return;
      }

      // Fallback to latest published posts
      const { data: latest, error: latestError } = await supabase
        .from('news_posts')
        .select('id, title, slug, excerpt, image_url, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false })
        .limit(3);

      if (latestError) {
        console.error('Error loading homepage news (latest):', latestError);
        return;
      }

      setLatestNews(latest ?? []);
    };

    fetchServices();
    fetchAccreditations();
    fetchHomepageNews();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <Section title="Services we offer">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Link key={index} to={`/services/${service.slug}`}>
              <ServiceCard
                title={service.title}
                description="Read More"
                image={service.image_url}
              />
            </Link>
          ))}
        </div>
      </Section>

      {latestNews.length > 0 && (
        <Section title="Latest News & Events">
          <div className="grid md:grid-cols-3 gap-8">
            {latestNews.map((post) => (
              <Link
                key={post.id}
                to={`/news/${post.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">No image</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                  </p>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {post.excerpt || ''}
                  </p>
                  <span className="inline-block mt-2 text-xs text-blue-600 font-medium group-hover:underline">
                    Read more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <div className="bg-gradient-to-br from-slate-800 via-slate-700 to-blue-900 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Certified Excellence
            </h2>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto">
              Our commitment to quality is backed by internationally recognized certifications
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">ISO Certified</h3>
              <p className="text-gray-300">
                Multiple ISO certifications including 9001, 14001, and 45001
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">7+</h3>
              <p className="text-gray-300">
                Active certifications and accreditations from leading authorities
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Industry Leading</h3>
              <p className="text-gray-300">
                Recognized by international regulatory bodies and standards
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-10">
            {featuredAccreditations.map((accreditation, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 flex items-center justify-center">
                <img
                  src={accreditation.logo_url}
                  alt={accreditation.name}
                  className="max-h-24 object-contain opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/accreditations"
              className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              View All Certifications
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      <Section title="Clients">
        <ClientSlider />
      </Section>

      <Section title="Partners And Suppliers">
        <PartnerSlider />
      </Section>
    </div>
  );
}
