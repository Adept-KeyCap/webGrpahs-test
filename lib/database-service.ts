import { supabase } from "./supabase"
import type { DashboardData, DashboardUser, DashboardEvent } from "../types/database"

export class DatabaseService {
  // Check if Supabase is available
  static isAvailable(): boolean {
    return supabase !== null
  }

  // Obtener todos los eventos con información completa
  static async getEventos(): Promise<DashboardEvent[]> {
    if (!this.isAvailable()) {
      console.warn("Supabase not available, returning empty array")
      return []
    }

    const { data, error } = await supabase!
      .from("events_table")
      .select(`
        id,
        date,
        companies_table!inner(name),
        cities_table!inner(name)
      `)
      .order("date", { ascending: false })

    if (error) {
      console.error("Error fetching eventos:", error)
      return []
    }

    return (
      data?.map((evento: any) => ({
        id: evento.id,
        nombre: `${evento.companies_table.name} - ${evento.cities_table.name}`,
        ciudad: evento.cities_table.name,
        empresa: evento.companies_table.name,
        fecha: evento.date,
        simuladoresActivos: 0, // Se calculará después
      })) || []
    )
  }

  // Obtener usuarios por evento con toda la información necesaria
  static async getUsuariosPorEvento(eventoId?: string): Promise<DashboardUser[]> {
    if (!this.isAvailable()) {
      console.warn("Supabase not available, returning empty array")
      return []
    }

    let query = supabase!.from("event_attendees").select(`
        users_table!inner(
          id,
          email,
          birthdate,
          doc_number,
          gender_table!inner(name),
          doc_type_table!inner(type_name),
          companies_table!inner(name)
        ),
        events_table!inner(
          id,
          cities_table!inner(name)
        )
      `)

    if (eventoId && eventoId !== "todos") {
      query = query.eq("event_id", Number.parseInt(eventoId))
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching usuarios:", error)
      return []
    }

    return (
      data?.map((item: any) => {
        const user = item.users_table
        const event = item.events_table
        const birthDate = new Date(user.birthdate)
        const today = new Date()
        const edad = today.getFullYear() - birthDate.getFullYear()

        return {
          id: user.id,
          email: user.email,
          empresa: user.companies_table.name,
          ciudad: event.cities_table.name,
          tipoDocumento: user.doc_type_table.type_name,
          genero: user.gender_table.name,
          edad: edad,
          evento_id: event.id,
        }
      }) || []
    )
  }

  // Obtener simuladores más usados por evento
  static async getSimuladoresPorEvento(eventoId?: string): Promise<Array<{ nombre: string; usos: number }>> {
    if (!this.isAvailable()) {
      console.warn("Supabase not available, returning empty array")
      return []
    }

    let query = supabase!.from("event_packages").select(`
        package_table!inner(
          simulator_table!inner(name, version)
        ),
        event_id
      `)

    if (eventoId && eventoId !== "todos") {
      query = query.eq("event_id", Number.parseInt(eventoId))
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching simuladores:", error)
      return []
    }

    // Contar usos por simulador
    const simuladorCount: Record<string, number> = {}

    data?.forEach((item: any) => {
      const simulatorName = `${item.package_table.simulator_table.name} ${item.package_table.simulator_table.version}`
      simuladorCount[simulatorName] = (simuladorCount[simulatorName] || 0) + 1
    })

    return Object.entries(simuladorCount)
      .map(([nombre, usos]) => ({ nombre, usos }))
      .sort((a, b) => b.usos - a.usos)
      .slice(0, 8)
  }

  // Obtener datos completos del dashboard
  static async getDashboardData(eventoId?: string): Promise<DashboardData> {
    if (!this.isAvailable()) {
      console.warn("Supabase not available, returning empty data")
      return {
        resumen: { totalUsuarios: 0, totalEventos: 0, simuladoresActivos: 0 },
        genero: [],
        edades: [],
        simuladores: [],
        usuarios: [],
      }
    }

    try {
      // Obtener datos en paralelo
      const [usuarios, eventos, simuladores] = await Promise.all([
        this.getUsuariosPorEvento(eventoId),
        this.getEventos(),
        this.getSimuladoresPorEvento(eventoId),
      ])

      // Filtrar eventos si es necesario
      const eventosActivos =
        eventoId && eventoId !== "todos" ? eventos.filter((e) => e.id.toString() === eventoId) : eventos

      // Calcular simuladores activos
      const simuladoresActivos = await this.getSimuladoresActivosPorEvento(eventoId)

      // Calcular estadísticas
      const resumen = {
        totalUsuarios: usuarios.length,
        totalEventos: eventosActivos.length,
        simuladoresActivos: simuladoresActivos,
      }

      // Distribución por género
      const generoStats = usuarios.reduce(
        (acc, usuario) => {
          acc[usuario.genero] = (acc[usuario.genero] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )

      const genero = Object.entries(generoStats).map(([genero, cantidad]) => ({
        genero,
        cantidad,
      }))

      // Distribución por edades
      const edades = this.calcularDistribucionEdades(usuarios)

      return {
        resumen,
        genero,
        edades,
        simuladores,
        usuarios,
      }
    } catch (error) {
      console.error("Error getting dashboard data:", error)
      return {
        resumen: { totalUsuarios: 0, totalEventos: 0, simuladoresActivos: 0 },
        genero: [],
        edades: [],
        simuladores: [],
        usuarios: [],
      }
    }
  }

  // Obtener número de simuladores activos por evento
  static async getSimuladoresActivosPorEvento(eventoId?: string): Promise<number> {
    if (!this.isAvailable()) {
      return 0
    }

    let query = supabase!.from("event_packages").select("package_id", { count: "exact" })

    if (eventoId && eventoId !== "todos") {
      query = query.eq("event_id", Number.parseInt(eventoId))
    }

    const { count, error } = await query

    if (error) {
      console.error("Error fetching simuladores activos:", error)
      return 0
    }

    return count || 0
  }

  // Calcular distribución de edades
  static calcularDistribucionEdades(usuarios: DashboardUser[]) {
    const rangos = {
      "16-25": 0,
      "26-35": 0,
      "36-45": 0,
      "46-55": 0,
      "56+": 0,
    }

    usuarios.forEach((usuario) => {
      if (usuario.edad) {
        if (usuario.edad >= 16 && usuario.edad <= 25) rangos["16-25"]++
        else if (usuario.edad >= 26 && usuario.edad <= 35) rangos["26-35"]++
        else if (usuario.edad >= 36 && usuario.edad <= 45) rangos["36-45"]++
        else if (usuario.edad >= 46 && usuario.edad <= 55) rangos["46-55"]++
        else if (usuario.edad >= 56) rangos["56+"]++
      }
    })

    return Object.entries(rangos).map(([rango, cantidad]) => ({
      rango,
      cantidad,
    }))
  }
}
