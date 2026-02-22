export async function fetchHelloWorldMessage() {
  return window.ipc.hello.getMessage()
}

