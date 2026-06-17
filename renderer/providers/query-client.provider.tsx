'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Créer un client Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

interface QueryClientProviderProps {
  children: React.ReactNode
}

export const QueryClientProviderComponent: React.FC<QueryClientProviderProps> = ({
  children,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
