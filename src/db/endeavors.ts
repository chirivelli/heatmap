import { createSupabaseClient } from '@/db/supabase'

const supabase = createSupabaseClient()

export const getEndeavors = async () => supabase.from('endeavors').select()
