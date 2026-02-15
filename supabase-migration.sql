-- Migration: Add stores, products, store_photos, store_genres, store_followers tables
-- Run this in Supabase SQL Editor

-- Add lat, lng, about columns to seller_profiles
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS about TEXT;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 0;
ALTER TABLE seller_profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;

-- Products table (linked to seller_profiles)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  image_hint TEXT DEFAULT 'product image',
  category TEXT,
  stock INTEGER DEFAULT 0,
  sold INTEGER DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 0,
  on_sale BOOLEAN DEFAULT false,
  is_auction BOOLEAN DEFAULT false,
  current_bid DECIMAL(10, 2),
  bid_end_time TIMESTAMP WITH TIME ZONE,
  popularity NUMERIC(3,2) DEFAULT 0.5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store photos table
CREATE TABLE IF NOT EXISTS store_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_hint TEXT DEFAULT 'store photo',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store genres/badges table
CREATE TABLE IF NOT EXISTS store_genres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  icon TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(seller_id, text)
);

-- Store followers table
CREATE TABLE IF NOT EXISTS store_followers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES seller_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, seller_id)
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_followers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Sellers can view their own products" ON products
  FOR SELECT USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can insert their own products" ON products
  FOR INSERT WITH CHECK (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can update their own products" ON products
  FOR UPDATE USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can delete their own products" ON products
  FOR DELETE USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for store_photos
CREATE POLICY "Anyone can view store photos" ON store_photos
  FOR SELECT USING (true);

CREATE POLICY "Sellers can manage their own store photos" ON store_photos
  FOR INSERT WITH CHECK (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can update their own store photos" ON store_photos
  FOR UPDATE USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can delete their own store photos" ON store_photos
  FOR DELETE USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for store_genres
CREATE POLICY "Anyone can view store genres" ON store_genres
  FOR SELECT USING (true);

CREATE POLICY "Sellers can manage their own genres" ON store_genres
  FOR INSERT WITH CHECK (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can update their own genres" ON store_genres
  FOR UPDATE USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Sellers can delete their own genres" ON store_genres
  FOR DELETE USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for store_followers
CREATE POLICY "Anyone can view follower counts" ON store_followers
  FOR SELECT USING (true);

CREATE POLICY "Users can follow stores" ON store_followers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unfollow stores" ON store_followers
  FOR DELETE USING (auth.uid() = user_id);

-- Function to update follower count on seller_profiles
CREATE OR REPLACE FUNCTION update_follower_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE seller_profiles SET followers_count = followers_count + 1 WHERE id = NEW.seller_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE seller_profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = OLD.seller_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_follower_change ON store_followers;
CREATE TRIGGER on_follower_change
  AFTER INSERT OR DELETE ON store_followers
  FOR EACH ROW EXECUTE FUNCTION update_follower_count();

-- Create Supabase Storage bucket for product/store images (run in dashboard or API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('store-images', 'store-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
