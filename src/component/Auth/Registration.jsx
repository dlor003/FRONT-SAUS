import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../AuthStore"; // Assurez-vous d'importer correctement
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

    // Rediriger si aucune donnée n'est reçue
    useEffect(() => {
        if (!userData) {
            navigate('/'); // Redirige vers la page Membership
        }
    }, [userData, navigate]);

    // Vérification de l'email (avec un debounce pour éviter trop de requêtes)
    useEffect(() => {
        if (!email) {
            setEmailStatus(null); // Réinitialise si l'email est vide
            return;
        }

        const timer = setTimeout(async () => {
            setEmailStatus("loading"); // Affiche le loader
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/check-email', { email });
                if (response.data.exists) {
                    setEmailStatus("invalid"); // L'email existe déjà
                } else {
                    setEmailStatus("valid"); // L'email est disponible
                }
            } catch (error) {
                console.error("Erreur lors de la vérification de l'email :", error);
                setEmailStatus("invalid"); // Considérer une erreur comme invalide
            }
        }, 500); // 500ms pour attendre que l'utilisateur ait fini de taper

        return () => clearTimeout(timer); // Nettoie le timer si l'email change rapidement
    }, [email]);

    // Fonction pour évaluer la force du mot de passe
    const evaluatePasswordStrength = (password) => {
        let strength = 0;

        // Critères de force
        if (password.length >= 8) strength++; // Longueur minimale
        if (/[A-Z]/.test(password)) strength++; // Contient une majuscule
        if (/[0-9]/.test(password)) strength++; // Contient un chiffre
        if (/[^a-zA-Z0-9]/.test(password)) strength++; // Contient un caractère spécial

        setPasswordStrength(strength);
    };

    // Gestion du changement de mot de passe
    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        evaluatePasswordStrength(value);
        setDifferent(value !== confirmPassword); // Vérifie si le mot de passe correspond
    };

    // Gestion du changement de "Confirm Password"
    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setDifferent(value !== password); // Vérifie si le mot de passe correspond
    };

    // Fonction pour soumettre le formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Préparer les données à envoyer
        const dataToSend = {
            email,
            password,
            password_confirmation: confirmPassword,
            personnel_id: userData.id
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
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                    emailStatus === "valid"
                                        ? "border-green-500 focus:ring-green-500"
                                        : emailStatus === "invalid"
                                        ? "border-red-500 focus:ring-red-500"
                                        : "border-gray-300 focus:ring-blue-500"
                                }`}
                                placeholder="Enter your email"
                                required
                            />
                            {emailStatus === "loading" && (
                                <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                                    <div className="loader w-4 h-4 border-2 border-t-2 border-gray-600 rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        {emailStatus === "invalid" && (
                            <p className="text-sm text-red-500 mt-2">
                                Cet email est déjà utilisé.
                            </p>
                        )}
                    </div>

                    {/* Mot de passe */}
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                            autoComplete="new-password"
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
                            onChange={handleConfirmPasswordChange}
                            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 ${
                                different
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-green-500"
                            }`}
                            placeholder="Confirm your password"
                            required
                            autoComplete="new-password"
                        />
                        {different && (
                            <p className="text-sm text-red-500 mt-2">
                                Les mots de passe ne correspondent pas.
                            </p>
                        )}
                    </div>

                    {/* Bouton de soumission */}
                    <button
                        type="submit"
                        disabled={emailStatus !== "valid" || passwordStrength < 3 || different}
                        className={`w-full py-3 px-4 rounded-md font-semibold text-white ${
                            emailStatus !== "valid" || passwordStrength < 3 || different
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
                        }`}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
