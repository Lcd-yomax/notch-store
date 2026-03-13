import { supabase } from './supabase';

export type OrderItemInput = {
  variation_id: string;
  quantity: number;
  unit_price: number;
};

export type CreateOrderInput = {
  full_name: string;
  city: string;
  address: string;
  phone?: string;
  email?: string;
  total_amount: number;
  notes?: string;
  items: OrderItemInput[];
};

/**
 * Service for handling Order related database operations.
 */
export const createOrder = async (orderData: CreateOrderInput) => {
  // 1. Create the main order record
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([
      {
        full_name: orderData.full_name,
        city: orderData.city,
        address: orderData.address,
        phone: orderData.phone,
        email: orderData.email,
        total_amount: orderData.total_amount,
        notes: orderData.notes,
        // status defaults to 'pending' in the DB
      }
    ])
    .select()
    .single();

  if (orderError || !order) {
    console.error('Error creating order:', orderError);
    return { success: false, error: orderError };
  }

  // 2. Insert all the order items linked to the new order_id
  const orderItemsData = orderData.items.map(item => ({
    order_id: order.id,
    variation_id: item.variation_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItemsData);

  if (itemsError) {
    console.error('Error creating order items:', itemsError);
    // Note: In a production app, you might want to handle rollback here if items fail
    return { success: false, error: itemsError };
  }

  // Note: The database trigger 'on_new_order_created' will automatically 
  // insert a notification into the 'notifications' table because of this insert.

  return { success: true, order };
};

export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)');

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data;
};
