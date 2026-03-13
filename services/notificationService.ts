import { supabase } from './supabase';

/**
 * Service for handling Notifications (Admin Dashboard).
 */

export const getUnreadNotifications = async () => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('is_read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching unread notifications:', error);
    return [];
  }

  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }

  return { success: true };
};
