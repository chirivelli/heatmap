import { useSupabaseClient } from '@/db/useSupabaseClient'
import { Endeavors } from '@/routes/root/(heatmap)/Endeavors'

export function IndexPage() {
  const client = useSupabaseClient()

  async function formAction(formData: FormData) {
    const platform_id = parseInt(formData.get('platform_id') as string)
    const username = formData.get('username') as string

    const res = await client.from('endeavors').insert({
      platform_id,
      username,
    })

    console.log(res.data)
  }

  return (
    <div className='grid gap-4'>
      <div className='mx-auto bg-gray-900 p-4'>
        <form action={formAction} className='flex flex-nowrap gap-4'>
          <select
            defaultValue='Pick a Platform'
            className='bg-gray-800 p-2'
            name='platform_id'
          >
            <option disabled={true}>Pick a platform</option>
            <option value={1}>GitHub</option>
            <option value={2}>LeetCode</option>
            <option value={3}>BootDev</option>
          </select>

          <input
            name='username'
            type='text'
            placeholder='username'
            className='bg-gray-800 p-2'
          />

          <button type='submit' className='bg-gray-800 p-2'>
            + Add
          </button>
        </form>
      </div>

      <Endeavors />
    </div>
  )
}
