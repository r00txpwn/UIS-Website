/*
  # Populate Database with Existing Website Content

  This migration adds all the existing hardcoded content from the website into the CMS database,
  making it fully editable through the admin panel.

  ## Services Added
  1. Rope Access Solutions
  2. Facilities Management
  3. Training & Consultancy Solutions
  4. Maintenance & Repairs
  5. Rig Move Services
  6. Rental Solutions
  7. Tank Calibration and Survey
  8. Human Resources Management
  9. Fleet Management (from menu)
  10. NDT Inspection, Testing & Certification (from menu)

  ## Accreditations Added
  1. ISO 14001:2015 - Environmental Management System
  2. DDLA - Azerbaijan State Marine Certification
  3. ISO 9001:2015 - Quality Management System
  4. RMRS NDT - Non-Destructive Testing
  5. ISO 45001 - Occupational Health & Safety
  6. RMRS Lifting - Lifting Equipment Certification
  7. LEEA Certificate - Lifting Equipment Engineers

  ## Changes
  - All services are marked as published
  - Display order set to match current website layout
  - Images mapped to existing public folder assets
  - Slugs created for URL-friendly service pages
*/

-- Insert all services from the homepage and menu
INSERT INTO services (title, slug, description, content, image_url, published, display_order) VALUES
(
  'Rope Access Solutions',
  'rope-access-solutions',
  'Professional rope access services for safe and efficient operations at height',
  'UIS provides comprehensive rope access solutions for industrial applications. Our certified technicians deliver safe, efficient, and cost-effective access to challenging work locations, reducing the need for traditional scaffolding or mechanical lifts.',
  '/images/files_8280743-1764243500028-files_8280743-1764243185940-image.png',
  true,
  1
),
(
  'Facilities Management',
  'facilities-management',
  'Complete facilities management solutions for industrial and commercial operations',
  'Our facilities management services ensure optimal operation and maintenance of your infrastructure. We provide comprehensive solutions including preventive maintenance, emergency response, and facility optimization.',
  '/images/facilities-management.png',
  true,
  2
),
(
  'Training & Consultancy Solutions',
  'training-consultancy',
  'Expert training and consultancy services for industrial operations',
  'UIS offers specialized training programs and consultancy services designed to enhance safety, efficiency, and compliance in industrial operations. Our experienced team provides customized solutions tailored to your specific needs.',
  '/images/training-consultancy.png',
  true,
  3
),
(
  'Maintenance & Repairs',
  'maintenance-repairs',
  'Comprehensive maintenance and repair services for industrial equipment',
  'Our maintenance and repair services keep your equipment running at peak performance. We provide scheduled maintenance, emergency repairs, and equipment refurbishment to minimize downtime and extend asset life.',
  '/images/service-4.png',
  true,
  4
),
(
  'Rig Move Services',
  'rig-move-services',
  'Specialized rig moving and relocation services',
  'UIS provides expert rig move services for oil and gas operations. Our experienced team ensures safe, efficient, and compliant rig relocations with minimal disruption to your operations.',
  '/images/service-5.jpg',
  true,
  5
),
(
  'Rental Solutions',
  'rental-solutions',
  'Equipment rental solutions for industrial projects',
  'We offer a comprehensive range of industrial equipment for rent, from lifting gear to specialized tools. Our rental solutions provide flexibility and cost-effectiveness for short-term and long-term projects.',
  '/images/service-6.jpg',
  true,
  6
),
(
  'Tank Calibration and Survey',
  'tank-calibration-survey',
  'Precision tank calibration and survey services',
  'Our tank calibration and survey services ensure accuracy in inventory management and compliance with industry standards. We use advanced technology and certified methods for reliable measurements.',
  '/images/service-7.jpg',
  true,
  7
),
(
  'Human Resources Management',
  'human-resources-management',
  'Professional HR management services for industrial operations',
  'UIS provides comprehensive human resources management solutions including recruitment, training, compliance, and workforce optimization tailored to the industrial sector.',
  '/images/service-8.jpg',
  true,
  8
),
(
  'Fleet Management',
  'fleet-management',
  'Comprehensive fleet management solutions for efficient operations',
  'Our fleet management services provide end-to-end solutions for maintaining and optimizing your vehicle fleet. We ensure compliance, reduce costs, and maximize fleet utilization through advanced tracking and maintenance systems.',
  '/images/service-1.jpg',
  true,
  9
),
(
  'NDT Inspection, Testing & Certification',
  'ndt-inspection',
  'Professional non-destructive testing and certification services',
  'UIS offers comprehensive NDT inspection, testing, and certification services using the latest technology and certified inspectors. We ensure equipment integrity, safety compliance, and regulatory requirements are met across all industrial applications.',
  '/images/service-2.jpg',
  true,
  10
);

-- Insert all accreditations
INSERT INTO accreditations (name, description, logo_url, display_order) VALUES
(
  'ISO 14001:2015',
  'Environmental Management System',
  '/images/cert-iso-140001.png',
  1
),
(
  'DDLA - Azerbaijan State Marine Certification',
  'State Marine Authority',
  '/images/deniz-liman-agentliyi-1.png',
  2
),
(
  'ISO 9001:2015',
  'Quality Management System',
  '/images/ISO-9001-2015-DQS-Stamp.jpg',
  3
),
(
  'RMRS NDT',
  'Non-Destructive Testing',
  '/images/RS-Logo-P307-ENG.jpg',
  4
),
(
  'ISO 45001',
  'Occupational Health & Safety',
  '/images/iso-45001-e-ohs-management-wfsduhygvzdd.jpg',
  5
),
(
  'RMRS Lifting',
  'Lifting Equipment Certification',
  '/images/RS-Logo-P307-ENG.jpg',
  6
),
(
  'LEEA Certificate',
  'Lifting Equipment Engineers',
  '/images/AMA_LEEA-Colour-Logo-Large copy.jpg',
  7
);