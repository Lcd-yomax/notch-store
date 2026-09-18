import { NextResponse } from 'next/server';
import { supabasePublic as supabase } from '@/lib/supabase/public';

// GET /api/announcements -> the live announcement shown as a full-screen pop-up (or null).
// Read with the anon key: row-level security only returns active announcements within their dates.
export async function GET() {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .lte('starts_at', now)
    .gte('ends_at', now)
    .order('starts_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching announcement:', error.message);
    return NextResponse.json(null);
  }

  const announcement = data
    ? {
        id: data.id,
        title: data.title,
        body: data.body,
        image_url: data.image_url,
        cta_label: data.cta_label,
        cta_url: data.cta_url,
        // Columns added by add_packs_and_popups.sql: defaults until it is run
        display_delay_seconds: Number.isFinite(Number(data.display_delay_seconds)) ? Number(data.display_delay_seconds) : 3,
        show_once: data.show_once ?? true,
        version: data.updated_at ?? data.created_at,
      }
    : null;

  return NextResponse.json(announcement, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
