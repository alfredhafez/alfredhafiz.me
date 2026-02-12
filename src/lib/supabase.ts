import { createClient } from '@supabase/supabase-js';
import type { Database, ContactMessage, SiteSettings, AdminActivityLog, MessageStats } from './database.types';

export type { ContactMessage, SiteSettings, AdminActivityLog, MessageStats };

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Auth helpers
export const signInWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

// Contact messages helpers
export const fetchContactMessages = async (filters?: {
  status?: string;
  isRead?: boolean;
  limit?: number;
  offset?: number;
}) => {
  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (filters?.status) {
    query = query.eq('status', filters.status);
  }

  if (filters?.isRead !== undefined) {
    query = query.eq('is_read', filters.isRead);
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  const { data, error } = await query;
  return { data, error };
};

export const updateMessageStatus = async (id: string, updates: {
  status?: string;
  isRead?: boolean;
  readAt?: string;
  repliedAt?: string;
  replyContent?: string;
}) => {
  const { data, error } = await supabase
    .from('contact_messages')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  return { data, error };
};

export const deleteMessage = async (id: string) => {
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id);

  return { error };
};

export const getMessageStats = async () => {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('status, is_read');

  if (error) return { data: null, error };

  const stats = {
    total: data.length,
    unread: data.filter(m => !m.is_read).length,
    read: data.filter(m => m.is_read && m.status !== 'replied').length,
    replied: data.filter(m => m.status === 'replied').length,
    archived: data.filter(m => m.status === 'archived').length,
  };

  return { data: stats, error: null };
};

// Site settings helpers
export const fetchSiteSettings = async () => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .single();

  return { data, error };
};

export const updateSiteSettings = async (updates: Partial<Database['public']['Tables']['site_settings']['Update']>) => {
  const { data, error } = await supabase
    .from('site_settings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', 1)
    .select()
    .single();

  return { data, error };
};

// File storage helpers
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error) return { data: null, error };

  const { data: { publicUrl } } = supabase
    .storage
    .from(bucket)
    .getPublicUrl(data.path);

  return { data: { ...data, publicUrl }, error: null };
};

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase
    .storage
    .from(bucket)
    .remove([path]);

  return { error };
};

// Realtime subscription helper
export const subscribeToMessages = (
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .channel('contact_messages_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'contact_messages',
      },
      callback
    )
    .subscribe();

  return subscription;
};

// Admin activity log
export const logActivity = async (
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: Record<string, any>
) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return { error: new Error('No authenticated user') };

  const { error } = await supabase
    .from('admin_activity_log')
    .insert({
      admin_id: user.id,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
    });

  return { error };
};
