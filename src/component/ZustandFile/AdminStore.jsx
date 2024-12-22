import { create } from "zustand";
import axios from "axios";
import { API_BASE_URL }from "../../apiConfig"

// store Zustand
const useAdminStore = create((set, get) => ({
    loading: false,
    error: false,
    data: {}, // Commencez avec un objet vide, et non un tableau
    token: localStorage.getItem("token") || "",
    AllUser: [],
    OneUser: null,
    unBlockSuccess: null,
    onAdminSuccess:null,
    AllAdmin: [],

    fetchAllUser: async () => {
      set({ loading: true, error: false });
      const token = get().token;
      try {
        const response = await axios.get(`${API_BASE_URL}AllUser`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        set({ AllUser: response.data, loading: false }); // Remettre tout l'objet réponse
      } catch (error) {
        set({ error: error.response?.data?.message || error.message, loading: false });
      }
    },

    fetchAllAdmin: async () => {
      set({ loading: true, error: false });
      const token = get().token;
      try {
        const response = await axios.get(`${API_BASE_URL}AllAdmin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        set({ AllAdmin: response.data, loading: false }); // Remettre tout l'objet réponse
      } catch (error) {
        console.log(error)
        set({ error: error.response?.data?.message || error.message, loading: false });
      }
    },
    
    fetchOneUser: async (id) => {
        set({ loading: true, error: false });
        const token = get().token; // Récupérer le token ici
        try {
            const response = await axios.get(`${API_BASE_URL}user/${id}/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            set({ OneUser: response.data, loading: false }); // Stocker la réponse directement
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
            set({ error: error.response?.data?.message || error.message, loading: false });
        }
    },
    
    

    fetchDemandes: async () => {
      set({ loading: true, error: false });
      const token = get().token;
      
      try {
        const response = await axios.get(`${API_BASE_URL}getAllDemandes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        set({ data: response.data, loading: false }); // Remettre tout l'objet réponse
      } catch (error) {
        set({ error: error.response?.data?.message || error.message, loading: false });
      }
    },
  
    traiterDemande: async (id) => {
      set({ loading: true, error: false });
      const token = get().token;
      
      try {
        const response = await axios.put(
          `${API_BASE_URL}demandes/${id}/traitee`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );
  
        // Mettre à jour la liste des demandes après traitement
        set(state => ({
          data: {
            ...state.data,
            demandes: state.data.demandes.map(demande =>
              demande.id === id ? { ...demande, status: 'traitee' } : demande
            )
          },
          loading: false,
        }));
  
        return response.data.message; // Retourne le message de succès
      } catch (error) {
        set({ error: error.response?.data?.message || error.message, loading: false });
        throw error;
      }
    },

    RejeteDemande: async (id) => {
      set({ loading: true, error: false });
      const token = get().token;
      
      try {
        const response = await axios.put(
          `${API_BASE_URL}demandes/${id}/rejete`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          }
        );
  
        // Mettre à jour la liste des demandes après traitement
        set(state => ({
          data: {
            ...state.data,
            demandes: state.data.demandes.map(demande =>
              demande.id === id ? { ...demande, status: 'rejete' } : demande
            )
          },
          loading: false,
        }));
  
        return response.data.message; // Retourne le message de succès
      } catch (error) {
        set({ error: error.response?.data?.message || error.message, loading: false });
        throw error;
      }
    },

    unBlockUser: async (id) => {
      set({ loading: true });
      const token = get().token;
      console.log(token);
      try {
        // Envoi du token dans les headers, pas dans le body
        const response = await axios.post(`${API_BASE_URL}user/${id}/unblock`, {}, {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });
        set({ unBlockSuccess: "Succès, l'utilisateur est débloqué avec succès" });

        // Après 5 secondes, remettre unBlockSuccess à null
        setTimeout(() => {
          set({ unBlockSuccess: null });
        }, 5000); // 5000 millisecondes = 5 secondes
      } catch (error) {
        console.log(error);
        set({ unBlockSuccess: "Erreur lors de l'envoi de la demande." });

        // Après 5 secondes, remettre unBlockSuccess à null
        setTimeout(() => {
          set({ unBlockSuccess: null });
        }, 5000); // 5000 millisecondes = 5 secondes
      } finally {
        set({ loading: false });
      }
    },

    searchUser: async (query) => {
      const token = get().token;
      try {
        const response = await axios.get(`${API_BASE_URL}users/search?query=${query}`,  {
          headers: { 
            'Authorization': `Bearer ${token}` 
          }
        });
        return response.data; // Retourner l'utilisateur trouvé
      } catch (error) {
          console.log(error)
      }
    },
    promoteUser: async (userId) => {
        try {
                const token = get().token;
                await axios.post(`${API_BASE_URL}users/promote`, { id: userId }, {
                headers: { 
                    'Authorization': `Bearer ${token}` 
                }
                }); // Promouvoir l'utilisateur
                set({onAdminSuccess: "Succès, il a ete bien promus en administrateur"})
                // Après 5 secondes, remettre unBlockSuccess à null
                setTimeout(() => {
                    set({ onAdminSuccess: null });
                }, 5000); // 5000 millisecondes = 5 secondes
        } catch (error) {
            console.log(error)
            set({onAdminSuccess: "erreur l'admin n'a pas pu etre promu"})
            // Après 5 secondes, remettre unBlockSuccess à null
            setTimeout(() => {
                set({ onAdminSuccess: null });
            }, 5000); // 5000 millisecondes = 5 secondes
        }
    },
    
  }));
  

export default useAdminStore;
