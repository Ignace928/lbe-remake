import { registerFileController } from './file.controller'
import { registerHelloController } from './hello.controller'
import { registerUserController } from './USER/user.controller'
import { registerDatabaseController } from './database.controller'
import { setGlobalSequelize } from './database'

export function registerIpcControllers() {
  registerHelloController()
  registerFileController()
  registerUserController()
  registerDatabaseController()
}

export { setGlobalSequelize }
