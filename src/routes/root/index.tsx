import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSession, useUser } from '@clerk/clerk-react'
import { createClient } from '@supabase/supabase-js'

import { ProviderRegistry } from '@/providers/ProviderRegistry'
import { NavBar } from '@/routes/root/layout'
import type { ActivityDataPoint, HeatmapProvider } from '@/types/heatmap'
import { Heatmap } from '@/components/Heatmap'

export function Home() {
  const [username, setUsername] = useState('')
  const [provider, setProvider] = useState('GitHub')
  const [providers, setProviders] = useState<HeatmapProvider[]>([])

  useEffect(() => {
    const registry = new ProviderRegistry()
    setProviders(registry.getAllProviders())
  }, [])

  const { data, isFetching, isError, error, refetch, isSuccess } = useQuery<
    ActivityDataPoint[],
    Error
  >({
    queryKey: ['heatmap', provider, username.trim()],
    queryFn: async () => {
      const registry = new ProviderRegistry()
      const currProvider = registry.getProvider(provider)
      if (!currProvider) {
        throw new Error(`Provider ${provider} not found`)
      }
      if (!username.trim()) {
        throw new Error('Please enter a username')
      }
      return currProvider.fetchData(username.trim())
    },
    enabled: false,
    staleTime: 1000 * 60 * 5,
  })

  const { user } = useUser()
  const { session } = useSession()

  const creatClerkSupabaseClient = () =>
    createClient(
      import.meta.env.VITE_SUPABASE_PROJ_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY,
      {
        accessToken: async () => session?.getToken() ?? null,
      },
    )

  const client = creatClerkSupabaseClient()

  useEffect(() => {
    if (!user) return

    async function loadPlatforms() {
      const { data, error } = await client.from('platforms').select()
      console.log({ data, error })
    }

    async function loadEndeavors() {
      const { data, error } = await client.from('endeavors').select()
      console.log({ data, error })
    }

    loadPlatforms()
    loadEndeavors()
  }, [user])

  return (
    <div className='bg-base-200'>
      <NavBar />

      <div className='flex flex-col items-center justify-center gap-4 p-4'>
        <div className='card card-dash bg-base-100 w-max'>
          <div className='card-body items-center'>
            <h2 className='card-title'>Track your Heatmaps!</h2>

            <p>Connect a Platform to start tracking</p>

            <select
              defaultValue='Pick a Platform'
              className='select'
              onChange={(e) => setProvider(e.target.value)}
            >
              <option disabled={true}>Pick a platform</option>
              <option value={'GitHub'}>GitHub</option>
              <option value={'LeetCode'}>LeetCode</option>
              <option value={'BootDev'}>BootDev</option>
            </select>

            <input
              type='text'
              placeholder='username'
              className='input'
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className='card-actions flex-nowrap'>
              <button className='btn btn-primary' onClick={() => refetch()}>
                Connect
              </button>
            </div>
          </div>
        </div>

        <div>
          {isError && error && (
            <div className='mb-8 rounded-md border border-red-200 bg-red-50 p-4'>
              <div className='flex'>
                <div className='flex-shrink-0'>
                  <svg
                    className='h-5 w-5 text-red-400'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
                <div className='ml-3'>
                  <h3 className='text-sm font-medium text-red-800'>Error</h3>
                  <div className='mt-2 text-sm text-red-700'>
                    {error.message}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isFetching && (
            <div className='rounded-lg bg-white p-8 text-center shadow-lg'>
              <div className='inline-flex items-center px-4 py-2 leading-6 font-semibold text-blue-600'>
                <svg
                  className='mr-3 -ml-1 h-5 w-5 animate-spin text-blue-600'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Fetching data from{' '}
                {providers.find((p) => p.name === provider)?.name}
                ...
              </div>
            </div>
          )}

          {!isFetching && Array.isArray(data) && data.length > 0 && (
            <div className='rounded-lg bg-white p-6 shadow-lg'>
              <div className='mb-4'>
                <h2 className='mb-2 text-xl font-semibold text-gray-900'>
                  {username}'s Activity on{' '}
                  {providers.find((p) => p.name === provider)?.name}
                </h2>
                <p className='text-gray-600'>
                  Total contributions:{' '}
                  {data.reduce((sum, point) => sum + point.count, 0)}
                </p>
              </div>

              <div className='overflow-x-auto'>
                <Heatmap
                  data={data}
                  onCellClick={(date: string, count: number) => {
                    console.log(`Clicked on ${date}: ${count} contributions`)
                    // You can add more detailed tooltips or modals here
                  }}
                />
              </div>
            </div>
          )}

          {!isFetching &&
            !isError &&
            isSuccess &&
            Array.isArray(data) &&
            data.length === 0 &&
            username && (
              <div className='rounded-lg bg-white p-8 text-center shadow-lg'>
                <div className='text-gray-500'>
                  <p className='text-lg'>No data found for "{username}"</p>
                  <p className='mt-2 text-sm'>
                    Try a different username or platform
                  </p>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
