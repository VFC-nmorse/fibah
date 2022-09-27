import { createClient } from '@supabase/supabase-js';

// import.meta.env.VITE_ is how vite.js does .env imports
const supabaseUrl = import.meta.env.VITE_FIBBY_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_FIBBY_PUBLIC_SUPABASE_ANON_KEY;

// create the supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);