export type HelloWorldModel = {
  message: string
  isLoading: boolean
  error: string | null
}

export const initialHelloWorldModel: HelloWorldModel = {
  message: '',
  isLoading: true,
  error: null,
}

