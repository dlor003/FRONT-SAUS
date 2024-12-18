import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../ZustandFile/AuthStore"; // Assurez-vous d'importer correctement
import axios from "axios"; // Nécessaire pour les requêtes API

const Registration = () => {
    const { register, loading, error } = useAuthStore();
    const [email, setEmail] = useState("");
    const [emailStatus, setEmailStatus] = useState(null); // null, "loading", "valid", "invalid"
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordStrength, setPasswordStrength] = useState(0); // Force du mot de passe
    const [different, setDifferent] = useState(false); // Mots de passe différents
    const location = useLocation();
    const navigate = useNavigate();

    // Récupérer les données passées depuis la navigation
    const userData = location.state?.userData;

    // Initialisation des données de l'email
    useEffect(() => {
        if (userData) {
            // Recherchez l'email dans la structure
            const userInfo = userData.find(item => item.data && item.data.email);
            if (userInfo) {
                setEmail(userInfo.data.email); // Affectez l'email extrait
            }
        } else {
            navigate('/'); // Redirige vers la page Membership si aucune donnée n'est reçue
        }
    }, [userData, navigate]);

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Préparer les données à envoyer
        const dataToSend = {
            email,
            password,
            password_confirmation: confirmPassword,
            personnel_id: userData.find(item => item.id)?.id || null,
        };

        console.log("Données à envoyer :", dataToSend);

        try {
            const response = await register(dataToSend); // Appel à l'action du store
            console.log("Utilisateur enregistré :", response);
            navigate("/login"); // Redirige vers la page de connexion
        } catch (err) {
            console.error("Erreur lors de l'enregistrement :", err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                <form onSubmit={handleSubmit}>
                    {/* E-mail */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Email ou Identifiant
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Toujours garder l'email inchangé
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 border-gray-300 focus:ring-blue-500"
                            placeholder="Enter your email"
                            disabled // Désactive le champ email
                        />
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Confirmation du mot de passe */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                            required
                        />
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-md font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
