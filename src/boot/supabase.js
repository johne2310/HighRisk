import { createClient } from '@supabase/supabase-js'
import { boot } from 'quasar/wrappers'

// Create a single supabase client for interacting with your database
// In a production environment, these values should be stored in environment variables
// and accessed via import.meta.env.VITE_SUPABASE_URL and import.meta.env.VITE_SUPABASE_KEY


const supabaseUrl='https://lmvvkbraxtmilcpxbijt.supabase.co'
const supabaseKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtdnZrYnJheHRtaWxjcHhiaWp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1NjQ2MTQsImV4cCI6MjA2MTE0MDYxNH0.xZKZFRFdmKB97sI6t7ygmwg3N1P-RUMUtsydLnopVwY'



// const supabaseUrl = 'YOUR_SUPABASE_URL' // Replace with your actual Supabase URL
// const supabaseKey = 'YOUR_SUPABASE_KEY' // Replace with your actual Supabase anon/public key
const supabase = createClient(supabaseUrl, supabaseKey)

export default boot(({ app }) => {
  // Make supabase available in all components
  app.config.globalProperties.$supabase = supabase
})

export { supabase }