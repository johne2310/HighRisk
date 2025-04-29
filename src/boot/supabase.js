import { createClient } from '@supabase/supabase-js'
import { boot } from 'quasar/wrappers'

// Create a single supabase client for interacting with your database
// In a production environment, these values should be stored in environment variables
// and accessed via import.meta.env.VITE_SUPABASE_URL and import.meta.env.VITE_SUPABASE_KEY


const supabaseUrl=
const supabaseKey=



// const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with your actual Supabase URL
// const supabaseKey = 'YOUR_SUPABASE_KEY' // Replace with your actual Supabase anon/public key
const supabase = createClient(supabaseUrl, supabaseKey)

export default boot(({ app }) => {
  // Make supabase available in all components
  app.config.globalProperties.$supabase = supabase
})

export { supabase }
