"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Calendar, Monitor, Filter, Loader2, Clock, AlertTriangle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

import { useDashboardDataHybrid } from "./hooks/useDashboardData-hybrid"

export default function VRDashboardFrostedGlass() {
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
      Male: "bg-orange-100/80 text-orange-800 border-orange-200/50",
      Female: "bg-pink-100/80 text-pink-800 border-pink-200/50",
      Other: "bg-purple-100/80 text-purple-800 border-purple-200/50",
      Masculino: "bg-orange-100/80 text-orange-800 border-orange-200/50",
      Femenino: "bg-pink-100/80 text-pink-800 border-pink-200/50",
      Otro: "bg-purple-100/80 text-purple-800 border-purple-200/50",
    }
    return colores[genero as keyof typeof colores] || "bg-white/20 text-gray-800 border-white/30"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center">
        <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 border border-white/30">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="text-xl font-medium text-white">Cargando datos del dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600">
      {/* Frosted Glass Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                <Monitor className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">VR Simulation Analytics</h1>
                <p className="text-orange-100 mt-1">Real-time insights from our VR showcase events across Colombia</p>
              </div>
            </div>
            {usingFallback && (
              <div className="flex items-center space-x-2 bg-amber-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-amber-300/30">
                <AlertTriangle className="h-4 w-4 text-amber-200" />
                <span className="text-amber-100 text-sm font-medium">Demo Mode</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Database Status Alert */}
        {usingFallback && (
          <div className="mb-6">
            <Alert className="bg-amber-500/20 backdrop-blur-md border-amber-300/30 text-amber-100">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-amber-100">
                <strong>Demo Mode:</strong> Database connection not available. Showing sample data for demonstration
                purposes.
                {error && (
                  <details className="mt-2 text-xs">
                    <summary className="cursor-pointer">Technical details</summary>
                    <p className="mt-1 font-mono">{error}</p>
                  </details>
                )}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Frosted Glass Event Filter */}
        <div className="mb-8">
          <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-black">Event Filter</h2>
                <p className="text-gray-700 mt-1">Filter all statistics by specific event</p>
              </div>
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-orange-200" />
                <Select value={eventoSeleccionado} onValueChange={setEventoSeleccionado}>
                  <SelectTrigger className="w-[280px] bg-white/20 backdrop-blur-sm border-white/30 text-white">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
                    <SelectItem value="todos">All events</SelectItem>
                    {eventos.map((evento) => (
                      <SelectItem key={evento.id} value={evento.id.toString()}>
                        {evento.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Frosted Glass Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6 hover:bg-white/35 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl">
                <Users className="h-6 w-6 text-gray-800" />
              </div>
            </div>
            <div>
              <p className="text-gray-800 text-sm font-medium mb-1">Total Users</p>
              <p className="text-4xl font-bold text-black mb-2">{data.resumen.totalUsuarios.toLocaleString()}</p>
              <p className="text-gray-700 text-sm">+18% from yesterday</p>
            </div>
          </div>

          <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6 hover:bg-white/35 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl">
                <Calendar className="h-6 w-6 text-gray-800" />
              </div>
            </div>
            <div>
              <p className="text-gray-800 text-sm font-medium mb-1">Active Events</p>
              <p className="text-4xl font-bold text-black mb-2">{data.resumen.totalEventos}</p>
              <p className="text-gray-700 text-sm">Events organized</p>
            </div>
          </div>

          <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6 hover:bg-white/35 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl">
                <Monitor className="h-6 w-6 text-gray-800" />
              </div>
            </div>
            <div>
              <p className="text-gray-800 text-sm font-medium mb-1">Active Simulators</p>
              <p className="text-4xl font-bold text-black mb-2">{data.resumen.simuladoresActivos}</p>
              <p className="text-gray-700 text-sm">All systems operational</p>
            </div>
          </div>

          <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6 hover:bg-white/35 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl">
                <Clock className="h-6 w-6 text-gray-800" />
              </div>
            </div>
            <div>
              <p className="text-gray-800 text-sm font-medium mb-1">Avg Session Time</p>
              <p className="text-4xl font-bold text-black mb-2">13.3min</p>
              <p className="text-gray-700 text-sm">Per user session</p>
            </div>
          </div>
        </div>

        {/* Frosted Glass Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Age Distribution Chart */}
          <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black mb-2">Age Distribution</h3>
              <p className="text-gray-700">Users registered by age range</p>
            </div>
            {data.edades.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.edades}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="rango" tick={{ fontSize: 12, fill: "white" }} stroke="rgba(255,255,255,0.7)" />
                    <YAxis tick={{ fontSize: 12, fill: "white" }} stroke="rgba(255,255,255,0.7)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    />
                    <Bar dataKey="cantidad" fill="rgba(255,255,255,0.8)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-orange-200">No age data available</div>
            )}
          </div>

          {/* Gender Distribution Chart */}
          <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-black mb-2">Gender Distribution</h3>
              <p className="text-gray-700">User proportion by gender</p>
            </div>
            {data.genero.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
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
                        const colors = [
                          "rgba(255,255,255,0.9)",
                          "rgba(255,255,255,0.7)",
                          "rgba(255,255,255,0.5)",
                          "rgba(255,255,255,0.3)",
                        ]
                        return <Cell key={`cell-${index}`} fill={colors[index]} />
                      })}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255,255,255,0.15)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: "12px",
                        color: "white",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-orange-200">No gender data available</div>
            )}
          </div>
        </div>

        {/* Most Used Simulators Chart */}
        <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6 mb-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2">Most Used Simulators</h3>
            <p className="text-gray-700">Simulator ranking by number of uses</p>
          </div>
          {data.simuladores.length > 0 ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.simuladores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                  <XAxis
                    dataKey="nombre"
                    tick={{ fontSize: 11, fill: "white" }}
                    stroke="rgba(255,255,255,0.7)"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12, fill: "white" }} stroke="rgba(255,255,255,0.7)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      borderRadius: "12px",
                      color: "white",
                    }}
                  />
                  <Bar dataKey="usos" fill="rgba(255,255,255,0.8)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-orange-200">
              No simulator data available
            </div>
          )}
        </div>

        {/* Frosted Glass Users Table */}
        <div className="bg-white/25 backdrop-blur-md rounded-2xl border border-white/30 p-6">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-black mb-2">Registered Users ({data.usuarios.length})</h3>
            <p className="text-gray-700">Detailed user information for selected event</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20 hover:bg-white/5">
                  <TableHead className="font-semibold text-gray-800">Name</TableHead>
                  <TableHead className="font-semibold text-gray-800">Company</TableHead>
                  <TableHead className="font-semibold text-gray-800">City</TableHead>
                  <TableHead className="font-semibold text-gray-800">Document Type</TableHead>
                  <TableHead className="font-semibold text-gray-800">Gender</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.usuarios.length > 0 ? (
                  data.usuarios.slice(0, 10).map((usuario, index) => (
                    <TableRow key={`${usuario.id}-${index}`} className="border-white/10 hover:bg-white/5">
                      <TableCell className="font-medium text-black">{obtenerNombreDeEmail(usuario.email)}</TableCell>
                      <TableCell className="text-gray-800">{usuario.empresa}</TableCell>
                      <TableCell className="text-gray-800">{usuario.ciudad}</TableCell>
                      <TableCell>
                        <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
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
                    <TableCell colSpan={5} className="text-center text-orange-200 py-8">
                      No registered users to display
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}
