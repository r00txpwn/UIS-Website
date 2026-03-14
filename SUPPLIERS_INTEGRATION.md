# Suppliers Feature Integration Guide

## Files Created

1. **`src/pages/admin/SuppliersPage.tsx`** - Admin page for managing suppliers
2. **`src/components/home/SuppliersCarousel.tsx`** - Homepage carousel component

## Integration Steps

### 1. Add Suppliers Route to Admin

Add this route to your admin routing configuration:

```tsx
import SuppliersPage from './pages/admin/SuppliersPage';

// In your routes config:
{
  path: '/admin/suppliers',
  element: <SuppliersPage />
}
```

### 2. Add Suppliers Link to Admin Navigation

In your `AdminLayout.tsx` or admin navigation component, add:

```tsx
<Link
  to="/admin/suppliers"
  className="nav-link"
>
  Suppliers
</Link>
```

### 3. Add Suppliers Carousel to Homepage

In your `HomePage.tsx` or main home component, import and add the carousel:

```tsx
import SuppliersCarousel from '../components/home/SuppliersCarousel';

// Add this component below your Clients section:
<SuppliersCarousel />
```

### 4. Ensure Supabase Client is Configured

Make sure `src/lib/supabase.ts` exists with:

```tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 5. Ensure Storage Bucket Exists

The image upload feature requires a storage bucket named `images`. Create it in Supabase:

1. Go to Storage in Supabase Dashboard
2. Create a new bucket named `images`
3. Make it public for public access to logos
4. Create a folder named `suppliers` inside it (optional, will be created automatically)

## How It Works

### Admin Interface
- **Add/Edit Suppliers**: Upload logos and set display order
- **Manage Suppliers**: View, edit, and delete suppliers
- **Image Upload**: Direct upload to Supabase Storage or use external URLs

### Homepage Display
- Supplier logos appear in an auto-scrolling carousel
- Pauses on hover for better UX
- Responsive design with smooth animations
- Only shows when suppliers exist

### Product Integration
When editing products, the "Supplier (Optional)" dropdown will show all suppliers.
When a supplier is selected, their logo can be displayed with the product.

## Database Structure

The `suppliers` table includes:
- `id` (uuid) - Primary key
- `name` (text) - Supplier name
- `logo_url` (text) - URL to logo image
- `display_order` (integer) - Order in carousel (lower = first)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Security

RLS policies ensure:
- Public can view suppliers (for homepage display)
- Only admins and editors can add/edit/delete suppliers
- Proper authentication checks in place
