// src/components/OfflineIndicator.jsx
import React, { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) {
    return null // Don't show when online
  }

  return (
    <div className="fixed bottom-4 left-4 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg z-40 flex items-center gap-2">
      <div className="animate-pulse">⚠️</div>
      <span className="font-semibold">You're offline - Using cached data</span>
    </div>
  )
}
