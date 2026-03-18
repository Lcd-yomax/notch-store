import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Fallback to anon key if service role is not available (like on the client side). For true secured backend actions, ensure SUPABASE_SERVICE_ROLE_KEY is used.
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey);
