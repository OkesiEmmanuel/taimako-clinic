// utils/offlineSync.ts
import { supabase} from '@/lib/supabaseClient'
import { toast } from 'react-toastify'

const QUEUE_KEY = 'clinic_offline_queue_v1'
const CACHE_KEY = 'clinic_patients_cache'

export type OfflineOp =
  | { op: 'insert'; record: any }
  | { op: 'update'; record: any }
  | { op: 'delete'; id: string }

function readQueue(): OfflineOp[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? (JSON.parse(raw) as OfflineOp[]) : []
  } catch {
    return []
  }
}

function writeQueue(queue: OfflineOp[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function enqueueOp(op: OfflineOp) {
  const q = readQueue()
  q.push(op)
  writeQueue(q)
  // show small toast (non-intrusive)
  toast.info(`Queued ${op.op} operation (offline).`, { autoClose: 1200 })
}

export function clearQueue() {
  writeQueue([])
}

// helper to persist patients cache locally
export function cachePatients(list: any[]) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(list))
}

export function readCachedPatients(): any[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

/**
 * processQueue: attempt to flush queued operations to Supabase
 * - will try sequentially; on recoverable error it stops and leaves remaining ops
 * - simple conflict strategy: for updates use last-write-wins (we push whatever client has)
 */
export async function processQueue(): Promise<{
  successCount: number
  remaining: number
}> {
  if (!supabase) return { successCount: 0, remaining: readQueue().length }

  const queue = readQueue()
  if (!queue.length) return { successCount: 0, remaining: 0 }

  let successCount = 0
  const remaining: OfflineOp[] = []

  for (const item of queue) {
    try {
      if (item.op === 'insert') {
        // Remove any temporary id before inserting
        const rec = { ...item.record }
        if (rec.id && String(rec.id).startsWith('tmp-')) delete rec.id
        const { error } = await supabase.from('patients').insert([rec])
        if (error) throw error
        successCount++
      } else if (item.op === 'update') {
        if (!item.record?.id) throw new Error('Missing id for update')
        const { error } = await supabase.from('patients').update(item.record).eq('id', item.record.id)
        if (error) throw error
        successCount++
      } else if (item.op === 'delete') {
        const { error } = await supabase.from('patients').delete().eq('id', item.id)
        if (error) throw error
        successCount++
      }
    } catch (err) {
      // keep the item in remaining queue
      remaining.push(item)
      console.error('Failed to sync queue item', item, err)
      // stop processing to avoid rapid repeated failures (network/backoff)
      break
    }
  }

  // write remaining back
  writeQueue(remaining)
  if (successCount > 0) {
    toast.success(`Synced ${successCount} operation(s) to server.`)
  }
  return { successCount, remaining: remaining.length }
}
