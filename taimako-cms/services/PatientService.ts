// services/patientService.ts
import { supabase } from '@/lib/supabaseClient'
import { toast } from 'react-toastify'
import { PatientFormData } from '@/validation/PatientValidation'
import { cachePatients, readCachedPatients, processQueue, OfflineOp, enqueueOp } from '@/lib/offlineSync'

export interface Patient extends PatientFormData {
  id?: string
  name: string
  age: string
  gender: 'Male' | 'Female' | 'Other'
  phone: string
  dob: string
  address?: string
}

// Type guard to validate objects
function isPatient(obj: any): obj is Patient {
  return (
    obj &&
    typeof obj.name === 'string' &&
    typeof obj.age === 'string' &&
    ['Male', 'Female', 'Other'].includes(obj.gender) &&
    typeof obj.phone === 'string' &&
    typeof obj.dob === 'string'
  )
}

export class PatientService {
  private patients: Patient[] = []
  private fallback = false

  constructor(private onUpdate: (patients: Patient[], fallback: boolean) => void) {}

  /** Load patients: Supabase -> Cache -> Sample JSON */
  async loadPatients() {
    try {
      if (!supabase) throw new Error('Supabase unavailable')
      const { data, error } = await supabase
        .from<'patients', Patient>('patients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      this.patients = data ?? []

      this.fallback = false
      cachePatients(this.patients)
    } catch (err) {
      console.warn('Using fallback cache/sample data', err)

      // 1️⃣ Try cache
      const cache = readCachedPatients() as Patient[] | null
      if (cache?.length) {
        this.patients = cache
      } else {
        // 2️⃣ Try static sample JSON
        try {
          const module = await import('@/sample-data/patients.json')
          const raw: any[] = module.default
          this.patients = raw
            .filter(isPatient)
            .map((p) => ({ ...p, gender: p.gender as 'Male' | 'Female' | 'Other' }))
        } catch (e) {
          console.error('Failed to load sample data', e)
          this.patients = []
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
      .channel('patients-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        (payload) => {
          const record = payload.new || payload.old
          if (!isPatient(record)) return

          switch (payload.eventType) {
            case 'INSERT':
              if (!this.patients.some((p) => p.id === record.id)) this.patients.unshift(record)
              break
            case 'UPDATE':
              this.patients = this.patients.map((p) => (p.id === record.id ? record : p))
              break
            case 'DELETE':
              this.patients = this.patients.filter((p) => p.id !== record.id)
              break
          }

          this.notifyUpdate()
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }

  /** Add or update patient */
  async savePatient(data: Patient) {
    try {
      const isOffline = !supabase || !navigator.onLine
      const isUpdate = !!data.id

      if (isOffline) {
        if (!data.id) data.id = `tmp-${Date.now()}`
        this.patients = isUpdate
          ? this.patients.map((p) => (p.id === data.id ? data : p))
          : [data, ...this.patients]

        this.queueOp(isUpdate ? 'update' : 'insert', data)
        cachePatients(this.patients)
        this.notifyUpdate()
        toast.info('Saved locally (offline).')
        return
      }

      if (isUpdate) {
        const { error } = await supabase.from('patients').update(data).eq('id', data.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('patients').insert([data])
        if (error) throw error
      }

      await this.loadPatients()
      toast.success('Patient saved.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to save patient.')
    }
  }

  /** Delete patient */
  async deletePatient(id?: string) {
    if (!id) return
    try {
      const isOffline = !supabase || !navigator.onLine

      if (isOffline) {
        this.patients = this.patients.filter((p) => p.id !== id)
        this.queueOp('delete', { id })
        cachePatients(this.patients)
        this.notifyUpdate()
        toast.info('Delete queued (offline).')
        return
      }

      const { error } = await supabase.from('patients').delete().eq('id', id)
      if (error) throw error

      await this.loadPatients()
      toast.success('Patient deleted.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to delete patient.')
    }
  }

  /** Export CSV */
  exportCSV(filtered: Patient[]) {
    const csv =
      'Name,Gender,Age,Phone,DOB,Address\n' +
      filtered.map((p) => `${p.name},${p.gender},${p.age},${p.phone},${p.dob},"${p.address ?? ''}"`).join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'patients.csv'
    a.click()
    toast.success('Exported CSV.')
  }

  /** Print single */
  printPatient(p: Patient) {
    const win = window.open('', '', 'width=700,height=500')
    if (!win) return
    win.document.write(`<html><body><pre>${JSON.stringify(p, null, 2)}</pre></body></html>`)
    win.document.close()
    win.print()
  }

  /** Print all */
  printAll(filtered: Patient[]) {
    const win = window.open('', '', 'width=900,height=700')
    if (!win) return
    win.document.write(`<html><body><pre>${JSON.stringify(filtered, null, 2)}</pre></body></html>`)
    win.document.close()
    win.print()
  }

  /** Sync offline queue */
  async syncQueue() {
    const res = await processQueue()
    if (res.successCount > 0) await this.loadPatients()
  }

  /** Queue offline operation */
  private queueOp(op: OfflineOp['op'], data: any) {
    const record = op === 'delete' ? { op, id: data.id } : { op, record: data }
    enqueueOp(record)
  }

  /** Notify table/component */
  private notifyUpdate() {
    this.onUpdate(this.patients, this.fallback)
  }
}
