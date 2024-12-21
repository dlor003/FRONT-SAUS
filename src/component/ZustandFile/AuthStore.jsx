import { create } from "zustand";
import { persist } from "zustand/middleware"; // Middleware pour persistance
import axios from "axios";

const useAuthStore = create(
  persist(
    (set) => ({
        loading: false,
        error: null,
        dataUser: null,
        BasicId: null, // Ajouter une clé userId dans le store pour stocker l'ID
        status: "",
        profilePicture: null, // Initial profile picture
        messages : null,
        user: JSON.parse(localStorage.getItem("user")) || null, // Charge le user depuis localStorage
        isAuthenticated: !!localStorage.getItem("user") || null, // Détermine si l'utilisateur est connecté
        authLoading: false,
        cotisationAdd: null,

        // Fonction pour récupérer les demandes de l'utilisateur
        fetchDemandes: async ({ userId, token }) => {
            set({ loading: true, status: "" });
            try {
            const response = await axios.get(`http://127.0.0.1:8000/api/demandes/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Vérification de la réponse
            if (response.status === 200 && Array.isArray(response.data)) {
                set({ demandes: response.data, status: "" });
            } else {
                set({ demandes: [] });
            }
            } catch (error) {
            set({ demandes: [], status: "Erreur lors de la récupération des demandes." });
            } finally {
            set({ loading: false });
            }
        },
        

        postDemande: async ({ data, token }) => {
            set({ loading: true });
            try {
                await axios.post("http://127.0.0.1:8000/api/demandes", data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                set({ status: "Demande envoyée avec succès !" });
            } catch (error) {
                console.log(error);
                set({ status: "Erreur lors de l'envoi de la demande." });
            } finally {
                set({ loading: false });
            }
        },
        
        // Method to upload a new profile image
        updateProfileImage: async ({ file, token, id }) => {
            set({ loading: true, status: null }); // Set loading to true
            try {
            const formData = new FormData();
            formData.append("profile_picture", file);
            formData.append("id", id); // Optional, if needed by the backend

            // Send the file to the Laravel backend
            const response = await axios.post(
                "http://127.0.0.1:8000/api/profile-picture",
                formData,
                {
                headers: {
                    Authorization: `Bearer ${token}`, // Authorization header with the token
                    "Content-Type": "multipart/form-data", // Correct content type
                },
                }
            );

            // Update the profile picture in the state with the new URL
            set({
                profilePicture: response.data.image_url, // URL returned by the backend
                messages: "Image de profil mise à jour avec succès !",
            });
            } catch (error) {
            console.error("Error updating profile picture:", error);
            set({
                messages: "Erreur lors de la mise à jour de l'image de profil.",
            });
            } finally {
            set({ loading: false }); // Reset loading state
            }
        },

        // Action pour l'enregistrement
        register: async (data) => {
            set({ loading: true, error: null });
            try {
                const response = await axios.post("http://127.0.0.1:8000/api/register", data);
                set({ user: response.data.user, isAuthenticated: true, loading: false });
                return response.data;
            } catch (error) {
                console.log(error)
                const errorMessage =
                    error.response?.data?.message || "Une erreur est survenue lors de l'enregistrement.";
                 set({ error: errorMessage, loading: false });
            }
        },

        registerBasicData: async (data) => {
            set({ loading: true, error: null });
                try {
                const response = await axios.post("http://127.0.0.1:8000/api/registerBasicData", data);
            
                // Supposons que l'ID de base est dans response.data.id
                const userId = response.data.data.id;
            
                set({ 
                    BasicId: userId, // Mise à jour correcte de BasicId
                    isAuthenticated: false, // Pas encore complètement authentifié
                    user: { id: userId, ...response.data.data }, // Mise à jour de l'utilisateur minimal
                    loading: false,
                });
                
            
                return response.data;
                } catch (error) {
                const errorMessage = error.response?.data?.message || "Erreur lors de l'enregistrement.";
                set({ error: errorMessage, loading: false });
                throw new Error(errorMessage);
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

        postCotisation: async ({ data, token }) => {
            set({ loading: true, error: null });
            console.log(token);  // Vérifie ici si le token est bien défini
        
            if (!token) {
                set({ error: "Token manquant", loading: false });
                return;
            }
        
            try {
                const response = await axios.post(
                    "http://127.0.0.1:8000/api/cotisation",
                    data,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`, // Autorisation avec le token
                            "Content-Type": "multipart/form-data", // Type de contenu multipart
                        },
                    }
                );
        
                set({
                    isAuthenticated: true,
                    loading: false,
                    cotisationAdd: "succès, la cotisation a bien ete ajouter",
                    error:null
                });
                setTimeout(() => {
                        set({cotisationAdd: null })
                }, 5000);
        
                return response.data;
            } catch (error) {
                console.log(error);
                const errorMessage =
                    error.response?.data?.message || "Une erreur est survenue lors de la soumission.";
                set({ 
                    error: errorMessage, 
                    loading: false, 
                    isAuthenticated: false,
                    cotisationAdd: "erreur de l'ajout du cotisation" });
                setTimeout(() => {
                        set({cotisationAdd: null })
                }, 5000);
        
            }
        },
        
            // Méthode de mise à jour
        update: async (personnelId, updatedData) => {
            set({ loading: true });
            try {
                const token = localStorage.getItem("token");
                console.log("Données envoyées :", updatedData);

                const response = await axios.put(
                            `http://127.0.0.1:8000/api/personnel/${personnelId}`,
                            updatedData,
                            {
                                headers: { Authorization: `Bearer ${token}` },
                            }
                );

                // Mettre à jour `dataUser` avec tout ce qui est retourné par l'API
                set((state) => {
                const updatedDataUser = {
                    ...state.dataUser, // On garde l'existant
                    ...response.data, // On fusionne avec les nouvelles données retournées
                };

                // Sauvegarder dans localStorage pour persistance
                localStorage.setItem("auth-storage", JSON.stringify({
                    user: state.user,
                    isAuthenticated: state.isAuthenticated,
                    dataUser: updatedDataUser,
                }));

                return {
                    dataUser: updatedDataUser,
                    loading: false,
                };
                });

                return response.data; // Renvoie les données au composant pour d'autres actions éventuelles
            } catch (error) {
                console.log(error);
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
      checkAuth: async () => {
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
