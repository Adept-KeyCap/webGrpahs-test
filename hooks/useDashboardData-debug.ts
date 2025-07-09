"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "../lib/database-service-debug"
import type { DashboardData, DashboardEvent } from "../types/database"

export function useDashboardData(eventoId: string) {
  const [data, setData] = useState<DashboardData>({
    resumen: { totalUsuarios: 0, totalEventos: 0, simuladoresActivos: 0 },
    genero: [],
    edades: [],
    simuladores: [],
    usuarios: [],
  })
  const [eventos, setEventos] = useState<DashboardEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("🔄 Starting data fetch for evento:", eventoId)
        setLoading(true)
        setError(null)

        // Primero probar la conexión básica
        await DatabaseService.testConnection()

        const [dashboardData, eventosData] = await Promise.all([
          DatabaseService.getDashboardData(eventoId),
          DatabaseService.getEventos(),
        ])

        console.log("📦 Setting data:", { dashboardData, eventosData })
        setData(dashboardData)
        setEventos(eventosData)
      } catch (err) {
        console.error("💥 Error fetching dashboard data:", err)
        setError(`Error al cargar los datos del dashboard: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventoId])

  return { data, eventos, loading, error }
}
