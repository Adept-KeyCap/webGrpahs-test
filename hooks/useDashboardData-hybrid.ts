"use client"

import { useState, useEffect } from "react"
import { DatabaseService } from "../lib/database-service"
import type { DashboardData, DashboardEvent } from "../types/database"

// Datos de fallback para cuando no hay conexión
const datosFallback: DashboardData = {
  resumen: { totalUsuarios: 1247, totalEventos: 24, simuladoresActivos: 18 },
  genero: [
    { genero: "Male", cantidad: 687 },
    { genero: "Female", cantidad: 432 },
    { genero: "Other", cantidad: 89 },
    { genero: "No especifica", cantidad: 39 },
  ],
  edades: [
    { rango: "16-25", cantidad: 298 },
    { rango: "26-35", cantidad: 456 },
    { rango: "36-45", cantidad: 312 },
    { rango: "46-55", cantidad: 134 },
    { rango: "56+", cantidad: 47 },
  ],
  simuladores: [
    { nombre: "VR Racing Pro", usos: 567 },
    { nombre: "Space Explorer", usos: 445 },
    { nombre: "Innovation Lab VR", usos: 398 },
    { nombre: "City Builder VR", usos: 334 },
    { nombre: "Design Studio", usos: 289 },
    { nombre: "Adventure Quest", usos: 234 },
    { nombre: "Medical Training", usos: 198 },
    { nombre: "Tech Demo", usos: 156 },
  ],
  usuarios: [
    {
      id: 1,
      email: "juan.perez@techcorp.com",
      empresa: "TechCorp",
      ciudad: "Bogotá",
      tipoDocumento: "Cédula",
      genero: "Male",
      edad: 30,
      evento_id: 1,
    },
    {
      id: 2,
      email: "maria.rodriguez@innovatex.com",
      empresa: "InnovateX",
      ciudad: "Medellín",
      tipoDocumento: "Cédula",
      genero: "Female",
      edad: 28,
      evento_id: 2,
    },
    {
      id: 3,
      email: "carlos.martinez@futuretech.com",
      empresa: "FutureTech",
      ciudad: "Cali",
      tipoDocumento: "Pasaporte",
      genero: "Male",
      edad: 35,
      evento_id: 3,
    },
    {
      id: 4,
      email: "ana.garcia@vrsolutions.com",
      empresa: "VRSolutions",
      ciudad: "Barranquilla",
      tipoDocumento: "Cédula",
      genero: "Female",
      edad: 32,
      evento_id: 4,
    },
    {
      id: 5,
      email: "luis.hernandez@techcorp.com",
      empresa: "TechCorp",
      ciudad: "Bogotá",
      tipoDocumento: "Tarjeta de Identidad",
      genero: "Male",
      edad: 27,
      evento_id: 1,
    },
  ],
}

const eventosFallback: DashboardEvent[] = [
  {
    id: 1,
    nombre: "Tech Summit 2024 - Bogotá",
    ciudad: "Bogotá",
    empresa: "TechCorp",
    fecha: "2024-01-15",
    simuladoresActivos: 6,
  },
  {
    id: 2,
    nombre: "Innovation Day - Medellín",
    ciudad: "Medellín",
    empresa: "InnovateX",
    fecha: "2024-01-20",
    simuladoresActivos: 5,
  },
  {
    id: 3,
    nombre: "Digital Future - Cali",
    ciudad: "Cali",
    empresa: "FutureTech",
    fecha: "2024-01-25",
    simuladoresActivos: 7,
  },
  {
    id: 4,
    nombre: "VR Experience - Barranquilla",
    ciudad: "Barranquilla",
    empresa: "VRSolutions",
    fecha: "2024-01-30",
    simuladoresActivos: 4,
  },
]

export function useDashboardDataHybrid(eventoId: string) {
  const [data, setData] = useState<DashboardData>(datosFallback)
  const [eventos, setEventos] = useState<DashboardEvent[]>(eventosFallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)
        setUsingFallback(false)

        // Verificar si Supabase está disponible
        if (!DatabaseService.isAvailable()) {
          console.warn("⚠️ Supabase not configured, using fallback data")
          setData(datosFallback)
          setEventos(eventosFallback)
          setUsingFallback(true)
          setError(
            "Database connection not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
          )
          return
        }

        // Intentar obtener datos reales
        const [dashboardData, eventosData] = await Promise.all([
          DatabaseService.getDashboardData(eventoId),
          DatabaseService.getEventos(),
        ])

        // Verificar si los datos son válidos
        if (dashboardData.usuarios.length > 0 || eventosData.length > 0) {
          setData(dashboardData)
          setEventos(eventosData)
          console.log("✅ Using real data from Supabase")
        } else {
          throw new Error("No data found in database")
        }
      } catch (err) {
        console.warn("⚠️ Error with real data, using fallback:", err)
        setData(datosFallback)
        setEventos(eventosFallback)
        setUsingFallback(true)
        setError(`Database error: ${err instanceof Error ? err.message : "Unknown error"}`)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventoId])

  return { data, eventos, loading, error, usingFallback }
}
