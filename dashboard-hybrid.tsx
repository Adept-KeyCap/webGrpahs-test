"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Calendar, Monitor, Filter, Loader2, AlertCircle } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Importar el servicio de base de datos
import { DatabaseService } from "./lib/database-service-debug"
import type { DashboardData, DashboardEvent } from "./types/database"

// Datos de fallback para cuando no hay conexión
const datosFallback: DashboardData = {
  resumen: { totalUsuarios: 107, totalEventos: 3, simuladoresActivos: 3 },
  genero: [
    { genero: "Male", cantidad: 43 },
    { genero: "Female", cantidad: 55 },
    { genero: "Other", cantidad: 9 },
  ],
  edades: [
    { rango: "16-25", cantidad: 17 },
    { rango: "26-35", cantidad: 28 },
    { rango: "36-45", cantidad: 42 },
    { rango: "46-55", cantidad: 20 },
    { rango: "56+", cantidad: 0 },
  ],
  simuladores: [
    { nombre: "Simulador VR 1.0", usos: 1 },
    { nombre: "Simulador VR 2.1", usos: 1 },
    { nombre: "Simulador VR 1.5", usos: 1 },
  ],
  usuarios: [
    {
      id: 1,
      email: "juan.perez@example.com",
      empresa: "Grupo Éxito",
      ciudad: "Bogotá",
      tipoDocumento: "Cédula de ciudadanía",
      genero: "Male",
      edad: 30,
      evento_id: 1,
    },
  ],
}

const eventosFallback: DashboardEvent[] = [
  {
    id: 1,
    nombre: "Grupo Éxito - Bogotá",
    ciudad: "Bogotá",
    empresa: "Grupo Éxito",
    fecha: "2024-01-15",
    simuladoresActivos: 1,
  },
  {
    id: 2,
    nombre: "Postobón S.A. - Medellín",
    ciudad: "Medellín",
    empresa: "Postobón S.A.",
    fecha: "2024-01-20",
    simuladoresActivos: 1,
  },
  { id: 3, nombre: "EPM - Cali", ciudad: "Cali", empresa: "EPM", fecha: "2024-01-25", simuladoresActivos: 1 },
]

// Hook personalizado para manejar datos con fallback
function useDashboardDataHybrid(eventoId: string) {
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

        // Intentar obtener datos reales
        const [dashboardData, eventosData] = await Promise.all([
          DatabaseService.getDashboardData(eventoId),
          DatabaseService.getEventos(),
        ])

        // Verificar si los datos son válidos
        if (dashboardData.usuarios.length > 0 || eventosData.length > 0) {
          setData(dashboardData)
          setEventos(eventosData)
          console.log("✅ Usando datos reales de Supabase")
        } else {
          throw new Error("No se encontraron datos en la base de datos")
        }
      } catch (err) {
        console.warn("⚠️ Error con datos reales, usando fallback:", err)
        setData(datosFallback)
        setEventos(eventosFallback)
        setUsingFallback(true)
        setError("Usando datos de demostración (sin conexión a base de datos)")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [eventoId])

  return { data, eventos, loading, error, usingFallback }
}

