'use client'

import { processQueue } from '@/lib/offlineSync'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface OfflineStatusProps {
  className?: string
}

export default function OfflineStatus({ className = '' }: OfflineStatusProps) {
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [pending, setPending] = useState<number>(0)

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
    const initStatus = () => {
      setIsOnline(navigator.onLine)
      updatePending()
    }

    // Initialize status after hydration
    initStatus()

    const handleOnline = () => {
      setIsOnline(true)
      toast.info('Back online! You can sync pending changes.')
      updatePending()
    }

    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    const interval = setInterval(updatePending, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  const handleSync = async () => {
    const res = await processQueue()
    if (res.successCount > 0) {
      toast.success(`Synced ${res.successCount} operation(s) successfully!`)
    } else {
      toast.info('No operations to sync.')
    }
    updatePending()
  }

  // ✅ Avoid hydration mismatch by showing a static placeholder before hydration
  if (isOnline === null) {
    return (
      <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
        <span className="px-3 py-1 rounded font-medium bg-gray-100 text-gray-600">
          Checking connection...
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 text-sm ${className}`}>
      <span
        className={`px-3 py-1 rounded font-medium ${
          isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'
        }`}
      >
        {isOnline ? 'Online' : 'Offline'}
      </span>

      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded font-medium">
        Pending: {pending}
      </span>

      {isOnline && (
        <button
          onClick={handleSync}
          disabled={pending === 0}
          className={`px-3 py-1 rounded font-medium transition ${
            pending > 0
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Sync Now
        </button>
      )}
    </div>
  )
}
