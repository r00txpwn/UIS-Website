# UIS CMS - Admin Guide

## Getting Started

### 1. Create Your Admin Account

1. Visit `/signup` in your browser
2. Enter your email and password
3. Click "Create Admin Account"
4. You'll be redirected to the login page

### 2. Login to Admin Panel

1. Visit `/login` in your browser
2. Enter your credentials
3. Click "Sign In"
4. You'll be redirected to `/admin` (the dashboard)

## Admin Panel Structure

The admin panel is located at `/admin` and includes the following sections:

### Dashboard (`/admin`)
- Overview of all content
- Quick statistics
- Quick action links

### Services Management (`/admin/services`)
- Add, edit, and delete services
- Set service title, slug, description, content
- Add service images
- Publish/unpublish services
- Set display order

### Accreditations Management (`/admin/accreditations`)
- Add, edit, and delete accreditations
- Upload certification logos
- Link to certificate PDF files
- Add descriptions
- Set display order

### Policies Management (`/admin/policies`)
- Add, edit, and delete company policies
- Upload policy PDF documents
- Categorize policies
- Add descriptions
- Set display order

### Products Management (`/admin/products`)
- Add, edit, and delete products
- Add product images
- Link to specification sheet PDFs
- Categorize products
- Add descriptions
- Set display order

## Database Structure

The CMS uses Supabase with the following tables:

- **services** - Service offerings
- **service_images** - Additional images for services
- **accreditations** - Certifications and accreditations
- **policies** - Company policy documents
- **products** - Product catalog
- **product_company_logos** - Partner/vendor logos
- **user_profiles** - User information and roles
- **audit_logs** - Activity tracking

## Storage Buckets

The following storage buckets are available:

- **services** - Service images (5MB limit, images only)
- **accreditations** - Certification logos and PDFs (10MB limit)
- **policies** - Policy documents (10MB limit, PDF only)
- **products** - Product images (5MB limit, images only)

## Important Notes

1. All admin routes are protected and require authentication
2. Images and PDFs should be uploaded to the public directory or use Supabase storage
3. Use meaningful slugs for services (e.g., "fleet-management")
4. Set appropriate display_order values to control content ordering
5. All content is published to the public website immediately when marked as "published"

## Security

- Row Level Security (RLS) is enabled on all tables
- Only authenticated users can modify content
- Public users can only read published content
- All storage buckets have appropriate read/write policies

## Support

For technical support or questions about the CMS, contact your system administrator.
