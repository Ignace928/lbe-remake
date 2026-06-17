import { LoginCredentials } from "./auth_types"

export async function loginUser(credentials: LoginCredentials) {
  return window.ipc.user.auth(credentials)
}

export async function logoutUser() {
  // Pour l'instant, simple redirection
  window.location.href = '/'
}
