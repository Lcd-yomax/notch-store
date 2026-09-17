import { createClient } from '@supabase/supabase-js';

// Storefront reads use the anon key so row-level security applies
// (hidden prices stay hidden even if a query is wrong).
// The service-role client in ./client.ts is reserved for server-side writes such as orders.
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
);
