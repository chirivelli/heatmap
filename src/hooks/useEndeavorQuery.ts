import { useSession } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'

import { useSupabaseClient } from '@/hooks/useSupabaseClient'
import type { Database } from '@/lib/db.types'

type Endeavor = Database['public']['Views']['endeavors_with_platforms']['Row']


export function useEndeavorQuery() {
  const { session } = useSession()

  const supabase = useSupabaseClient()

  return useQuery<Endeavor[]>({
    queryKey: ['endeavors'],
    queryFn: async () => {
      const res = await supabase
        .from('endeavors_with_platforms')
        .select()
        .eq('user_id', session?.user.id ?? '')
      return res.data ?? []
    },
  })
}
