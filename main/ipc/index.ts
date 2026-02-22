import { registerFileController } from './file.controller'
import { registerHelloController } from './hello.controller'

export function registerIpcControllers() {
  registerHelloController()
  registerFileController()
}