// Componente de gráfico mejorado
function ChartWrapper({
  children,
  title,
  description,
  isEmpty = false,
}: {
  children: React.ReactNode
  title: string
  description: string
  isEmpty?: boolean
}) {
  if (isEmpty) {
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
          <CardDescription className="text-slate-600">{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-slate-500">
            <div className="text-center">
              <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No hay datos disponibles</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">{title}</CardTitle>
        <CardDescription className="text-slate-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full h-[300px]">{children}</div>
      </CardContent>
    </Card>
  )
}

export default function VRDashboardHybrid() {
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos")
  const { data, eventos, loading, error, usingFallback } = useDashboardDataHybrid(eventoSeleccionado)

  const obtenerNombreDeEmail = (email: string) => {
    const nombre = email.split("@")[0]
    return nombre
      .split(".")
      .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
      .join(" ")
  }

  const obtenerColorGenero = (genero: string) => {
    const colores = {
      Male: "bg-blue-100 text-blue-800",
      Female: "bg-pink-100 text-pink-800",
      Other: "bg-purple-100 text-purple-800",
      Masculino: "bg-blue-100 text-blue-800",
      Femenino: "bg-pink-100 text-pink-800",
      Otro: "bg-purple-100 text-purple-800",
    }
    return colores[genero as keyof typeof colores] || "bg-gray-100 text-gray-800"
  }

  // Procesar datos para asegurar formato correcto
  const datosEdades = data.edades.filter((item) => item.cantidad > 0)
  const datosGenero = data.genero.filter((item) => item.cantidad > 0)
  const datosSimuladores = data.simuladores.slice(0, 8) // Limitar a 8 para mejor visualización

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Cargando datos del dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard de Eventos VR</h1>
            {usingFallback && (
              <Badge variant="outline" className="ml-4 text-amber-600 border-amber-300">
                Modo Demo
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alerta de estado */}
        {(error || usingFallback) && (
          <div className="mb-6">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                {usingFallback ? "Mostrando datos de demostración. Verifica la conexión a la base de datos." : error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Filtro Principal de Eventos */}
        <div className="mb-8">
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Seleccionar Evento</h2>
                  <p className="text-sm text-slate-600">Filtra todas las estadísticas por evento específico</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-slate-500" />
                  <Select value={eventoSeleccionado} onValueChange={setEventoSeleccionado}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Seleccionar evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los eventos</SelectItem>
                      {eventos.map((evento) => (
                        <SelectItem key={evento.id} value={evento.id.toString()}>
                          {evento.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tarjetas Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Usuarios Registrados</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data.resumen.totalUsuarios.toLocaleString()}</div>
              <p className="text-xs text-slate-500 mt-1">Usuarios en eventos VR</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Eventos Realizados</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data.resumen.totalEventos}</div>
              <p className="text-xs text-slate-500 mt-1">Eventos organizados</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Simuladores Activos</CardTitle>
              <Monitor className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{data.resumen.simuladoresActivos}</div>
              <p className="text-xs text-slate-500 mt-1">Paquetes de simuladores</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Barras - Distribución por Edades */}
          <ChartWrapper
            title="Distribución por Edades"
            description="Usuarios registrados por rango de edad"
            isEmpty={datosEdades.length === 0}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosEdades} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="rango" tick={{ fontSize: 12 }} stroke="#64748b" />
                <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="cantidad" fill="#10b981" radius={[4, 4, 0, 0]} name="Usuarios" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>

          {/* Gráfico Circular - Distribución por Género */}
          <ChartWrapper
            title="Distribución por Género"
            description="Proporción de usuarios por género"
            isEmpty={datosGenero.length === 0}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <Pie
                  data={datosGenero}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ genero, percent }) => `${genero} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="cantidad"
                >
                  {datosGenero.map((entry, index) => {
                    const colores = ["#3b82f6", "#ec4899", "#8b5cf6", "#6b7280"]
                    return <Cell key={`cell-${index}`} fill={colores[index % colores.length]} />
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </div>

        {/* Gráfico de Simuladores Más Usados */}
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Simuladores Más Usados</CardTitle>
            <CardDescription className="text-slate-600">Ranking de simuladores por número de usos</CardDescription>
          </CardHeader>
          <CardContent>
            {datosSimuladores.length > 0 ? (
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={datosSimuladores} margin={{ top: 20, right: 30, left: 20, bottom: 100 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis
                      dataKey="nombre"
                      tick={{ fontSize: 10 }}
                      stroke="#64748b"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Bar dataKey="usos" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Usos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay datos de simuladores disponibles</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabla de Usuarios */}
        <Card className="bg-white shadow-sm mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Usuarios Registrados ({data.usuarios.length})
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Información detallada de usuarios en el evento seleccionado
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="font-semibold text-slate-700">Nombre</TableHead>
                    <TableHead className="font-semibold text-slate-700">Empresa</TableHead>
                    <TableHead className="font-semibold text-slate-700">Ciudad</TableHead>
                    <TableHead className="font-semibold text-slate-700">Tipo Documento</TableHead>
                    <TableHead className="font-semibold text-slate-700">Género</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.usuarios.length > 0 ? (
                    data.usuarios.slice(0, 20).map((usuario, index) => (
                      <TableRow key={`${usuario.id}-${index}`} className="hover:bg-slate-50">
                        <TableCell className="font-medium text-slate-900">
                          {obtenerNombreDeEmail(usuario.email)}
                        </TableCell>
                        <TableCell className="text-slate-600">{usuario.empresa}</TableCell>
                        <TableCell className="text-slate-600">{usuario.ciudad}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-700 border-slate-300">
                            {usuario.tipoDocumento}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={obtenerColorGenero(usuario.genero)}>{usuario.genero}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                        No hay usuarios registrados para mostrar
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
