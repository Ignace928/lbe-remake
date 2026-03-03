import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { databaseService } from './database_service'
import { DatabaseState, DatabaseFile, SelectedDatabase } from './database_types'

// Hook pour le statut de la base de données
export const useDatabaseStatusQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['database', 'status'],
    queryFn: databaseService.getStatus,
    select: (data): DatabaseState => {
      if (!data) {
        return {
          initialized: false,
          message: 'Aucune réponse du serveur',
          error: 'Aucune réponse du serveur'
        }
      }
      return {
        initialized: data.initialized,
        message: data.message,
        error: !data.success ? data.message : undefined,
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    data,
    isLoading,
    error
  }
}

// Hook pour la reconnexion de base de données
export const useReconnectDatabaseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: databaseService.reconnect,
    onSuccess: (data) => {
      // Invalider les queries liées à la base de données
      queryClient.invalidateQueries({ queryKey: ['database'] })
    },
    onError: (error) => {
      console.error('Erreur lors de la reconnexion:', error)
    }
  })
}

// Hook pour la création de base de données
export const useCreateDatabaseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: databaseService.create,
    onSuccess: (data) => {
      // Invalider la liste des bases de données
      queryClient.invalidateQueries({ queryKey: ['database', 'list'] })
    },
    onError: (error) => {
      console.error('Erreur lors de la création:', error)
    }
  })
}

// Hook pour la liste des bases de données
export const useDatabaseListQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['database', 'list'],
    queryFn: databaseService.list,
    select: (data) => data?.data || [],
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  return {
    data,
    isLoading,
    error
  }
}

// Hook pour la suppression de base de données
export const useDeleteDatabaseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: databaseService.delete,
    onSuccess: (data) => {
      // Invalider la liste des bases de données
      queryClient.invalidateQueries({ queryKey: ['database', 'list'] })
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error)
    }
  })
}

// Hook pour la synchronisation de base de données
export const useSyncDatabaseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: databaseService.sync,
    onSuccess: (data) => {
      // Invalider le statut de la base de données
      queryClient.invalidateQueries({ queryKey: ['database', 'status'] })
    },
    onError: (error) => {
      console.error('Erreur lors de la synchronisation:', error)
    }
  })
}

// Hook pour la base de données sélectionnée
export const useSelectedDatabaseQuery = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['database', 'selected'],
    queryFn: databaseService.getSelected,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  return {
    data,
    isLoading,
    error
  }
}

// Hook pour la sélection de base de données
export const useSelectDatabaseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: databaseService.setSelected,
    onSuccess: (data) => {
      // Invalider les queries liées
      queryClient.invalidateQueries({ queryKey: ['database', 'selected'] })
      queryClient.invalidateQueries({ queryKey: ['database', 'status'] })
    },
    onError: (error) => {
      console.error('Erreur lors de la sélection:', error)
    }
  })
}

// Hook pour effacer la sélection
export const useClearSelectedDatabaseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: databaseService.clearSelected,
    onSuccess: () => {
      // Invalider les queries liées
      queryClient.invalidateQueries({ queryKey: ['database', 'selected'] })
      queryClient.invalidateQueries({ queryKey: ['database', 'status'] })
    },
    onError: (error) => {
      console.error('Erreur lors de l\'effacement:', error)
    }
  })
}

// Hook combiné pour l'état global de la base de données
export const useDatabaseState = () => {
  const { data: status } = useDatabaseStatusQuery()
  const { data: list } = useDatabaseListQuery()
  const { data: selected } = useSelectedDatabaseQuery()
  
  return {
    status,
    databases: list || [],
    selected,
    isInitialized: status?.initialized || false,
    hasDatabases: (list?.length || 0) > 0,
    selectedDatabase: selected
  }
}
