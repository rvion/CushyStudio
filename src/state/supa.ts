import type { Database } from 'src/supa/database.types'

// https://supabase.com/dashboard/project/hcbawdmupnlvqtyaubvt/api
import { createClient, SupabaseClient } from '@supabase/supabase-js'

export const mkSupa = (): SupabaseClient<Database> => {
    // const supabaseUrl = 'https://hcbawdmupnlvqtyaubvt.supabase.co'
    const supabaseUrl = 'https://app.cushystudio.com'

    // This key is safe to use in a browser if you have enabled Row Level Security for your tables and configured policies.
    // https://supabase.com/dashboard/project/hcbawdmupnlvqtyaubvt/settings/api
    const supabaseKey =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjYmF3ZG11cG5sdnF0eWF1YnZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE5MDAxMzQsImV4cCI6MjAxNzQ3NjEzNH0.uqeWM2KalDxBD2Z52hrXlRLueDziW1_jaUXdmmFyIpQ'

    const supabase = createClient(supabaseUrl, supabaseKey)

    return supabase
}
