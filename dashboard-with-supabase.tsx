"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Calendar, Monitor, Filter, Loader2 } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useDashboardData } from "./hooks/useDashboardData"

export default function VRDashboardWithSupabase() {
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos")
  const { data, eventos, loading, error } = useDashboardData(eventoSeleccionado)

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

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Distribución por Edades</CardTitle>
              <CardDescription className="text-slate-600">Usuarios registrados por rango de edad</CardDescription>
            </CardHeader>
            <CardContent>
              {data.edades.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={data.edades}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="rango" tick={{ fontSize: 12 }} stroke="#64748b" />
                    <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="cantidad" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  No hay datos de edades disponibles
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico Circular - Distribución por Género */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Distribución por Género</CardTitle>
              <CardDescription className="text-slate-600">Proporción de usuarios por género</CardDescription>
            </CardHeader>
            <CardContent>
              {data.genero.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.genero}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ genero, percent }) => `${genero} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cantidad"
                    >
                      {data.genero.map((entry, index) => {
                        const colores = ["#3b82f6", "#ec4899", "#8b5cf6", "#6b7280"]
                        return <Cell key={`cell-${index}`} fill={colores[index]} />
                      })}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-slate-500">
                  No hay datos de género disponibles
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Simuladores Más Usados */}
        <Card className="bg-white shadow-sm mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Simuladores Más Usados</CardTitle>
            <CardDescription className="text-slate-600">Ranking de simuladores por número de usos</CardDescription>
          </CardHeader>
          <CardContent>
            {data.simuladores.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.simuladores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 11 }}
                    stroke="#64748b"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="usos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-slate-500">
                No hay datos de simuladores disponibles
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabla de Usuarios */}
        <Card className="bg-white shadow-sm mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-slate-900">Usuarios Registrados</CardTitle>
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
                    data.usuarios.map((usuario) => (
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
