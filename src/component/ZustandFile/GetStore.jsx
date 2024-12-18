import { create } from "zustand";
import axios from "axios";

// Store Zustand
const GetStore = create((set) => ({
    loading: false,
    error: null,
    data: {}, // Objet pour stocker toutes les données reçues

    // Méthode pour récupérer toutes les données
    fetchAllData: async () => {
        set({ loading: true, error: null });
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/allData");
                set({ data: response.data, loading: false }); // Stocker toutes les données dans `data`
            } catch (error) {
                const errorMessage =
                error.response?.data?.message || "Une erreur est survenue lors de la récupération.";
                set({ error: errorMessage, loading: false });
            }
    },

    

    // Accès simplifié pour chaque catégorie
    getSections: () => GetStore.getState().data.sections || [],
    getPoles: () => GetStore.getState().data.poles || [],
    getDiplomes: () => GetStore.getState().data.diplomes || [],
    getActivity: () => GetStore.getState().data.activity || [],
}));

export default GetStore;
