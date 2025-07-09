"use client"

import { useEffect, useState } from "react"
import VRDashboardFrostedGlass from "../dashboard-frosted-glass"

export default function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/30">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          <span className="text-xl font-medium text-white">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return <VRDashboardFrostedGlass />
}
