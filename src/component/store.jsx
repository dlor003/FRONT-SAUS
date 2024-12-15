import { create } from "zustand";
import axios from "axios";

// Création du store Zustand
const useStore = create((set) => ({
    // États pour les données
    districtExists: null,
    communeExists: null,
    fokontanyExists: null,
    error: null,
    loading: false,
    dataToVerified: null,

    // Méthode pour récupérer toutes les données
    fetchdataToVerified: async () => {
        set({ loading: true, error: null });
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/dataToVerified");
                console.log(response.data)
                set({ dataToVerified: response.data, loading: false }); // Stocker toutes les données dans `data`
            } catch (error) {
                const errorMessage =
                error.response?.data?.message || "Une erreur est survenue lors de la récupération.";
                set({ error: errorMessage, loading: false });
            }
    },

    // Actions pour vérifier les données
    verifyDistrict: async (district) => {
        set({ loading: true, error: null });
        try {
            console.log(district)
            const response = await axios.post(
                "http://127.0.0.1:8000/api/verify-district",
                { district }
            );
            set({ districtExists: response.data.exists, loading: false });
        } catch (error) {
            set({ error: "Erreur lors de la vérification du district.", loading: false });
        }
    },

    verifyCommune: async (communeData) => {
        set({ loading: true, error: null });
        try {
            console.log(communeData)
            const response = await axios.post(
                "http://127.0.0.1:8000/api/verify-commune",
                communeData
            );
            set({ communeExists: response.data.exists, loading: false });
        } catch (error) {
        set({ error: "Erreur lors de la vérification de la commune.", loading: false });
        }
    },

    verifyFokontany: async (fokontanyData) => {
        set({ loading: true, error: null });
        try {
            console.log(fokontanyData)
            const response = await axios.post(
                "http://127.0.0.1:8000/api/verify-fokontany",
                fokontanyData
            );
            set({ fokontanyExists: response.data.exists, loading: false });
        } catch (error) {
            set({ error: "Erreur lors de la vérification du fokontany.", loading: false });
        }
    },
}));

export default useStore;
