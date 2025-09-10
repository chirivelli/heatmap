import { useSession } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import type { SignedInSessionResource } from '@clerk/types'
import type { SupabaseClient } from '@supabase/supabase-js'

import { useSupabase } from '@/db/SupabaseProvider'
import type { Database } from '@/db//supabase.types'

export type Endeavor =
  Database['public']['Views']['endeavors_with_platforms']['Row']

export async function findAll(
  client: SupabaseClient<Database>,
  session: SignedInSessionResource | null | undefined,
) {
  const res = await client
    .from('endeavors_with_platforms')
    .select()
    .eq('user_id', session?.user.id ?? '')

  return res.data ?? []
}

export async function save(
  client: SupabaseClient<Database>,
  platform_id: number,
  username: string,
) {
  return await client.from('endeavors').insert({
    platform_id,
    username,
  })
}

export function useEndeavorQuery() {
  const { session } = useSession()

  const supabase = useSupabase()

  return useQuery<Endeavor[]>({
    queryKey: ['endeavors'],
    queryFn: () => findAll(supabase, session),
  })
}
