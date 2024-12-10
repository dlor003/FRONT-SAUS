import { create } from "zustand";
import { persist } from "zustand/middleware"; // Middleware pour persistance
import axios from "axios";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      dataUser: null,

      // Action pour l'enregistrement
      register: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/register", data);
          set({ user: response.data.user, isAuthenticated: true, loading: false });
          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.";
          set({ error: errorMessage, loading: false });
        }
      },

      // Action pour la connexion
      connexion: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await axios.post("http://127.0.0.1:8000/api/login", data);

          const role = response.data.user.roles;
          const token = response.data.token;

          localStorage.setItem("token", token); // Simule un token
          localStorage.setItem("role", role); // Stocke le rôle

          set({
            dataUser: response.data,
            user: response.data.user,
            isAuthenticated: true,
            loading: false,
          });
          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Une erreur est survenue lors de la connexion.";
          set({ error: errorMessage, loading: false, isAuthenticated: false });
        }
      },

      // Méthode de mise à jour
      update: async (personnelId, updatedData) => {
        set({ loading: true });
        try {
          const token = localStorage.getItem("token");
          console.log("donnees authstore",updatedData)
          const response = await axios.put(
            `http://127.0.0.1:8000/api/personnel/${personnelId}`,
            updatedData,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          // Mettre à jour les données utilisateur locales
          set((state) => ({
            dataUser: {
              ...state.dataUser,
              user: {
                ...state.dataUser.user,
                personnel: response.data.personnel, // Mettez à jour uniquement les données du personnel
              },
            },
            loading: false,
          }));

          return response.data;
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || "Une erreur est survenue lors de la mise à jour.";
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      // Déconnexion
      logout: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        set({ user: null, isAuthenticated: false, dataUser: null });
      },

      // Vérifier l'authentification
      checkAuth: () => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token) {
          set({
            user: { token, role },
            isAuthenticated: true,
            error: null,
          });
          return true;
        } else {
          set({
            user: null,
            isAuthenticated: false,
            error: "Utilisateur non connecté",
          });
          return false;
        }
      },
    }),
    {
      name: "auth-storage", // Nom utilisé dans localStorage
      partialize: (state) => ({ 
            user: state.user, 
            isAuthenticated: state.isAuthenticated, 
            dataUser: state.dataUser }), // Sauvegarde partielle
    }
  )
);

export default useAuthStore;
