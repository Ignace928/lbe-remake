import React from 'react'
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { useDatabaseStatusQuery } from '../database_VModel'

export const DatabaseStatusView: React.FC = () => {
  const { data, isLoading, error } = useDatabaseStatusQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-600">Vérification de la base de données...</p>
        </div>
      </div>
    )
  }

  if (error || !data.initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Base de données non initialisée
              </h2>
              <p className="text-gray-600 mb-4">
                {data.message || 'Veuillez contacter l\'administrateur pour synchroniser la base de données.'}
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
                <p className="text-sm text-amber-800">
                  <strong>Action requise :</strong> Utilisez le bouton "Sync" dans l'interface de gestion des bases de données pour initialiser la connexion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (data.message && data.initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Base de données prête
              </h2>
              <p className="text-gray-600">
                {data.message}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
