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
    <div className='mx-auto grid gap-4'>
      <div className='card card-dash bg-base-100 w-full'>
        <div className='card-body items-center'>
          <h2 className='card-title'>Track your Heatmaps!</h2>

          <p>Connect a Platform to start tracking</p>

          <form action={formAction} className='card-actions flex-nowrap'>
            <select
              defaultValue='Pick a Platform'
              className='select'
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
              className='input'
            />

            <button type='submit' className='btn btn-primary'>
              + Add
            </button>
          </form>
        </div>
      </div>

      <Endeavors />
    </div>
  )
}
