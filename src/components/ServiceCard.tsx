import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  image?: string;
}

export default function ServiceCard({ icon: Icon, title, description, image }: ServiceCardProps) {
  return (
    <div className="group cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      {image ? (
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : Icon ? (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <Icon className="w-16 h-16 text-gray-400" strokeWidth={1.5} />
        </div>
      ) : null}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        <p className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors">
          {description}
        </p>
      </div>
    </div>
  );
}
