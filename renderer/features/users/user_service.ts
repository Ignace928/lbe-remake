export async function getAllUsers() {
  const result = await window.ipc.user.getAll()
  console.log('UserService - getAllUsers result:', result)
  return result
}

export async function getUserById(id_user: number) {
  return window.ipc.user.getById(id_user)
}

export async function createUser(userData: { nom_user: string; mdp: string; role: string }) {
  return window.ipc.user.create(userData)
}

export async function updateUser(id_user: number, userData: { nom_user?: string; mdp?: string; role?: string }) {
  return window.ipc.user.update(id_user, userData)
}

export async function deleteUser(id_user: number) {
  return window.ipc.user.delete(id_user)
}

export async function authenticateUser(credentials: { nom_user: string; mdp: string }) {
  return window.ipc.user.auth(credentials)
}
