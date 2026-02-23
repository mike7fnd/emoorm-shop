-- Migration V2: Full backend — notifications, order enhancements, RLS updates
-- Run this in Supabase SQL Editor AFTER supabase-schema.sql and supabase-migration.sql

-- ============================================================
-- 1. Add seller_id + address_id + payment_method to orders
-- ============================================================
ALTER TABLE orders ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES seller_profiles(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS address_id UUID REFERENCES addresses(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_fee DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT;

-- Generate human-readable order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_order_number ON orders;
CREATE TRIGGER set_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ============================================================
-- 2. Add product snapshot to order_items (prices at purchase time)
-- ============================================================
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_image TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_brand TEXT;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS seller_id UUID REFERENCES seller_profiles(id) ON DELETE SET NULL;

-- ============================================================
-- 3. Notifications table
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'general',  -- order, promo, system, general
  title TEXT NOT NULL,
  description TEXT,
  is_read BOOLEAN DEFAULT false,
  reference_id TEXT,  -- e.g. order_id for order notifications
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- System / triggers can insert for any user
CREATE POLICY "Service can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- 4. Seller RLS for orders (sellers can see orders for their products)
-- ============================================================
-- Sellers can view orders that contain their products
CREATE POLICY "Sellers can view orders for their products" ON orders
  FOR SELECT USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

-- Sellers can update order status (ship, etc.)
CREATE POLICY "Sellers can update orders for their products" ON orders
  FOR UPDATE USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

-- Order items: sellers can view items for their orders
CREATE POLICY "Sellers can view order items" ON order_items
  FOR SELECT USING (
    seller_id IN (SELECT id FROM seller_profiles WHERE user_id = auth.uid())
  );

-- Allow order_items insert by authenticated users during checkout
CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- ============================================================
-- 5. Create notification on order status change
-- ============================================================
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
  status_label TEXT;
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    CASE NEW.status
      WHEN 'pending' THEN status_label := 'Order Placed';
      WHEN 'to-pay' THEN status_label := 'Awaiting Payment';
      WHEN 'to-ship' THEN status_label := 'Being Prepared';
      WHEN 'to-receive' THEN status_label := 'Shipped';
      WHEN 'to-review' THEN status_label := 'Delivered';
      WHEN 'completed' THEN status_label := 'Completed';
      WHEN 'cancelled' THEN status_label := 'Cancelled';
      ELSE status_label := NEW.status;
    END CASE;

    INSERT INTO notifications (user_id, type, title, description, reference_id)
    VALUES (
      NEW.user_id,
      'order',
      'Order ' || status_label,
      'Your order ' || COALESCE(NEW.order_number, NEW.id::TEXT) || ' is now ' || LOWER(status_label) || '.',
      NEW.id::TEXT
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_order_status_change ON orders;
CREATE TRIGGER on_order_status_change
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_order_status_change();

-- Also notify on new order creation
CREATE OR REPLACE FUNCTION notify_new_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, description, reference_id)
  VALUES (
    NEW.user_id,
    'order',
    'Order Placed',
    'Your order ' || COALESCE(NEW.order_number, NEW.id::TEXT) || ' has been placed successfully.',
    NEW.id::TEXT
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_new_order ON orders;
CREATE TRIGGER on_new_order
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION notify_new_order();
