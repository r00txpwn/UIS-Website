# UIS CMS - Admin Guide

## CRITICAL: First Time Setup

Since there is NO public signup page (for security), you need to create the first admin user directly in Supabase:

### Option 1: Use Supabase Dashboard (Recommended)
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Users
3. Click "Add user" or "Invite user"
4. Enter email and password
5. The user will be created with access to the admin panel

### Option 2: After First User is Created
Once you have your first admin account:
1. Login at `/login`
2. Go to `/admin/users`
3. Use the secure admin panel to create additional admin users

## Security Model

- **NO PUBLIC SIGNUP**: The `/signup` route has been removed for security
- **Protected Admin Panel**: All `/admin/*` routes require authentication
- **User Creation**: Only logged-in admins can create new users via `/admin/users`

## Admin Panel Access

### Login
1. Visit `/login`
2. Enter your credentials
3. You'll be redirected to `/admin` (the dashboard)

## Admin Panel Structure

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

### User Management (`/admin/users`)
- **SECURE**: Only accessible when logged in
- Create new admin users
- Set email and password for new users
- All created users have admin privileges

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
2. There is NO public signup - users must be created via Supabase dashboard or `/admin/users`
3. Images and PDFs should be uploaded to the public directory or use Supabase storage
4. Use meaningful slugs for services (e.g., "fleet-management")
5. Set appropriate display_order values to control content ordering
6. All content is published to the public website immediately when marked as "published"

## Security Features

- **No Public Signup**: Prevents unauthorized user creation
- **Protected Routes**: All admin pages require authentication
- **Row Level Security (RLS)**: Enabled on all database tables
- **Secure User Creation**: Only authenticated admins can create new users
- **Storage Policies**: Proper read/write permissions on all buckets

## Support

For technical support or questions about the CMS, contact your system administrator.
