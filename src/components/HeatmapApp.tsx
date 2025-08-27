import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { UserButton } from '@clerk/clerk-react'

import { Heatmap } from '@/components/Heatmap'
import { ProviderRegistry } from '@/providers/ProviderRegistry'
import type { ActivityDataPoint, HeatmapProvider } from '@/types/heatmap'

export function HeatmapApp() {
  const [username, setUsername] = useState('')
  const [provider, setProvider] = useState<string>('github')
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

  const handleFetchData = async () => {
    await refetch()
  }

  const handleCellClick = (date: string, count: number) => {
    console.log(`Clicked on ${date}: ${count} contributions`)
    // You can add more detailed tooltips or modals here
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetchData()
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 px-4 py-8'>
      <div className='mx-auto max-w-6xl'>
        <div className='flex justify-end'>
          <UserButton />
        </div>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-4xl font-bold text-gray-900'>
            Activity Heatmap
          </h1>
          <p className='text-lg text-gray-600'>
            Visualize your activity across different platforms
          </p>
        </div>

        <div className='mb-8 rounded-lg bg-white p-6 shadow-lg'>
          <div className='flex flex-col items-end gap-4 sm:flex-row'>
            <div className='flex-1'>
              <label
                htmlFor='username'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                Username
              </label>
              <input
                id='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Enter username...'
                className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              />
            </div>

            <div className='w-full sm:w-48'>
              <label
                htmlFor='provider'
                className='mb-2 block text-sm font-medium text-gray-700'
              >
                Platform
              </label>
              <select
                id='provider'
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none'
              >
                {providers.map((provider) => (
                  <option key={provider.name} value={provider.name}>
                    {provider.displayName}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleFetchData}
              disabled={isFetching || !username.trim()}
              className='w-full rounded-md bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto'
            >
              {isFetching ? 'Loading...' : 'Generate Heatmap'}
            </button>
          </div>
        </div>

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
                <div className='mt-2 text-sm text-red-700'>{error.message}</div>
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
              {providers.find((p) => p.name === provider)?.displayName}
              ...
            </div>
          </div>
        )}

        {!isFetching && Array.isArray(data) && data.length > 0 && (
          <div className='rounded-lg bg-white p-6 shadow-lg'>
            <div className='mb-4'>
              <h2 className='mb-2 text-xl font-semibold text-gray-900'>
                {username}'s Activity on{' '}
                {providers.find((p) => p.name === provider)?.displayName}
              </h2>
              <p className='text-gray-600'>
                Total contributions:{' '}
                {data.reduce((sum, point) => sum + point.count, 0)}
              </p>
            </div>

            <div className='overflow-x-auto'>
              <Heatmap data={data} onCellClick={handleCellClick} />
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
  )
}
