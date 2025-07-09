import { supabase } from "./supabase"
import type { DashboardData, DashboardUser, DashboardEvent } from "../types/database"

export class DatabaseService {
  // Obtener todos los eventos con información completa
  static async getEventos(): Promise<DashboardEvent[]> {
    console.log("🔍 Fetching eventos...")

    const { data, error } = await supabase
      .from("events_table")
      .select(`
        id,
        date,
        companies_table!inner(name),
        cities_table!inner(name)
      `)
      .order("date", { ascending: false })

    if (error) {
      console.error("❌ Error fetching eventos:", error)
      return []
    }

    console.log("✅ Eventos data:", data)

    return (
      data?.map((evento: any) => ({
        id: evento.id,
        nombre: `${evento.companies_table.name} - ${evento.cities_table.name}`,
        ciudad: evento.cities_table.name,
        empresa: evento.companies_table.name,
        fecha: evento.date,
        simuladoresActivos: 0,
      })) || []
    )
  }

  // Obtener usuarios por evento con toda la información necesaria
  static async getUsuariosPorEvento(eventoId?: string): Promise<DashboardUser[]> {
    console.log("🔍 Fetching usuarios for evento:", eventoId)

    let query = supabase.from("event_attendees").select(`
        event_id,
        user_id,
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
      console.error("❌ Error fetching usuarios:", error)
      return []
    }

    console.log("✅ Usuarios raw data:", data)

    const usuarios =
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

    console.log("✅ Usuarios processed:", usuarios)
    return usuarios
  }

  // Obtener simuladores más usados por evento
  static async getSimuladoresPorEvento(eventoId?: string): Promise<Array<{ nombre: string; usos: number }>> {
    console.log("🔍 Fetching simuladores for evento:", eventoId)

    let query = supabase.from("event_packages").select(`
        event_id,
        package_id,
        package_table!inner(
          id,
          simulator_table!inner(name, version)
        )
      `)

    if (eventoId && eventoId !== "todos") {
      query = query.eq("event_id", Number.parseInt(eventoId))
    }

    const { data, error } = await query

    if (error) {
      console.error("❌ Error fetching simuladores:", error)
      return []
    }

    console.log("✅ Simuladores raw data:", data)

    // Contar usos por simulador
    const simuladorCount: Record<string, number> = {}

    data?.forEach((item: any) => {
      const simulatorName = `${item.package_table.simulator_table.name} ${item.package_table.simulator_table.version}`
      simuladorCount[simulatorName] = (simuladorCount[simulatorName] || 0) + 1
    })

    const result = Object.entries(simuladorCount)
      .map(([nombre, usos]) => ({ nombre, usos }))
      .sort((a, b) => b.usos - a.usos)
      .slice(0, 8)

    console.log("✅ Simuladores processed:", result)
    return result
  }

  // Obtener número de simuladores activos por evento
  static async getSimuladoresActivosPorEvento(eventoId?: string): Promise<number> {
    console.log("🔍 Fetching simuladores activos for evento:", eventoId)

    let query = supabase.from("event_packages").select("package_id", { count: "exact" })

    if (eventoId && eventoId !== "todos") {
      query = query.eq("event_id", Number.parseInt(eventoId))
    }

    const { count, error } = await query

    if (error) {
      console.error("❌ Error fetching simuladores activos:", error)
      return 0
    }

    console.log("✅ Simuladores activos count:", count)
    return count || 0
  }

  // Obtener datos completos del dashboard
  static async getDashboardData(eventoId?: string): Promise<DashboardData> {
    console.log("🚀 Starting getDashboardData for evento:", eventoId)

    try {
      // Obtener datos en paralelo
      const [usuarios, eventos, simuladores] = await Promise.all([
        this.getUsuariosPorEvento(eventoId),
        this.getEventos(),
        this.getSimuladoresPorEvento(eventoId),
      ])

      console.log(
        "📊 Data fetched - Usuarios:",
        usuarios.length,
        "Eventos:",
        eventos.length,
        "Simuladores:",
        simuladores.length,
      )

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

      console.log("📈 Resumen calculado:", resumen)

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

      console.log("👥 Distribución por género:", genero)

      // Distribución por edades
      const edades = this.calcularDistribucionEdades(usuarios)
      console.log("🎂 Distribución por edades:", edades)

      const result = {
        resumen,
        genero,
        edades,
        simuladores,
        usuarios,
      }

      console.log("✅ Final dashboard data:", result)
      return result
    } catch (error) {
      console.error("💥 Error getting dashboard data:", error)
      return {
        resumen: { totalUsuarios: 0, totalEventos: 0, simuladoresActivos: 0 },
        genero: [],
        edades: [],
        simuladores: [],
        usuarios: [],
      }
    }
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

  // Método para probar la conexión básica
  static async testConnection() {
    console.log("🔧 Testing basic connection...")

    try {
      // Test 1: Verificar tablas básicas
      const { data: genders, error: genderError } = await supabase.from("gender_table").select("*").limit(5)
      console.log("Gender table test:", { data: genders, error: genderError })

      const { data: companies, error: companyError } = await supabase.from("companies_table").select("*").limit(5)
      console.log("Companies table test:", { data: companies, error: companyError })

      const { data: events, error: eventsError } = await supabase.from("events_table").select("*").limit(5)
      console.log("Events table test:", { data: events, error: eventsError })

      const { data: users, error: usersError } = await supabase.from("users_table").select("*").limit(5)
      console.log("Users table test:", { data: users, error: usersError })

      const { data: attendees, error: attendeesError } = await supabase.from("event_attendees").select("*").limit(5)
      console.log("Event attendees test:", { data: attendees, error: attendeesError })
    } catch (error) {
      console.error("💥 Connection test failed:", error)
    }
  }
}
