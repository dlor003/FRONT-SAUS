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

  // Actions pour vérifier les données
  verifyDistrict: async (district) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-district",
        { district }
      );
      set({ districtExists: response.data.exists, loading: false });
    } catch (error) {
      set({ error: "Erreur lors de la vérification du district.", loading: false });
    }
  },

  verifyCommune: async (district, commune) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-commune",
        { district, commune }
      );
      set({ communeExists: response.data.exists, loading: false });
    } catch (error) {
      set({ error: "Erreur lors de la vérification de la commune.", loading: false });
    }
  },

  verifyFokontany: async (commune, fokontany) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-fokontany",
        { commune, fokontany }
      );
      set({ fokontanyExists: response.data.exists, loading: false });
    } catch (error) {
      set({ error: "Erreur lors de la vérification du fokontany.", loading: false });
    }
  },
}));

export default useStore;
