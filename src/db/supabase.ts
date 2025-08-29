import { createClient } from '@supabase/supabase-js'

const SUPABASE_PROJ_URL = import.meta.env.VITE_SUPABASE_PROJ_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const createSupabaseClient = () =>
  createClient(SUPABASE_PROJ_URL, SUPABASE_ANON_KEY)
