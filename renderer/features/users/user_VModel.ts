"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, createUser, updateUser, deleteUser } from "./user_service";
import { User, CreateUser, UpdateUser } from "./user_types";
import { toast } from "sonner";

export function useUserVm() {
    /*
    ----✅ queryClient() permet de garder ton UI synchronisée avec les mutations côté serveur.
    Après une mutation (createUser, updateUser, deleteUser), tu veux que la liste des utilisateurs se mette à jour
    ----✅ invalidateQueries() marque la query comme « périmée », donc React Query va la refetcher.
    */
    const queryClient = useQueryClient()

    // Query principale
    const { data, isLoading, error } = useQuery({
        queryKey: ["users"], // <----- Clé de cache pour la liste des utilisateurs
        queryFn: () => getAllUsers(),
        staleTime: 10_000, // 10 secondes
    });

    // Debug: voir ce que retourne le service
    console.log('UserVM - data:', data);

    // ✅ Mutations
    const createUserMutation = useMutation({
        mutationFn: (input: CreateUser) => createUser(input),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"] as const
            });
            toast.success("Utilisateur créé avec succès");
        },
        onError: (e) => {
            toast.error("Erreur lors de la création de l'utilisateur");
        }
    });

    const updateUserMutation = useMutation({
        mutationFn: ({ input, id }: { input: UpdateUser; id: number }) => updateUser(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"] as const
            });
            toast.success("Utilisateur modifié avec succès");
        },
        onError: (e) => {
            toast.error("Erreur lors de la modification de l'utilisateur");
        }
    });

    const deleteUserMutation = useMutation({
        mutationFn: (id: number) => deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["users"] as const
            });
            toast.success("Utilisateur supprimé avec succès");
        },
        onError: (e) => {
            toast.error("Erreur lors de la suppression de l'utilisateur");
        }
    });

    return {
        data: data?.success ? data.data : data?.data || [],
        isLoading,
        error,
        createUser: createUserMutation,
        updateUser: updateUserMutation,
        deleteUser: deleteUserMutation
    };
}
