"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Calendar, Monitor, Filter, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Datos estáticos para testing directo
const datosEstaticos = {
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
    { rango: "56+", cantidad: 5 },
  ],
  simuladores: [
    { nombre: "VR Racing", usos: 25 },
    { nombre: "Space Explorer", usos: 18 },
    { nombre: "City Builder", usos: 12 },
  ],
  usuarios: [
    {
      id: 1,
      email: "juan.perez@example.com",
      empresa: "Grupo Éxito",
      ciudad: "Bogotá",
      tipoDocumento: "Cédula",
      genero: "Male",
    },
    {
      id: 2,
      email: "maria.gomez@example.com",
      empresa: "Postobón",
      ciudad: "Medellín",
      tipoDocumento: "Cédula",
      genero: "Female",
    },
  ],
}

const eventos = [
  { id: 1, nombre: "Grupo Éxito - Bogotá" },
  { id: 2, nombre: "Postobón - Medellín" },
  { id: 3, nombre: "EPM - Cali" },
]

export default function VRDashboardDebugData() {
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos")
  const [mounted, setMounted] = useState(false)

  // Asegurar que el componente esté montado
  useEffect(() => {
    setMounted(true)
  }, [])

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
    }
    return colores[genero as keyof typeof colores] || "bg-gray-100 text-gray-800"
  }

  // No renderizar hasta que esté montado
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Inicializando dashboard...</span>
        </div>
      </div>
    )
  }

  // Debug: Mostrar los datos que se van a usar
  console.log("🔍 Datos para gráficos:")
  console.log("Edades:", datosEstaticos.edades)
  console.log("Género:", datosEstaticos.genero)
  console.log("Simuladores:", datosEstaticos.simuladores)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Monitor className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard de Eventos VR - Debug</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Debug Info */}
        <div className="mb-8">
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-yellow-800 mb-2">Debug - Datos del Gráfico:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <strong>Edades:</strong>
                  <pre className="mt-1 text-yellow-700">{JSON.stringify(datosEstaticos.edades, null, 2)}</pre>
                </div>
                <div>
                  <strong>Género:</strong>
                  <pre className="mt-1 text-yellow-700">{JSON.stringify(datosEstaticos.genero, null, 2)}</pre>
                </div>
                <div>
                  <strong>Simuladores:</strong>
                  <pre className="mt-1 text-yellow-700">{JSON.stringify(datosEstaticos.simuladores, null, 2)}</pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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
              <div className="text-2xl font-bold text-slate-900">
                {datosEstaticos.resumen.totalUsuarios.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">Usuarios en eventos VR</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Eventos Realizados</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{datosEstaticos.resumen.totalEventos}</div>
              <p className="text-xs text-slate-500 mt-1">Eventos organizados</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Simuladores Activos</CardTitle>
              <Monitor className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{datosEstaticos.resumen.simuladoresActivos}</div>
              <p className="text-xs text-slate-500 mt-1">Paquetes de simuladores</p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos con Debug */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Barras - Distribución por Edades */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Distribución por Edades</CardTitle>
              <CardDescription className="text-slate-600">
                Usuarios registrados por rango de edad (Items: {datosEstaticos.edades.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
                <strong>Datos del gráfico:</strong> {JSON.stringify(datosEstaticos.edades)}
              </div>
              <div className="w-full" style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datosEstaticos.edades}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rango" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico Circular - Distribución por Género */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Distribución por Género</CardTitle>
              <CardDescription className="text-slate-600">
                Proporción de usuarios por género (Items: {datosEstaticos.genero.length})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
                <strong>Datos del gráfico:</strong> {JSON.stringify(datosEstaticos.genero)}
              </div>
              <div className="w-full" style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={datosEstaticos.genero}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ genero, percent }) => `${genero} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad"
                    >
                      {datosEstaticos.genero.map((entry, index) => {
                        const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
                        return <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Simuladores Más Usados */}
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Simuladores Más Usados</CardTitle>
            <CardDescription className="text-slate-600">
              Ranking de simuladores por número de usos (Items: {datosEstaticos.simuladores.length})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 p-2 bg-gray-50 rounded text-xs">
              <strong>Datos del gráfico:</strong> {JSON.stringify(datosEstaticos.simuladores)}
            </div>
            <div className="w-full" style={{ height: "400px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={datosEstaticos.simuladores}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nombre" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="usos" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de Usuarios */}
        <Card className="bg-white shadow-sm mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">
                  Usuarios Registrados ({datosEstaticos.usuarios.length})
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
                  {datosEstaticos.usuarios.map((usuario) => (
                    <TableRow key={usuario.id} className="hover:bg-slate-50">
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
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
