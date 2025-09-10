import { useQuery } from '@tanstack/react-query'
import type { SupabaseClient } from '@supabase/supabase-js'

import { useSupabase } from '@/db/SupabaseProvider'
import type { Database } from '@/db/supabase.types'

export type Platform = Database['public']['Tables']['platforms']['Row']

export async function findAll(client: SupabaseClient<Database>) {
  const res = await client.from('platforms').select()

  return res.data ?? []
}

export function usePlatformQuery() {
  const supabase = useSupabase()

  return useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: () => findAll(supabase),
    staleTime: 60 * 60 * 1000,
  })
}
