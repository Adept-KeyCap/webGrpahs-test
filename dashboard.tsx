"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Users, Calendar, Monitor, Filter } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo
const eventos = [
  { id: "1", nombre: "Tech Summit 2024 - Bogotá", ciudad: "Bogotá", empresa: "TechCorp" },
  { id: "2", nombre: "Innovation Day - Medellín", ciudad: "Medellín", empresa: "InnovateX" },
  { id: "3", nombre: "Digital Future - Cali", ciudad: "Cali", empresa: "FutureTech" },
  { id: "4", nombre: "VR Experience - Barranquilla", ciudad: "Barranquilla", empresa: "VRSolutions" },
]

const usuarios = [
  {
    id: 1,
    email: "juan.perez@techcorp.com",
    empresa: "TechCorp",
    ciudad: "Bogotá",
    tipoDocumento: "Cédula",
    genero: "Masculino",
  },
  {
    id: 2,
    email: "maria.rodriguez@innovatex.com",
    empresa: "InnovateX",
    ciudad: "Medellín",
    tipoDocumento: "Cédula",
    genero: "Femenino",
  },
  {
    id: 3,
    email: "carlos.martinez@futuretech.com",
    empresa: "FutureTech",
    ciudad: "Cali",
    tipoDocumento: "Pasaporte",
    genero: "Masculino",
  },
  {
    id: 4,
    email: "ana.garcia@vrsolutions.com",
    empresa: "VRSolutions",
    ciudad: "Barranquilla",
    tipoDocumento: "Cédula",
    genero: "Femenino",
  },
  {
    id: 5,
    email: "luis.hernandez@techcorp.com",
    empresa: "TechCorp",
    ciudad: "Bogotá",
    tipoDocumento: "Tarjeta de Identidad",
    genero: "Masculino",
  },
  {
    id: 6,
    email: "sofia.lopez@innovatex.com",
    empresa: "InnovateX",
    ciudad: "Medellín",
    tipoDocumento: "Cédula",
    genero: "Otro",
  },
]

