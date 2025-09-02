import type { Database } from '@/lib/db.types'
import { useSession } from '@clerk/clerk-react'
import { createClient } from '@supabase/supabase-js'

export function useSupabaseClient() {
  const { session } = useSession()

  return createClient<Database>(
    import.meta.env.VITE_SUPABASE_PROJ_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY,
    {
      accessToken: async () => session?.getToken() ?? null,
    },
  )
}
