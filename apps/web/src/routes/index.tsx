import { useUser } from '@clerk/clerk-react'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { useCreateEndeavor, useUserEndeavorsWithPlatforms } from '@/api/endeavors'
import { usePlatforms } from '@/api/platforms'
import { Activity } from '@/components/heatmap/Activity'
import { DotmSquare12 } from '@/components/ui/dotm-square-12'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

function IndexPage() {
  const { user } = useUser()

  const { data: platforms } = usePlatforms()
  const { data: endeavors, refetch } = useUserEndeavorsWithPlatforms(user?.id ?? '')
  const createEndeavor = useCreateEndeavor()
  const hasNoEndeavors = Array.isArray(endeavors) && endeavors.length === 0
  const addedPlatformIds = new Set(endeavors?.map((endeavor) => endeavor.platformId))
  const [selectedPlatformId, setSelectedPlatformId] = useState<number | null>(null)
  const selectedPlatformIndex = Math.max(
    0,
    platforms?.findIndex((platform) => platform.id === selectedPlatformId) ?? 0,
  )

  useEffect(() => {
    const firstAvailablePlatform = platforms?.find((platform) => !addedPlatformIds.has(platform.id))

    if (selectedPlatformId === null || addedPlatformIds.has(selectedPlatformId)) {
      setSelectedPlatformId(firstAvailablePlatform?.id ?? null)
    }
  }, [endeavors, platforms, selectedPlatformId])

  async function formAction(formData: FormData) {
    const platform_id = parseInt(formData.get('platform_id') as string)
    const username = formData.get('username') as string

    if (!user?.id || Number.isNaN(platform_id) || addedPlatformIds.has(platform_id)) {
      console.error('User ID and platform are required')
      return
    }

    try {
      const res = await createEndeavor.mutateAsync({
        userId: user.id,
        platformId: platform_id,
        username: username,
      })
      refetch()
      console.log(res)
    } catch (error) {
      console.error('Failed to create endeavor:', error)
    }
  }

  return (
    <div className='grid min-w-0 gap-6 py-6'>
      <div className='mx-auto w-full max-w-6xl min-w-0'>
        <form
          action={formAction}
          className='flex min-w-0 flex-col gap-2 border border-gray-800 bg-gray-950/60 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] md:flex-row md:flex-wrap md:items-center lg:flex-nowrap'
        >
          <input type='hidden' name='platform_id' value={selectedPlatformId ?? ''} />

          <div
            className='relative flex h-auto w-full min-w-0 gap-1 overflow-hidden rounded-lg border border-gray-800 bg-black p-1 select-none md:h-11 md:flex-[1_1_20rem]'
            aria-label='Platform'
            role='radiogroup'
          >
            {selectedPlatformId !== null && (
              <div
                className='absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-md border border-gray-600 bg-gray-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[left] duration-300 ease-out'
                style={{
                  left: `calc(0.25rem + ${selectedPlatformIndex} * ((100% - 0.5rem) / 3))`,
                  width: 'calc((100% - 0.5rem) / 3)',
                }}
              />
            )}

            {platforms?.map((p) => {
              const isSelected = selectedPlatformId === p.id
              const isDisabled = addedPlatformIds.has(p.id)

              return (
                <button
                  aria-checked={isSelected}
                  disabled={isDisabled}
                  className={[
                    'relative z-10 min-h-9 min-w-0 flex-1 truncate rounded-md border border-transparent px-2 text-xs font-semibold transition-colors focus:outline-none sm:px-3 sm:text-sm',
                    isSelected
                      ? 'text-white'
                      : isDisabled
                        ? 'cursor-not-allowed text-gray-700'
                        : 'text-gray-500 hover:text-gray-200',
                  ].join(' ')}
                  key={p.id}
                  onClick={() => setSelectedPlatformId(p.id)}
                  role='radio'
                  type='button'
                >
                  {p.title}
                </button>
              )
            })}
          </div>

          <input
            name='username'
            type='text'
            placeholder='username'
            className='h-11 w-full min-w-0 border border-gray-800 bg-black px-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-gray-500 focus:outline-none md:flex-[1_1_14rem]'
          />

          <button
            type='submit'
            disabled={selectedPlatformId === null}
            className='h-11 w-full shrink-0 border border-emerald-800 bg-emerald-950 px-5 text-sm font-semibold text-emerald-100 transition-colors select-none hover:border-emerald-600 hover:bg-emerald-900 focus:border-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:border-gray-800 disabled:bg-gray-950 disabled:text-gray-600 md:w-auto'
          >
            + Add
          </button>
        </form>
      </div>

      {hasNoEndeavors && (
        <section className='mx-auto flex w-full max-w-6xl flex-col items-center border border-gray-900 bg-gray-950/40 px-6 py-12 text-center shadow-[0_0_0_1px_rgba(255,255,255,0.02)] select-none sm:px-10 sm:py-16'>
          <div className='mb-5 flex size-16 items-center justify-center border border-emerald-900/70 bg-black text-emerald-300'>
            <DotmSquare12 ariaLabel='No connections yet' size={42} dotSize={5} speed={1.1} bloom />
          </div>

          <h1 className='text-xl font-bold text-white sm:text-2xl'>Add your first connection</h1>
          <p className='mt-3 max-w-md text-sm leading-6 text-gray-400'>
            Choose a platform, enter your username, and HeatMap will build your activity view here.
          </p>
        </section>
      )}

      {/* {JSON.stringify(endeavors, null, 2)} */}
      {endeavors?.map((e) => (
        <div className='min-w-0' key={[e.userId, e.platformTitle].join('-')}>
          <Activity
            userId={e.userId ?? ''}
            username={e.username ?? ''}
            platform={e.platformTitle ?? ''}
            platform_id={e.platformId ?? 0}
            refetch={refetch}
          />
        </div>
      ))}
    </div>
  )
}
