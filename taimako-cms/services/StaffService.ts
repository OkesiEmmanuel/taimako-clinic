import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-toastify'
import { enqueueOp, cacheStaff, readCachedStaff, processQueue, OfflineOp } from '@/lib/offlineSync'

export interface Staff {
  id?: string
  name: string
  email: string
  phone: string
  role: 'Doctor' | 'Nurse' | 'Admin' | 'Other'
  department: string
  address?: string
  age?: string
  gender?: 'Male' | 'Female' | 'Other'
}

/** Type guard to ensure object is Staff */
function isStaff(obj: any): obj is Staff {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.phone === 'string' &&
    ['Doctor', 'Nurse', 'Admin', 'Other'].includes(obj.role) &&
    typeof obj.department === 'string'
  )
}

export class StaffService {
  private staffList: Staff[] = []
  private fallback = false

  constructor(private onUpdate: (staffList: Staff[], fallback?: boolean) => void) {}

  /** Load staff from server or fallback cache */
  /** Load patients: Supabase -> Cache -> Sample JSON */
   async loadStaff() {
     try {
       if (!supabase) throw new Error('Supabase unavailable')
       const { data, error } = await supabase
         .from<'staff', Staff>('staff')
         .select('*')
         .order('created_at', { ascending: false })
 
       if (error) throw error
       this.staffList = data ?? []
 
       this.fallback = false
       cacheStaff(this.staffList)
     } catch (err) {
       console.warn('Using fallback cache/sample data', err)
 
       // 1️⃣ Try cache
       const cache = readCachedStaff() as Staff[] | null
       if (cache?.length) {
         this.staffList = cache
       } else {
         // 2️⃣ Try static sample JSON
         try {
           const module = await import('@/sample-data/staff.json')
           const raw: any[] = module.default
           this.staffList = raw
             .filter(isStaff)
             .map((p) => ({ ...p, gender: p.gender as 'Male' | 'Female' | 'Other' }))
         } catch (e) {
           console.error('Failed to load sample data', e)
           this.staffList = []
         }
       }
 
       this.fallback = true
       toast.info('Offline/fallback data loaded.')
     } finally {
       this.notifyUpdate()
     }
   }
 

  /** Subscribe to real-time updates */
  subscribeRealtime() {
    if (!supabase || this.fallback) return

    const channel = supabase
      .channel('staff-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'staff' }, (payload) => {
        const record = payload.new || payload.old
        if (!isStaff(record)) return

        switch (payload.eventType) {
          case 'INSERT':
            if (!this.staffList.some((s) => s.id === record.id)) this.staffList.unshift(record)
            break
          case 'UPDATE':
            this.staffList = this.staffList.map((s) => (s.id === record.id ? record : s))
            break
          case 'DELETE':
            this.staffList = this.staffList.filter((s) => s.id !== record.id)
            break
        }
        this.notifyUpdate()
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  /** Add or update staff */
  async saveStaff(data: Staff) {
    try {
      const isOffline = !supabase || !navigator.onLine
      const isUpdate = !!data.id

      if (isOffline) {
        if (!data.id) data.id = `tmp-${Date.now()}`
        this.staffList = isUpdate
          ? this.staffList.map((s) => (s.id === data.id ? data : s))
          : [data, ...this.staffList]

        this.queueOp(isUpdate ? 'update' : 'insert', data)
        cacheStaff(this.staffList)
        this.notifyUpdate()
        toast.info('Saved locally (offline).')
        return
      }

      if (isUpdate) {
        const { error } = await supabase.from('staff').update(data).eq('id', data.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('staff').insert([data])
        if (error) throw error
      }

      await this.loadStaff()
      toast.success('Staff saved.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save staff.')
    }
  }

  /** Delete staff */
  async deleteStaff(id?: string) {
    if (!id) return
    try {
      const isOffline = !supabase || !navigator.onLine

      if (isOffline) {
        this.staffList = this.staffList.filter((s) => s.id !== id)
        this.queueOp('delete', { id })
        cacheStaff(this.staffList)
        this.notifyUpdate()
        toast.info('Delete queued (offline).')
        return
      }

      const { error } = await supabase.from('staff').delete().eq('id', id)
      if (error) throw error

      await this.loadStaff()
      toast.success('Staff deleted.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete staff.')
    }
  }

  /** Sync offline queue */
  async syncQueue() {
    const res = await processQueue()
    if (res.successCount > 0) await this.loadStaff()
  }

  /** Add operation to offline queue */
  private queueOp(op: OfflineOp['op'], data: any) {
    const record = op === 'delete' ? { op, id: data.id } : { op, record: data }
    enqueueOp(record)
  }

  /** Notify page of updated staff list */
  private notifyUpdate() {
    this.onUpdate(this.staffList, this.fallback)
  }

  /** Export staff as CSV */
  exportCSV(filtered?: Staff[]) {
    const dataToExport = filtered ?? this.staffList
    const csv =
      'Name,Email,Phone,Role,Department,Address,Age,Gender\n' +
      dataToExport
        .map(
          (s) =>
            `${s.name},${s.email},${s.phone},${s.role},${s.department},"${s.address || ''}",${
              s.age || ''
            },${s.gender || ''}`
        )
        .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'staff.csv'
    a.click()
    toast.success('Exported CSV.')
  }

  /** Print all staff */
  printAll(filtered?: Staff[]) {
    const dataToPrint = filtered ?? this.staffList
    const html =
      '<pre>' + JSON.stringify(dataToPrint, null, 2) + '</pre>'

    const win = window.open('', '', 'width=900,height=700')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.print()
  }

   /** Print single */
    printStaff(p: Staff) {
      const win = window.open('', '', 'width=700,height=500')
      if (!win) return
      win.document.write(`<html><body><pre>${JSON.stringify(p, null, 2)}</pre></body></html>`)
      win.document.close()
      win.print()
    }
}