const datosPorEvento = {
  "1": {
    resumen: { totalUsuarios: 324, totalEventos: 1, simuladoresActivos: 6 },
    genero: [
      { genero: "Masculino", cantidad: 187 },
      { genero: "Femenino", cantidad: 102 },
      { genero: "Otro", cantidad: 25 },
      { genero: "No especifica", cantidad: 10 },
    ],
    edades: [
      { rango: "16-25", cantidad: 89 },
      { rango: "26-35", cantidad: 124 },
      { rango: "36-45", cantidad: 78 },
      { rango: "46-55", cantidad: 23 },
      { rango: "56+", cantidad: 10 },
    ],
    simuladores: [
      { nombre: "VR Racing Pro", usos: 145 },
      { nombre: "Space Explorer", usos: 132 },
      { nombre: "City Builder VR", usos: 98 },
      { nombre: "Adventure Quest", usos: 87 },
      { nombre: "Medical Training", usos: 65 },
    ],
    usuarios: [
      {
        id: 1,
        email: "juan.perez@techcorp.com",
        empresa: "TechCorp",
        ciudad: "Bogotá",
        tipoDocumento: "Cédula",
        genero: "Masculino",
      },
      {
        id: 2,
        email: "maria.rodriguez@techcorp.com",
        empresa: "TechCorp",
        ciudad: "Bogotá",
        tipoDocumento: "Cédula",
        genero: "Femenino",
      },
    ],
  },
  "2": {
    resumen: { totalUsuarios: 298, totalEventos: 1, simuladoresActivos: 5 },
    genero: [
      { genero: "Masculino", cantidad: 156 },
      { genero: "Femenino", cantidad: 112 },
      { genero: "Otro", cantidad: 20 },
      { genero: "No especifica", cantidad: 10 },
    ],
    edades: [
      { rango: "16-25", cantidad: 67 },
      { rango: "26-35", cantidad: 98 },
      { rango: "36-45", cantidad: 89 },
      { rango: "46-55", cantidad: 32 },
      { rango: "56+", cantidad: 12 },
    ],
    simuladores: [
      { nombre: "Innovation Lab VR", usos: 156 },
      { nombre: "Design Studio", usos: 134 },
      { nombre: "VR Racing Pro", usos: 89 },
      { nombre: "Tech Demo", usos: 76 },
      { nombre: "Creative Workshop", usos: 54 },
    ],
    usuarios: [
      {
        id: 3,
        email: "carlos.martinez@innovatex.com",
        empresa: "InnovateX",
        ciudad: "Medellín",
        tipoDocumento: "Pasaporte",
        genero: "Masculino",
      },
      {
        id: 4,
        email: "ana.garcia@innovatex.com",
        empresa: "InnovateX",
        ciudad: "Medellín",
        tipoDocumento: "Cédula",
        genero: "Femenino",
      },
    ],
  },
  "3": {
    resumen: { totalUsuarios: 412, totalEventos: 1, simuladoresActivos: 7 },
    genero: [
      { genero: "Masculino", cantidad: 234 },
      { genero: "Femenino", cantidad: 145 },
      { genero: "Otro", cantidad: 23 },
      { genero: "No especifica", cantidad: 10 },
    ],
    edades: [
      { rango: "16-25", cantidad: 98 },
      { rango: "26-35", cantidad: 156 },
      { rango: "36-45", cantidad: 102 },
      { rango: "46-55", cantidad: 41 },
      { rango: "56+", cantidad: 15 },
    ],
    simuladores: [
      { nombre: "Future City VR", usos: 178 },
      { nombre: "Digital Workshop", usos: 145 },
      { nombre: "Tech Innovation", usos: 123 },
      { nombre: "VR Prototype Lab", usos: 98 },
      { nombre: "Design Thinking VR", usos: 76 },
    ],
    usuarios: [
      {
        id: 5,
        email: "luis.hernandez@futuretech.com",
        empresa: "FutureTech",
        ciudad: "Cali",
        tipoDocumento: "Cédula",
        genero: "Masculino",
      },
      {
        id: 6,
        email: "sofia.lopez@futuretech.com",
        empresa: "FutureTech",
        ciudad: "Cali",
        tipoDocumento: "Tarjeta de Identidad",
        genero: "Femenino",
      },
    ],
  },
  "4": {
    resumen: { totalUsuarios: 213, totalEventos: 1, simuladoresActivos: 4 },
    genero: [
      { genero: "Masculino", cantidad: 110 },
      { genero: "Femenino", cantidad: 73 },
      { genero: "Otro", cantidad: 21 },
      { genero: "No especifica", cantidad: 9 },
    ],
    edades: [
      { rango: "16-25", cantidad: 44 },
      { rango: "26-35", cantidad: 78 },
      { rango: "36-45", cantidad: 61 },
      { rango: "46-55", cantidad: 22 },
      { rango: "56+", cantidad: 8 },
    ],
    simuladores: [
      { nombre: "VR Ocean Explorer", usos: 89 },
      { nombre: "Caribbean Adventure", usos: 76 },
      { nombre: "Coastal Experience", usos: 65 },
      { nombre: "Marine Life VR", usos: 54 },
    ],
    usuarios: [
      {
        id: 7,
        email: "ana.garcia@vrsolutions.com",
        empresa: "VRSolutions",
        ciudad: "Barranquilla",
        tipoDocumento: "Cédula",
        genero: "Femenino",
      },
      {
        id: 8,
        email: "carlos.martinez@vrsolutions.com",
        empresa: "VRSolutions",
        ciudad: "Barranquilla",
        tipoDocumento: "Pasaporte",
        genero: "Masculino",
      },
    ],
  },
  todos: {
    resumen: { totalUsuarios: 1247, totalEventos: 24, simuladoresActivos: 18 },
    genero: [
      { genero: "Masculino", cantidad: 687 },
      { genero: "Femenino", cantidad: 432 },
      { genero: "Otro", cantidad: 89 },
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
    usuarios: usuarios,
  },
}

export default function VRDashboard() {
  const [eventoSeleccionado, setEventoSeleccionado] = useState("todos")
  const [eventoSeleccionadoPrincipal, setEventoSeleccionadoPrincipal] = useState("todos")

  // Datos específicos por evento

  const obtenerDatosEvento = (eventoId: string) => {
    return datosPorEvento[eventoId as keyof typeof datosPorEvento] || datosPorEvento["todos"]
  }

  const obtenerNombreDeEmail = (email: string) => {
    const nombre = email.split("@")[0]
    return nombre
      .split(".")
      .map((parte) => parte.charAt(0).toUpperCase() + parte.slice(1))
      .join(" ")
  }

  const obtenerColorGenero = (genero: string) => {
    const colores = {
      Masculino: "bg-blue-100 text-blue-800",
      Femenino: "bg-pink-100 text-pink-800",
      Otro: "bg-purple-100 text-purple-800",
      "No especifica": "bg-gray-100 text-gray-800",
    }
    return colores[genero as keyof typeof colores] || "bg-gray-100 text-gray-800"
  }

  const datosEventoActual = obtenerDatosEvento(eventoSeleccionadoPrincipal)

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
                  <Select value={eventoSeleccionadoPrincipal} onValueChange={setEventoSeleccionadoPrincipal}>
                    <SelectTrigger className="w-[280px]">
                      <SelectValue placeholder="Seleccionar evento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos los eventos</SelectItem>
                      {eventos.map((evento) => (
                        <SelectItem key={evento.id} value={evento.id}>
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
                {datosEventoActual.resumen.totalUsuarios.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500 mt-1">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Total Eventos Realizados</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{datosEventoActual.resumen.totalEventos}</div>
              <p className="text-xs text-slate-500 mt-1">+3 eventos este mes</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">Simuladores Activos</CardTitle>
              <Monitor className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{datosEventoActual.resumen.simuladoresActivos}</div>
              <p className="text-xs text-slate-500 mt-1">94% de disponibilidad</p>
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
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={datosEventoActual.edades}>
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
            </CardContent>
          </Card>

          {/* Gráfico Circular - Distribución por Género */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Distribución por Género</CardTitle>
              <CardDescription className="text-slate-600">Proporción de usuarios por género</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={datosEventoActual.genero}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ genero, percent }) => `${genero} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="cantidad"
                  >
                    {datosEventoActual.genero.map((entry, index) => {
                      const colores = ["#3b82f6", "#ec4899", "#8b5cf6", "#6b7280"]
                      return <Cell key={`cell-${index}`} fill={colores[index]} />
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={datosEventoActual.simuladores}>
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
          </CardContent>
        </Card>

        {/* Filtro de Eventos */}
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
                  {datosEventoActual.usuarios.map((usuario) => (
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
