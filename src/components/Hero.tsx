import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface HeroSlide {
  image: string;
  title: string;
  subtitle?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
}

const defaultSlides: HeroSlide[] = [
  {
    image: '/images/Screenshot_2.png',
    title: 'Your Global Partner for Integrated Rigging & NDT Solutions'
  },
  {
    image: '/images/hero-bg.svg',
    title: 'Certified Quality & Safety Standards'
  },
  {
    image: '/images/Screenshot_2.png',
    title: 'Trusted Partner in Oil & Gas Industry'
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);

  useEffect(() => {
    const fetchSlides = async () => {
      const { data, error } = await supabase
        .from('homepage_slides')
        .select('title, subtitle, image_url, button_label, button_url')
        .eq('published', true)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error loading hero slides:', error);
        return;
      }

      if (data && data.length > 0) {
        const mapped: HeroSlide[] = data.map((row) => ({
          image: row.image_url,
          title: row.title,
          subtitle: row.subtitle,
          buttonLabel: row.button_label,
          buttonUrl: row.button_url,
        }));
        setSlides(mapped);
        setCurrentSlide(0);
      }
    };

    fetchSlides();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          <div className="relative h-full flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-white drop-shadow-lg mb-4">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-6">
                  {slide.subtitle}
                </p>
              )}
              {slide.buttonLabel && slide.buttonUrl && (
                <Link
                  to={slide.buttonUrl}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-600/30 transition"
                >
                  {slide.buttonLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white w-8'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
