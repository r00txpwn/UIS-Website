export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/images/about-hero.svg)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 w-full">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About Us</h1>
          <p className="text-xl text-gray-200 max-w-3xl leading-relaxed">
            Starting as a rigging shop manufacturing wire rope slings and sales of lifting
            accessories, we have now grown to a full fledged Lifting Equipment Sales and
            supply and inspection company providing comprehensive lifting solutions package.
          </p>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Established In 2003 In Baku
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Starting as a rigging shop manufacturing wire rope slings and sales of lifting
                accessories, we have now grown into a full fledged Lifting Equipment sales and
                supply and inspection company providing comprehensive lifting solutions package.
              </p>
              <p className="text-gray-700 leading-relaxed mb-6">
                We are fully committed to Quality and Safety in all our operations.
              </p>
              <p className="text-gray-700 font-semibold mb-4">
                And we are constantly striving to improve on:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Response times for Client requests and requirements</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">On time delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">Competitive rates</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/about-facility.svg"
                alt="UIS Facility in Baku"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/about-vision.svg"
                alt="Our Vision"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                To be the regional market leader and one stop solution provider for all Lifting,
                Rigging, Marine and Inspection requirements in the market.
              </p>
              <p className="text-gray-700 font-semibold mb-4">
                We want to achieve our vision by:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">
                    Consistently delivering the highest quality of products and totally reliable
                    inspection services to every client
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">
                    Implementation of focused marketing strategies which anticipate the needs of
                    our customers
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">
                    Developing our personnel through relevant training and work experience to ensure
                    employee and customer satisfaction
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">
                    Having a Global presence with enterprising solutions
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                "To be an innovative and successful lifting, rigging, marine & inspection company
                by providing world class products & solutions to the clients. Our mission is to
                gain the trust of every client by completing the awarded projects to the highest
                standards in terms of quality, time and within budget while respecting the
                environment in which we work."
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/about-mission.svg"
                alt="Our Mission"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-700 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 rounded-lg overflow-hidden shadow-2xl">
              <img
                src="/images/about-director.svg"
                alt="Directors Message"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-bold mb-6">Directors Message</h2>
              <div className="space-y-4 text-gray-200 leading-relaxed">
                <p>
                  Established in 2003 in Azerbaijan, UIS AZ MMC is a multi-disciplined organization
                  has a manufacturing and sales division and a dedicated inspection and testing
                  division to provide the best lifting and marine solutions in the market.
                </p>
                <p>
                  Our success is derived only through our clients and their satisfaction was
                  achievable because of our dedicated team and through the best quality products
                  we represent in the market.
                </p>
                <p>
                  We represent several major brands as a distributor in the Caspian region like
                  Crosby, Tiger Lifting, Gunnebo, Allsafe, Green Pin, DELTAPLUS and many more
                  which ensures that our clients get the best quality products every time.
                </p>
                <p>
                  We are in process of setting up new offices in various other part of the world
                  where we see an emerging opportunity. We extend our warm welcome to them who
                  shares our vision of future and kindly visit our website regularly for latest
                  updates on our products, services and opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Work With Us?</h3>
          <p className="text-xl mb-8 text-blue-100">
            Contact us today to discuss how we can support your lifting, rigging, and inspection needs.
          </p>
          <a
            href="#contact"
            className="inline-block bg-white text-blue-600 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get In Touch
          </a>
        </div>
      </section>
    </div>
  );
}
