import { create } from "zustand";
import axios from "axios";
import useAuthStore from "./ZustandFile/AuthStore"; // Importer useAuthStore
import { useNavigate } from "react-router-dom";

const useStore = create((set) => ({
    // États pour les données
    districtExists: null,
    communeExists: null,
    fokontanyExists: null,
    error: null,
    loading: false,
    dataToVerified: null,
    isBlocked: false, // Nouveau champ pour suivre le blocage
    setIsBlocked: (status) => set({ isBlocked: status }),
    VerificationErrorMessage: null,
    setVerificationErrorMessage: (message) => set({ VerificationErrorMessage: message }),

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
        set({ loading: true, error: null, VerificationErrorMessage: null });
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/verify-commune",
                communeData
            );
    
            if (response.data.blocked) {
                useStore.getState().setVerificationErrorMessage(
                    "Vous avez atteint la limite de tentatives. Vous êtes bloqué."
                );
                set({ loading: false });
                setTimeout(() => {
                    window.location.href = "/";
                }, 3000);
            } else if (!response.data.exists) {
                const attempts = response.data.attempts || 0;
                useStore.getState().setVerificationErrorMessage(
                    `La commune est invalide. Tentative ${attempts} sur 3.`
                );
                set({ loading: false });
            } else {
                set({ communeExists: response.data.exists, loading: false });
            }
        } catch (error) {
            set({ error: "Erreur lors de la vérification de la commune.", loading: false });
        }
    },
    
    verifyFokontany: async (fokontanyData,navigate) => {
        set({ loading: true, error: null, messageTentativeFailedFokotany: null });
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/verify-fokontany",
                fokontanyData
            );
    
            if (response.data.blocked) {
                useStore.getState().setVerificationErrorMessage(
                    "Vous avez atteint la limite de tentatives. Vous êtes bloqué."
                );
                set({ loading: false }); // Important pour arrêter le chargement
                setTimeout(() => {
                    navigate("/"); // Redirection avec React Router
                }, 3000);
            } else if (!response.data.exists) {
                const attempts = response.data.attempts || 0;
                useStore.getState().setVerificationErrorMessage(
                    `Le fokontany est invalide. Tentative ${attempts} sur 3.`
                );
                set({ loading: false }); // Arrêter le chargement ici aussi
            } else {
                set({ fokontanyExists: response.data.exists, loading: false });
            }
        } catch (error) {
            set({
                error: "Erreur lors de la vérification du fokontany.",
                loading: false,
            });
        }
    },

    // Vérification de l'email
    verifyEmail: async (email) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/verify-email", { email });
            set({ emailExists: response.data.exists, loading: false });
            console.log(response.data)
            const  basicId = response.data.data.id 
            
            // Mettre à jour le BasicId dans AuthStore
            useStore.getState().updateBasicId(basicId);
            return response.data;
        } catch (e) {
            console.log(e)
            set({ error: e.message, loading: false });
            throw e;
        }
    },

    // Vérification de l'email
    verifyExistsEmail: async (email) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/verify-exists-email", { email });
            set({ emailExists: response.data.exists, loading: false });

            return response.data;
        } catch (e) {
            set({ error: e.response?.data?.message || "Erreur lors de la vérification de l'email.", loading: false });
            throw e;
        }
    },

    // Méthode pour mettre à jour le BasicId dans AuthStore
    updateBasicId: (newBasicId) => {
        useAuthStore.setState({ BasicId: newBasicId });
    },
    
    resetVerificationState: () => set({
        VerificationErrorMessage: null,
        districtExists: null,
        communeExists: null,
        fokontanyExists: null,
        loading: false,
    }),
    
}));

export default useStore;