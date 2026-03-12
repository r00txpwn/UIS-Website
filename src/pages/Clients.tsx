import Section from '../components/Section';

export default function Clients() {
  const clients = [
    { name: 'BP', logo: 'https://logo.clearbit.com/bp.com' },
    { name: 'SOCAR Fugro', logo: 'https://logo.clearbit.com/socar.az' },
    { name: 'Caspian Marine Services', logo: '' },
    { name: 'Franks/Expro', logo: 'https://logo.clearbit.com/expro.com' },
    { name: 'Saipem', logo: 'https://logo.clearbit.com/saipem.com' },
    { name: 'Prokon', logo: '' },
    { name: 'Azerbaijan Shipping Company', logo: '' },
    { name: 'Atlas Engineering', logo: '' },
    { name: 'Bos Shelf', logo: '' },
    { name: 'Subsea7', logo: 'https://logo.clearbit.com/subsea7.com' },
    { name: 'JOCAP', logo: '' },
    { name: 'Transmarine Shipping', logo: '' },
    { name: 'P&O Maritime', logo: '' },
    { name: 'PD&MS', logo: '' },
    { name: 'Pioneer Engineering', logo: '' },
    { name: 'Wood Group', logo: 'https://logo.clearbit.com/woodplc.com' },
    { name: 'Baku Shipyard', logo: '' },
    { name: 'SOCAR DALGIDJ', logo: 'https://logo.clearbit.com/socar.az' },
    { name: 'HOLCIM AZERBAIJAN OJSC', logo: 'https://logo.clearbit.com/holcim.com' },
    { name: 'Turan Drilling', logo: '' },
    { name: 'Azfen', logo: '' },
    { name: 'Maersk Drilling', logo: 'https://logo.clearbit.com/maerskdrilling.com' },
    { name: 'AZ Logistics', logo: '' },
    { name: 'Silkway', logo: '' },
    { name: 'SDL Nobel LLC', logo: '' },
    { name: 'Khazar Fabrication', logo: '' },
    { name: 'Baku Steel Company', logo: '' },
    { name: 'Caspian Shipyard', logo: '' },
    { name: 'Shinkar MMC', logo: '' },
    { name: 'AAS ATE', logo: '' },
    { name: 'Caspian Drilling Company', logo: '' },
    { name: 'Bahar Energy', logo: '' },
    { name: 'ATLAS CORP LLC', logo: '' },
    { name: 'AAS Ekol LLC', logo: '' },
    { name: 'Caspian Pipe Coatings', logo: '' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center">Our Clients</h1>
          <p className="text-gray-300 text-center mt-4 text-lg">
            Trusted by leading organizations worldwide
          </p>
        </div>
      </div>

      <Section title="">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center">
          {clients.map((client, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="text-center">
                <div className="relative h-16 flex items-center justify-center">
                  {client.logo ? (
                    <img
                      src={client.logo}
                      alt={`${client.name} logo`}
                      className="h-16 w-auto mx-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          const fallback = document.createElement('div');
                          fallback.className = 'text-sm font-semibold text-gray-700 px-2';
                          fallback.textContent = client.name;
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="text-sm font-semibold text-gray-700 px-2">
                      {client.name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 text-lg">...and many more</p>
        </div>
      </Section>
    </div>
  );
}
