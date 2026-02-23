'use client';

import { getSupabaseClient } from '@/supabase/client';

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItemDB {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
  product_brand: string;
  seller_id: string | null;
}

export interface CreateOrderParams {
  userId: string;
  items: CartItem[];
  totalAmount: number;
  addressId?: string;
  paymentMethod?: string;
  shippingFee?: number;
  subtotal?: number;
}

export interface ProductSnapshot {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  sellerId?: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  total_amount: number;
  order_number?: string;
  address_id?: string;
  payment_method?: string;
  shipping_fee?: number;
  subtotal?: number;
  seller_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderWithItems extends Order {
  order_items: OrderItemDB[];
}

/**
 * Order service for managing orders and transactions with Supabase
 */
export const orderService = {
  /**
   * Create an order with product snapshots stored in order_items
   */
  createOrder: async (
    params: CreateOrderParams,
    productSnapshots: ProductSnapshot[]
  ): Promise<{ order: Order; error?: Error }> => {
    const supabase = getSupabaseClient();

    try {
      // Determine seller_id from first item (single-seller order)
      const sellerId = productSnapshots[0]?.sellerId || null;

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: params.userId,
          status: 'to-pay',
          total_amount: params.totalAmount,
          address_id: params.addressId || null,
          payment_method: params.paymentMethod || 'cod',
          shipping_fee: params.shippingFee || 0,
          subtotal: params.subtotal || params.totalAmount,
          seller_id: sellerId,
        })
        .select()
        .single();

      if (orderError) throw new Error(`Failed to create order: ${orderError.message}`);

      const orderId = orderData.id;

      // Create order items with product snapshots
      const orderItems = params.items.map((item) => {
        const snapshot = productSnapshots.find(p => p.id === item.productId);
        return {
          order_id: orderId,
          product_id: item.productId,
          quantity: item.quantity,
          price: snapshot?.price || 0,
          product_name: snapshot?.name || '',
          product_image: snapshot?.image || '',
          product_brand: snapshot?.brand || '',
          seller_id: snapshot?.sellerId || null,
        };
      });

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        // Rollback by deleting the order
        await supabase.from('orders').delete().eq('id', orderId);
        throw new Error(`Failed to create order items: ${itemsError.message}`);
      }

      // Clear cart after successful order
      const { error: cartError } = await supabase
        .from('carts')
        .delete()
        .eq('user_id', params.userId);

      if (cartError) {
        console.warn('Failed to clear cart after order creation:', cartError);
      }

      return { order: orderData };
    } catch (error) {
      console.error('Order creation failed:', error);
      return {
        order: {} as Order,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
      };
    }
  },

  /**
   * Get all orders for a user with their items
   */
  getUserOrders: async (userId: string, status?: string): Promise<OrderWithItems[]> => {
    const supabase = getSupabaseClient();

    try {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as OrderWithItems[]) || [];
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      return [];
    }
  },

  /**
   * Get order counts by status for the current user
   */
  getOrderCountsByStatus: async (userId: string): Promise<Record<string, number>> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('user_id', userId);

      if (error) throw error;

      const counts: Record<string, number> = {
        'to-pay': 0,
        'to-ship': 0,
        'to-receive': 0,
        'to-review': 0,
      };

      (data || []).forEach((order) => {
        if (counts[order.status] !== undefined) {
          counts[order.status]++;
        }
      });

      return counts;
    } catch (error) {
      console.error('Failed to fetch order counts:', error);
      return { 'to-pay': 0, 'to-ship': 0, 'to-receive': 0, 'to-review': 0 };
    }
  },

  /**
   * Get order details with items
   */
  getOrderDetails: async (
    orderId: string,
    userId: string
  ): Promise<OrderWithItems | null> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data as OrderWithItems;
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      return null;
    }
  },

  /**
   * Update order status
   */
  updateOrderStatus: async (orderId: string, userId: string, status: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update order status:', error);
      return false;
    }
  },

  /**
   * Cancel an order (if still in to-pay status)
   */
  cancelOrder: async (orderId: string, userId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { data: order, error: checkError } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .eq('user_id', userId)
        .single();

      if (checkError) throw checkError;

      if (order?.status !== 'to-pay' && order?.status !== 'pending') {
        throw new Error('Can only cancel orders that are not yet shipped');
      }

      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'cancelled', updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('user_id', userId);

      if (updateError) throw updateError;
      return true;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      return false;
    }
  },

  // =================== SELLER FUNCTIONS ===================

  /**
   * Get all orders for a seller (by seller_id)
   */
  getSellerOrders: async (sellerId: string, status?: string): Promise<OrderWithItems[]> => {
    const supabase = getSupabaseClient();

    try {
      let query = supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (status && status !== 'all') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data as OrderWithItems[]) || [];
    } catch (error) {
      console.error('Failed to fetch seller orders:', error);
      return [];
    }
  },

  /**
   * Get seller order counts by status
   */
  getSellerOrderCounts: async (sellerId: string): Promise<Record<string, number>> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('seller_id', sellerId);

      if (error) throw error;

      const counts: Record<string, number> = {
        'to-pay': 0,
        'to-ship': 0,
        'to-receive': 0,
        'to-review': 0,
        'completed': 0,
      };

      (data || []).forEach((order) => {
        if (counts[order.status] !== undefined) {
          counts[order.status]++;
        }
      });

      return counts;
    } catch (error) {
      console.error('Failed to fetch seller order counts:', error);
      return { 'to-pay': 0, 'to-ship': 0, 'to-receive': 0, 'to-review': 0, 'completed': 0 };
    }
  },

  /**
   * Get total sales for a seller
   */
  getSellerTotalSales: async (sellerId: string): Promise<number> => {
    const supabase = getSupabaseClient();

    try {
      const { data, error } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('seller_id', sellerId)
        .in('status', ['to-review', 'completed']);

      if (error) throw error;

      return (data || []).reduce((sum, order) => sum + (order.total_amount || 0), 0);
    } catch (error) {
      console.error('Failed to fetch seller total sales:', error);
      return 0;
    }
  },

  /**
   * Update order status as seller (no user_id check)
   */
  updateOrderStatusAsSeller: async (orderId: string, sellerId: string, status: string): Promise<boolean> => {
    const supabase = getSupabaseClient();

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)
        .eq('seller_id', sellerId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to update order status as seller:', error);
      return false;
    }
  },
};
