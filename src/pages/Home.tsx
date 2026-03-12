import { Building2, ClipboardCheck, Anchor, Users, TrendingUp, Settings, Gauge, UserCheck, Award, Shield, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import Section from '../components/Section';
import ClientSlider from '../components/ClientSlider';
import PartnerSlider from '../components/PartnerSlider';

export default function Home() {
  const services = [
    {
      title: 'Rope Access Solutions',
      description: 'Read More',
      image: '/images/files_8280743-1764243500028-files_8280743-1764243185940-image.png'
    },
    {
      title: 'Facilities Management',
      description: 'Read More',
      image: '/images/facilities-management.png'
    },
    {
      title: 'Training & Consultancy Solutions',
      description: 'Read More',
      image: '/images/training-consultancy.png'
    },
    {
      title: 'Maintenance & Repairs',
      description: 'Read More',
      image: '/images/service-4.png'
    },
    {
      title: 'Rig Move Services',
      description: 'Read More',
      image: '/images/service-5.jpg'
    },
    {
      title: 'Rental Solutions',
      description: 'Read More',
      image: '/images/service-6.jpg'
    },
    {
      title: 'Tank Calibration and Survey',
      description: 'Read More',
      image: '/images/service-7.jpg'
    },
    {
      title: 'Human Resources Management',
      description: 'Read More',
      image: '/images/service-8.jpg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Hero />

      <Section title="Services we offer">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </Section>

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
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 flex items-center justify-center">
              <img
                src="/images/ISO-9001-2015-DQS-Stamp.jpg"
                alt="ISO 9001:2015"
                className="max-h-24 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 flex items-center justify-center">
              <img
                src="/images/cert-iso-140001.png"
                alt="ISO 14001:2015"
                className="max-h-24 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 flex items-center justify-center">
              <img
                src="/images/iso-45001-e-ohs-management-wfsduhygvzdd.jpg"
                alt="ISO 45001"
                className="max-h-24 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 flex items-center justify-center">
              <img
                src="/images/AMA_LEEA-Colour-Logo-Large copy.jpg"
                alt="LEEA"
                className="max-h-24 object-contain opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
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
