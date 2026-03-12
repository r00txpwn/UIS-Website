/*
  # Create Clients and Suppliers Tables

  1. New Tables
    - `clients`
      - `id` (uuid, primary key)
      - `name` (text) - Client company name
      - `logo_url` (text, nullable) - URL to client logo image
      - `display_order` (integer, default 0) - Order for display in slider
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update
    
    - `suppliers`
      - `id` (uuid, primary key)
      - `name` (text) - Supplier company name
      - `logo_url` (text, nullable) - URL to supplier logo image
      - `display_order` (integer, default 0) - Order for display in slider
      - `created_at` (timestamptz) - Timestamp of creation
      - `updated_at` (timestamptz) - Timestamp of last update

  2. Table Modifications
    - Add `supplier_id` (uuid, nullable) foreign key to `products` table
      - Links products to their suppliers

  3. Security
    - Enable RLS on `clients` table
    - Enable RLS on `suppliers` table
    - Add policies for authenticated users to read data
    - Add policies for authenticated users to insert, update, delete data
*/

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create suppliers table
CREATE TABLE IF NOT EXISTS suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add supplier_id to products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'supplier_id'
  ) THEN
    ALTER TABLE products ADD COLUMN supplier_id uuid REFERENCES suppliers(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS on clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Enable RLS on suppliers
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;

-- Policies for clients table
CREATE POLICY "Anyone can view clients"
  ON clients FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete clients"
  ON clients FOR DELETE
  TO authenticated
  USING (true);

-- Policies for suppliers table
CREATE POLICY "Anyone can view suppliers"
  ON suppliers FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert suppliers"
  ON suppliers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update suppliers"
  ON suppliers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete suppliers"
  ON suppliers FOR DELETE
  TO authenticated
  USING (true);