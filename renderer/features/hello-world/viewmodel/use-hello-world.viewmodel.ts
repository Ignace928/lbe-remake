import { useEffect, useState } from 'react'
import {
  HelloWorldModel,
  initialHelloWorldModel,
} from '../model/hello-world.model'
import { fetchHelloWorldMessage } from '../model/hello-world.service'

export function useHelloWorldViewModel() {
  const [model, setModel] = useState<HelloWorldModel>(initialHelloWorldModel)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const message = await fetchHelloWorldMessage()
        if (!cancelled) {
          setModel({
            message,
            isLoading: false,
            error: null,
          })
        }
      } catch (error) {
        if (!cancelled) {
          setModel({
            message: '',
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return model
}

