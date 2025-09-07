import { useQuery } from '@tanstack/react-query'

import { useSupabaseClient } from '@/db/useSupabaseClient'
import type { Database } from '@/db/supabase.types'

export type Platform = Database['public']['Tables']['platforms']['Row']

export function usePlatformQuery() {
  const supabase = useSupabaseClient()

  return useQuery<Platform[]>({
    queryKey: ['platforms'],
    queryFn: async () => {
      const res = await supabase.from('platforms').select()
      return res.data ?? []
    },
    staleTime: 60 * 60 * 1000,
  })
}
