'use client';

import { getSupabaseClient } from '@/supabase/client';

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  data: Record<string, any> | null;
  created_at: string;
}

export const notificationService = {
  /** Get all notifications for the current user */
  getUserNotifications: async (userId: string, limit = 50): Promise<Notification[]> => {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  },

  /** Get unread notification count */
  getUnreadCount: async (userId: string): Promise<number> => {
    const supabase = getSupabaseClient();
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return count || 0;
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      return 0;
    }
  },

  /** Mark a single notification as read */
  markAsRead: async (notificationId: string, userId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  },

  /** Mark all notifications as read */
  markAllAsRead: async (userId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to mark all as read:', error);
      return false;
    }
  },

  /** Delete a notification */
  deleteNotification: async (notificationId: string, userId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  },

  /** Create a notification (for use in order flows, etc.) */
  createNotification: async (
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: Record<string, any>
  ): Promise<Notification | null> => {
    const supabase = getSupabaseClient();
    try {
      const { data: notif, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          title,
          message,
          data: data || null,
          is_read: false,
        })
        .select()
        .single();

      if (error) throw error;
      return notif;
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  },
};
