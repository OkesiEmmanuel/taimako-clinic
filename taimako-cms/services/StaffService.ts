import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-toastify'
import { enqueueOp, cacheStaff, readCachedStaff, processQueue, OfflineOp } from '@/lib/offlineSync'

export interface Staff {
  id?: string
  name: string
  email: string
  phone: string
  role: 'doctor' | 'nurse' | 'admin' | 'reception'
  department: string
  address?: string
  age?: string
  gender?: 'Male' | 'Female' | 'Other'
}

function isStaff(obj: any): obj is Staff {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.phone === 'string' &&
    ['doctor', 'nurse', 'admin', 'reception'].includes(obj.role) &&
    typeof obj.department === 'string'
  )
}

export class StaffService {
  private staffList: Staff[] = []
  private fallback = false

  constructor(private onUpdate: (staffList: Staff[], fallback?: boolean) => void) {}

  // async loadStaff() {
  //   try {
  //     const { data, error } = await supabase
  //       .from<'staff', Staff>('staff')
  //       .select('*')
  //       .order('created_at', { ascending: false })

  //     if (error) throw error
  //     this.staffList = data ?? []
  //     this.fallback = false
  //     cacheStaff(this.staffList)
  //   } catch {
  //     const cache = readCachedStaff() as Staff[] | null
  //     if (cache?.length) this.staffList = cache
  //       else {
  //     }
  //     this.fallback = true
  //     toast.info('Offline/fallback staff loaded.')
  //   } finally {
  //     this.notifyUpdate()
  //   }
  // }

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

  /** Save staff with optional password */
  async saveStaff(data: Staff, password?: string) {
    try {
      const isUpdate = !!data.id

      if (isUpdate) {
        // Update existing staff (no auth creation)
        const { error } = await supabase.from('staff').update(data).eq('id', data.id)
        if (error) throw error
      } else {
        // Create new staff in Supabase Auth first
        if (!password) throw new Error('Password is required for new staff')
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password,
          email_confirm: true, // optional, marks email as confirmed
          user_metadata: {
            fullName: data.name,
            role: data.role,
            department: data.department,
          },
        })
        if (authError) throw authError

        // Then save staff in your staff table
        const { error: staffError } = await supabase.from('staff').insert([data])
        if (staffError) throw staffError
      }

      toast.success(`Staff ${isUpdate ? 'updated' : 'added'} successfully!`)
      await this.loadStaff() // reload staff list
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || 'Failed to save staff')
    }
  }

  /** Load staff */
  async loadStaff() {
    const { data, error } = await supabase.from('staff').select('*').order('created_at', { ascending: false })
    if (error) {
      console.error(error)
      this.staffList = []
    } else {
      this.staffList = data ?? []
    }
    this.onUpdate(this.staffList)
  }

  /** Update staff profile */
  async updateStaff(staff: Staff) {
    if (!staff.id) return
    try {
      const isOffline = !supabase || !navigator.onLine
      if (isOffline) {
        this.staffList = this.staffList.map((s) => (s.id === staff.id ? staff : s))
        this.queueOp('update', staff)
        cacheStaff(this.staffList)
        this.notifyUpdate()
        toast.info('Staff update queued (offline).')
        return
      }

      const { error } = await supabase.from('staff').update(staff).eq('id', staff.id)
      if (error) throw error

      await this.loadStaff()
      toast.success('Staff updated.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to update staff.')
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

  private queueOp(op: OfflineOp['op'], data: any) {
    const record = op === 'delete' ? { op, id: data.id } : { op, record: data }
    enqueueOp(record)
  }

  private notifyUpdate() {
    this.onUpdate(this.staffList, this.fallback)
  }
}
