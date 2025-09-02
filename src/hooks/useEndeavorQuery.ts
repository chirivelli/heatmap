import { useSession } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'

import { useSupabaseClient } from '@/hooks/useSupabaseClient'
import type { Database } from '@/lib/db.types'

type Endeavor = Database['public']['Tables']['endeavors']['Row']

export function useEndeavorQuery() {
  const { session } = useSession()

  const supabase = useSupabaseClient()

  return useQuery<Endeavor[]>({
    queryKey: ['endeavors'],
    queryFn: async () => {
      const res = await supabase
        .from('endeavors')
        .select()
        .eq('user_id', session?.user.id ?? '')
      return res.data ?? []
    },
  })
}
