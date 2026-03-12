import { useState, useEffect } from 'react';

interface Partner {
  name: string;
  logo: string;
}

export default function PartnerSlider() {
  const partners: Partner[] = [
    { name: 'Crosby', logo: 'https://logo.clearbit.com/thecrosbygroup.com' },
    { name: 'Koronakis', logo: 'https://logo.clearbit.com/koronakis.gr' },
    { name: 'GN Solids', logo: 'https://logo.clearbit.com/gnsolidscontrol.com' },
    { name: 'Wirelock', logo: 'https://logo.clearbit.com/wirelock.com' },
    { name: 'Bridon-Bekaert', logo: 'https://logo.clearbit.com/bridonbekaert.com' },
    { name: 'Gunnebo', logo: 'https://logo.clearbit.com/gunnebo.com' },
    { name: 'Talurit', logo: 'https://logo.clearbit.com/talurit.com' },
    { name: 'Pewag', logo: 'https://logo.clearbit.com/pewag.com' },
    { name: 'Axiom', logo: 'https://logo.clearbit.com/axiomep.com' },
    { name: 'Tiger Lifting', logo: 'https://logo.clearbit.com/tiger-lifting.com' },
    { name: 'DSR', logo: 'https://logo.clearbit.com/dsr-osg.com' },
    { name: 'SpanSet', logo: 'https://logo.clearbit.com/spanset.com' },
    { name: 'Allsafe', logo: 'https://logo.clearbit.com/allsafejungfalk.com' },
    { name: 'BWR', logo: 'https://logo.clearbit.com/bwrope.com' },
    { name: 'Red Rooster', logo: 'https://logo.clearbit.com/redrooster.com' },
    { name: 'Brunton Shaw', logo: 'https://logo.clearbit.com/bruntonshaw.com' },
    { name: 'Van Beest', logo: 'https://logo.clearbit.com/vanbeest.com' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % partners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [partners.length]);

  const getVisiblePartners = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % partners.length;
      visible.push(partners[index]);
    }
    return visible;
  };

  const visiblePartners = getVisiblePartners();

  return (
    <div className="relative overflow-hidden py-8">
      <div className="flex items-center justify-center gap-12">
        {visiblePartners.map((partner, index) => (
          <div
            key={`${partner.name}-${currentIndex}-${index}`}
            className="flex items-center justify-center w-64 h-40 transition-opacity duration-500"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={partner.logo}
                alt={`${partner.name} logo`}
                className="max-h-32 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'text-gray-700 font-semibold text-lg text-center px-4';
                    fallback.textContent = partner.name;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {partners.map((_, index) => (
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
