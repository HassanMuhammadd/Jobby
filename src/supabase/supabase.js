import { createClient } from '@supabase/supabase-js'
export const supabaseUrl = 'https://pyhlpnrbzygiktviklou.supabase.co'
export const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5aGxwbnJienlnaWt0dmlrbG91Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwMjMzNjczMCwiZXhwIjoyMDE3OTEyNzMwfQ.yOUfHCIunCd_jsu5mRnjtR9uVdGacYoElo1XBNa_VEY"
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase