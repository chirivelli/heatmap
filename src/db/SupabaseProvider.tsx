import { SignedIn, SignedOut, SignIn, useSession } from '@clerk/clerk-react'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { createContext, use, useEffect, useState } from 'react'
import type { Database } from './supabase.types'

export const SupabaseContext = createContext<{
  supabase: SupabaseClient<Database> | null
  isLoaded: boolean
}>({
  supabase: null,
  isLoaded: false,
})

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { session } = useSession()
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!session) return

    const client = createClient(
      import.meta.env.VITE_SUPABASE_PROJ_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        accessToken: () => session?.getToken(),
      },
    )

    setSupabase(client)
    setIsLoaded(true)
  }, [session])

  return (
    <SupabaseContext value={{ supabase, isLoaded }}>
      <SignedOut>
        <div className='flex min-h-screen items-center justify-center'>
          <SignIn />
        </div>
      </SignedOut>

      <SignedIn>{isLoaded && children}</SignedIn>
    </SupabaseContext>
  )
}

export const useSupabase = () => {
  const { supabase } = use(SupabaseContext)

  if (!supabase) throw new Error('Supabase not found')

  return supabase
}
