import { useState, useEffect } from 'react';

interface Client {
  name: string;
  logo: string;
}

export default function ClientSlider() {
  const clients: Client[] = [
    { name: 'BP', logo: 'https://logo.clearbit.com/bp.com' },
    { name: 'SOCAR', logo: 'https://logo.clearbit.com/socar.az' },
    { name: 'Saipem', logo: 'https://logo.clearbit.com/saipem.com' },
    { name: 'Subsea7', logo: 'https://logo.clearbit.com/subsea7.com' },
    { name: 'Wood Group', logo: 'https://logo.clearbit.com/woodplc.com' },
    { name: 'Maersk Drilling', logo: 'https://logo.clearbit.com/maerskdrilling.com' },
    { name: 'Holcim', logo: 'https://logo.clearbit.com/holcim.com' },
    { name: 'Expro', logo: 'https://logo.clearbit.com/expro.com' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % clients.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [clients.length]);

  const getVisibleClients = () => {
    const visible = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentIndex + i) % clients.length;
      visible.push(clients[index]);
    }
    return visible;
  };

  const visibleClients = getVisibleClients();

  return (
    <div className="relative overflow-hidden py-8">
      <div className="flex items-center justify-center gap-12">
        {visibleClients.map((client, index) => (
          <div
            key={`${client.name}-${currentIndex}-${index}`}
            className="flex items-center justify-center w-64 h-40 transition-opacity duration-500"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="max-h-32 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const fallback = document.createElement('div');
                    fallback.className = 'text-gray-700 font-semibold text-lg text-center px-4';
                    fallback.textContent = client.name;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {clients.map((_, index) => (
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
