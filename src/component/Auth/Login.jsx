import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "../AuthStore"; // Import du store Zustand
import logo from "../../assets/logo.png";

const Login = () => {
    const { connexion, loading, isAuthenticated } = useAuthStore(); // Récupère les états/méthodes depuis le store
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error2, setError2] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); // Récupère l'URL actuelle

    useEffect(() => {
        if (isAuthenticated) {
            // Redirige automatiquement si déjà authentifié
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const DataToSend = { email, password };

        try {
            const response = await connexion(DataToSend); // Appelle la méthode de connexion
            console.log("Réponse API :", response); // Debug
            navigate("/dashboard", { state: response.data }); // Redirige vers le Dashboard après connexion
        } catch (err) {
            setError2("Email ou mot de passe incorrect");
            console.error("Erreur pendant la connexion :", err); // Debug
        }
    };

    if (isAuthenticated) {
        // Affiche un message si déjà connecté
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
                <p className="text-lg text-gray-700 mb-4">Vous êtes déjà connecté.</p>
                <button
                    onClick={() => navigate("/Profil")}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                    Aller dans mon Dashboard
                </button>
            </div>
        );
    }

    // Applique mt-64 uniquement si on est sur /login
    const containerClass = location.pathname === "/login"
        ? "flex bg-white p-6 rounded-lg shadow-lg col-span-6 ml-20 mr-10 mt-64"
        : "flex bg-white p-6 rounded-lg shadow-lg col-span-6 ml-20 mr-10";

    // Affiche le formulaire si non connecté
    return (
        <div className={containerClass}>
            <div className="w-1/2 flex flex-col justify-center items-center bg-gray-50 p-8">
                <form className="w-full max-w-md" onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Adresse email :</label>
                        <input
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1">Mot de passe :</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                    {error2 && <p className="text-red-500 text-sm">{error2}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-md transition hover:bg-blue-600"
                    >
                        {loading ? "Chargement..." : "Se connecter"}
                    </button>
                </form>
            </div>
            <div className="w-1/2 bg-gray-100 flex justify-center items-center">
                <div className="w-64 h-64 rounded-full overflow-hidden border-blue-500">
                    <img src={logo} alt="Logo" className="w-full h-full object-cover" />
                </div>
            </div>
        </div>
    );
};

export default Login;
