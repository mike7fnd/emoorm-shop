'use client';

import { getSupabaseClient } from '@/supabase/client';

export interface Address {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address_line_1: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  zip: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAddressInput {
  name: string;
  phone: string;
  address_line_1: string;
  barangay?: string;
  city: string;
  province: string;
  region: string;
  zip: string;
  is_default?: boolean;
}

export const addressService = {
  /** Get all addresses for the current user */
  getUserAddresses: async (userId: string): Promise<Address[]> => {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      return [];
    }
  },

  /** Get the default address */
  getDefaultAddress: async (userId: string): Promise<Address | null> => {
    const supabase = getSupabaseClient();
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // no default
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Failed to fetch default address:', error);
      return null;
    }
  },

  /** Create a new address */
  createAddress: async (userId: string, input: CreateAddressInput): Promise<Address | null> => {
    const supabase = getSupabaseClient();
    try {
      // If this is set as default, unset all other defaults first
      if (input.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('addresses')
        .insert({
          user_id: userId,
          name: input.name,
          phone: input.phone,
          address_line_1: input.address_line_1,
          barangay: input.barangay || '',
          city: input.city,
          province: input.province,
          region: input.region,
          zip: input.zip,
          is_default: input.is_default ?? false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create address:', error);
      return null;
    }
  },

  /** Update an existing address */
  updateAddress: async (addressId: string, userId: string, input: Partial<CreateAddressInput>): Promise<Address | null> => {
    const supabase = getSupabaseClient();
    try {
      // If setting as default, unset all other defaults first
      if (input.is_default) {
        await supabase
          .from('addresses')
          .update({ is_default: false })
          .eq('user_id', userId);
      }

      const { data, error } = await supabase
        .from('addresses')
        .update({
          ...input,
          updated_at: new Date().toISOString(),
        })
        .eq('id', addressId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update address:', error);
      return null;
    }
  },

  /** Delete an address */
  deleteAddress: async (addressId: string, userId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to delete address:', error);
      return false;
    }
  },

  /** Set an address as default */
  setDefault: async (addressId: string, userId: string): Promise<boolean> => {
    const supabase = getSupabaseClient();
    try {
      // Unset all existing defaults
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', userId);

      // Set new default
      const { error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to set default address:', error);
      return false;
    }
  },
};
