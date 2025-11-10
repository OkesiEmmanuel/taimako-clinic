'use client'

import { processQueue } from '@/lib/offlineSync'
import { useEffect, useState } from 'react'

import { toast } from 'react-toastify'

interface OfflineStatusProps {
  className?: string
}

export default function OfflineStatus({ className = '' }: OfflineStatusProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [pending, setPending] = useState(0)

  const updatePending = () => {
    try {
      const raw = localStorage.getItem('clinic_offline_queue_v1')
      const q = raw ? JSON.parse(raw) : []
      setPending(q.length)
    } catch {
      setPending(0)
    }
  }

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.info('Back online! You can sync pending changes.')
      updatePending()
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    updatePending()

    const interval = setInterval(updatePending, 5000) // update every 5s

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  const handleSync = async () => {
    const res = await processQueue()
    if (res.successCount > 0) toast.success(`Synced ${res.successCount} operation(s) successfully!`)
    updatePending()
  }

  return (
    <div className={`flex items-center gap-2 text-sm ${className}`}>
      <span
        className={`px-2 py-1 rounded ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
        }`}
      >
        {isOnline ? 'Online' : 'Offline'}
      </span>
      {pending > 0 && (
        <>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{pending} pending</span>
          {isOnline && (
            <button
              onClick={handleSync}
              className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
            >
              Sync Now
            </button>
          )}
        </>
      )}
    </div>
  )
}
