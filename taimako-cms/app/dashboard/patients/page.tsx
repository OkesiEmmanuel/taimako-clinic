'use client'

import OfflineStatus from '@/components/ui/OfflineStatus'
import { Patient, PatientService } from '@/services'
import { useEffect, useState } from 'react'
import PatientTable from './components/PatientsTable'
import PatientForm from './components/PatientForm'


export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selected, setSelected] = useState<Patient | null>(null)
  const [search, setSearch] = useState('')
  const [filterGender, setFilterGender] = useState('All')
  const [service, setService] = useState<PatientService | null>(null)

  useEffect(() => {
    const srv = new PatientService((updated:any) => setPatients(updated))
    setService(srv)
    srv.loadPatients()
    const unsub = srv.subscribeRealtime()
    const interval = setInterval(() => srv.syncQueue(), 60_000)
    window.addEventListener('online', () => srv.syncQueue())
    return () => {
      unsub?.()
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-700">Clinic Patients</h1>
        <OfflineStatus />
      </div>

      {/* Search and filter */}
      <div className="flex gap-2 items-center">
        <input
          className="border border-gray-700 text-gray-700 bg-white rounded px-3 py-1"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterGender}
          onChange={(e) => setFilterGender(e.target.value)}
          className="border  text-gray-700 bg-white rounded px-3 py-1"
        >
          <option value="All">All genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Patient Form */}
      {service && (
        <PatientForm
          selected={selected ?? undefined}
          onSubmit={(data: any) => service.savePatient(data)}
        />
      )}

     
      {/* Patient Table */}
      {service && (
        <PatientTable
          patients={patients}
          service={service}
          onEdit={(p) => setSelected(p)}
          defaultRowsPerPage={10} // optional, default is 10
        />
      )}
    </div>
  )
}
