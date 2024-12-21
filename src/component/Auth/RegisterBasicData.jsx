import React, { useState } from 'react';
import useAuthStore from '../ZustandFile/AuthStore';
import { useNavigate, useLocation } from 'react-router-dom';
import useStore from "../store"; // Importer useStore

const RegisterBasicData = () => {
    const { registerBasicData, error, loading } = useAuthStore((state) => state);
    const navigate = useNavigate();
    const location = useLocation(); // Récupère l'URL actuelle
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');
    const [emailStatus, setEmailStatus] = useState("idle"); // idle, checking, valid, invalid
    const [formError, setFormError] = useState(null); // État pour gérer les erreurs de formulaire

    const { verifyExistsEmail } = useStore();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEmailChange = async (e) => {
        const emailValue = e.target.value;
        setEmail(emailValue);

        if (!validateEmail(emailValue)) {
            setEmailStatus("invalid");
            return;
        }

        setEmailStatus("checking");

        try {
            const response = await verifyExistsEmail(emailValue);
            if (response.exists) {
                setEmailStatus("invalid");
            } else {
                setEmailStatus("valid");
            }
        } catch (error) {
            setEmailStatus("invalid");
        }
    };

    const getEmailInputClass = () => {
        switch (emailStatus) {
            case "valid":
                return "border-green-500 focus:ring-green-500";
            case "invalid":
                return "border-red-500 focus:ring-red-500";
            case "checking":
                return "border-gray-500 focus:ring-gray-500";
            default:
                return "border-gray-300 focus:ring-blue-500";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Réinitialiser les erreurs de formulaire
        setFormError(null);

        // Valider les champs requis
        if (!nom || !prenom || !email) {
            setFormError("Tous les champs sont obligatoires.");
            return;
        }

        if (emailStatus === "invalid") {
            setFormError("L'email est déjà utilisé ou n'est pas valide.");
            return;
        }

        const data = { nom, prenom, email };

        try {
            const response = await registerBasicData(data);

            // Si l'enregistrement est réussi
            if (response) {
                console.log("Utilisateur enregistré avec succès", response);

                // Vérifiez que BasicId est bien défini
                const { BasicId } = useAuthStore.getState(); // Accède directement à l'état actuel
                console.log(useAuthStore.getState().BasicId);

                if (BasicId) {
                    navigate("/Questionnaire", { state: response });
                } else {
                    console.error("BasicId n'a pas été défini correctement.");
                }
            }
        } catch (error) {
            console.log(error);
            setFormError("Une erreur est survenue lors de l'enregistrement.");
        }
    };

    // Applique mt-64 uniquement si on est sur /login
    const containerClass = location.pathname === "/registerBasicData"
        ? "flex bg-white p-6 rounded-lg shadow-lg col-span-6 ml-20 mr-10 mt-64"
        : "flex bg-white p-6 rounded-lg shadow-lg col-span-6 ml-20 mr-10";

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className={containerClass}>
                <div>
                    <form className="w-full max-w-md" onSubmit={handleSubmit}>
                        <h1 className="text-2xl font-bold text-center">INSCRIPTION DE BASE</h1>
                        <h6 className="text-center text-sm mb-6">
                            Pour l'inscription, il y a quelque étapes à respecter. <br />
                            Veuillez les suivre attentivement s'il vous plaît.
                        </h6>
                        {formError && (
                            <div className="text-red-500 text-center mb-4">
                                {formError}
                            </div>
                        )}
                        <div className="mt-2">
                            <label>Nom:</label>
                            <input
                                type="text"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="mt-2">
                            <label>Prénom:</label>
                            <input
                                type="text"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                required
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="mt-2">
                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                                className={`w-full p-3 border rounded-md focus:ring-2 focus:outline-none ${getEmailInputClass()}`}
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full bg-blue-500 text-white py-3 rounded-md transition hover:bg-blue-600"
                        >
                            {loading ? 'Chargement...' : 'Enregistrer'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterBasicData;