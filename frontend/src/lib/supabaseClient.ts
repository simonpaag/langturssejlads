import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Dummy-fallbacks bruges her i constructoren, da Next.js evaluerer filen under `npm run build`.
// Uden the placeholder string kaster Supabase en 'URL required' RuntimeError, der lydløst dræber Vercel-byggeriet.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
