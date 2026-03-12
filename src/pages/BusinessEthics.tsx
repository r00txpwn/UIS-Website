import { Shield, Lock, Users, AlertCircle } from 'lucide-react';

export default function BusinessEthics() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div
        className="relative h-[500px] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9), rgba(239, 68, 68, 0.85)), url(/images/ethics-hero.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
        <div className="text-center text-white px-4 relative z-10 max-w-4xl">
          <div className="inline-block mb-6 p-4 bg-white/10 backdrop-blur-sm rounded-full">
            <Shield className="w-16 h-16" />
          </div>
          <h1 className="text-6xl font-bold mb-6 tracking-tight">Say "NO" To CORRUPTION</h1>
          <p className="text-2xl font-light mb-4">Our Commitment to Ethical Practices</p>
          <div className="w-24 h-1 bg-white mx-auto mt-6 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-white rounded-2xl shadow-xl p-10 md:p-16 mb-16 border border-gray-100">
          <div className="mb-8">
            <span className="text-sm font-semibold text-red-600 tracking-wider uppercase">Our Commitment</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-8">Integrity First</h2>
          </div>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-lg font-medium text-gray-900">Dear Colleagues, Vendors, and Associates,</p>

            <p className="text-lg">
              At UIS-AZ MMC, we take a firm stand against corruption in all its forms. <span className="font-semibold text-gray-900">Integrity is more than just a principle</span>. It is the foundation of every decision we make.
            </p>

            <p className="text-lg">
              As part of our unwavering commitment to ethical business practices, we enforce a strict <span className="font-semibold text-red-600">zero-tolerance policy</span> toward bribery and corruption. We are dedicated to upholding the highest standards of honesty, transparency, and full compliance with all legal and regulatory requirements.
            </p>

            <p className="text-lg">
              We expect the same ethical commitment from our employees, partners, suppliers, and all other stakeholders. Any form of bribery, whether offering, accepting, or facilitating improper payments—is strictly prohibited and may result in disciplinary action or legal consequences.
            </p>

            <p className="text-lg">
              We encourage open communication and accountability. Any concerns or suspected violations of this policy can be reported through our official compliance channels. All reports will be received without fear of retaliation and will be treated with strict confidentiality.
            </p>

            <p className="text-lg">
              By fostering a culture of ethical responsibility, we continue to build a trusted, respected, and sustainable organization. Thank you for supporting our commitment to integrity in all business interactions.
            </p>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-700">Sincerely,</p>
              <p className="text-gray-900 font-bold text-lg">Business Head</p>
              <p className="text-red-600 font-semibold">UIS-AZ MMC</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl border-2 border-red-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Tolerance</h3>
            <p className="text-gray-600 leading-relaxed">
              We maintain a strict zero-tolerance policy toward any form of bribery or corruption.
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl border-2 border-red-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Confidentiality</h3>
            <p className="text-gray-600 leading-relaxed">
              All reports are treated with strict confidentiality and without fear of retaliation.
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-xl border-2 border-red-100 hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-red-600 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Accountability</h3>
            <p className="text-gray-600 leading-relaxed">
              Every stakeholder is expected to uphold the same ethical standards we maintain.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-10 md:p-12 mb-16 shadow-xl border-2 border-gray-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Get In Touch</h2>
              <p className="text-gray-700 text-lg mb-4 leading-relaxed">
                Have comments, questions or need more information about our <span className="font-semibold">"Say NO to Corruption"</span> stance? We'd love to hear from you.
              </p>
              <p className="text-gray-600 mb-6 text-lg">
                Contact us today – your inquiries help us strengthen our commitment to integrity.
              </p>
              <a
                href="mailto:ethics.helpline@uis.az"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                ethics.helpline@uis.az
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-red-600 tracking-wider uppercase">Our Mission</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Break The Corruption Chain</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Together, we stand united against corruption and build a foundation of trust and transparency.
          </p>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative">
            <img
              src="/images/files_8280743-1764251188729-2-1024x576.jpg"
              alt="Say NO to Corruption"
              className="w-full h-auto rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
