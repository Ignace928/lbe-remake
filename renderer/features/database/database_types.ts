
// Interfaces additionnelles
export interface DatabaseState {
  initialized: boolean
  message: string
  error?: string
}

export interface DatabaseUIState {
  loading: boolean
  error: boolean
  success: boolean
}

// Types pour les opérations de base de données
export interface DatabaseFile {
  name: string
  path: string
}

export interface DatabaseStatusResponse {
  success: boolean
  message: string
  initialized: boolean
}

export interface DatabaseReconnectResponse {
  success: boolean
  message: string
}

export interface DatabaseCreateResponse {
  success: boolean
  message: string
  data?: string
}

export interface DatabaseListResponse {
  success: boolean
  message: string
  data?: DatabaseFile[]
}

export interface DatabaseDeleteResponse {
  success: string
  error: string
}

export interface DatabaseSyncResponse {
  success: boolean
  message: string
  database?: string | null
}

export interface SelectedDatabase {
  name: string
  path: string
  updatedAt?: string
}
