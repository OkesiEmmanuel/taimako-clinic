
import { readFileSync } from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(url, key)

async function seed() {
  const users = JSON.parse(readFileSync(path.join(__dirname, '../sample-data/users.json'), 'utf-8'))
  const appts = JSON.parse(readFileSync(path.join(__dirname, '../sample-data/appointments.json'), 'utf-8'))

  console.log('Seeding users...')
  for (const u of users) {
    const { error } = await supabase.from('users').upsert(u)
    if (error) console.error(error)
  }

  console.log('Seeding appointments...')
  for (const a of appts) {
    const { error } = await supabase.from('appointments').upsert(a)
    if (error) console.error(error)
  }

  console.log('Done')
}

seed().catch(e => { console.error(e); process.exit(1) })
