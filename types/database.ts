// Tipos basados en tu estructura de base de datos
export interface GenderTable {
  id: number
  name: string
}

export interface CompaniesTable {
  id: number
  name: string
}

export interface CitiesTable {
  id: number
  name: string
}

export interface DocTypeTable {
  id: number
  type_name: string
}

export interface SimulatorTable {
  id: number
  name: string
  version: string
}

export interface PackageTable {
  id: number
  simulator_id: number
  devices_list: string
  qr_code: string
  city_id: number
}

export interface UsersTable {
  id: number
  gender_id: number
  birthdate: string
  doc_type: number
  doc_number: string
  company_id: number
  phone_number: string
  email: string
  photo_link: string
}

export interface EventsTable {
  id: number
  company_id: number
  city_id: number
  date: string
}

export interface EventPackages {
  event_id: number
  package_id: number
}

export interface EventAttendees {
  event_id: number
  user_id: number
}

// Tipos para el dashboard con datos combinados
export interface DashboardUser {
  id: number
  email: string
  empresa: string
  ciudad: string
  tipoDocumento: string
  genero: string
  edad: number
  evento_id: number
}

export interface DashboardEvent {
  id: number
  nombre: string
  ciudad: string
  empresa: string
  fecha: string
  simuladoresActivos: number
}

export interface DashboardData {
  resumen: {
    totalUsuarios: number
    totalEventos: number
    simuladoresActivos: number
  }
  genero: Array<{ genero: string; cantidad: number }>
  edades: Array<{ rango: string; cantidad: number }>
  simuladores: Array<{ nombre: string; usos: number }>
  usuarios: DashboardUser[]
}
