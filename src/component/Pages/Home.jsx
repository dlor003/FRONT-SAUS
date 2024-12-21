import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store";
import Login from "../Auth/Login";
import RegisterBasicData from "../Auth/RegisterBasicData";
import useAuthStore from "../ZustandFile/AuthStore";

const Home = () => {
    const { BasicId } = useAuthStore((state) => state);
    const [district, setDistrict] = useState("");
    const [commune, setCommune] = useState("");
    const [fokontany, setFokontany] = useState("");
    const [email, setEmail] = useState(""); // Nouvel état pour l'email
    const [step, setStep] = useState(1);
    const [drawEmailVerification, setdrawEmailVerification] = useState(false) 
    const {
        districtExists,
        communeExists,
        fokontanyExists,
        emailExists, // Vérification de l'email
        error,
        loading,
        verifyDistrict,
        verifyCommune,
        verifyFokontany,
        verifyEmail, // Fonction pour vérifier l'email
    } = useStore();

    const navigate = useNavigate();

    const updatedraw  = () => {
        setdrawEmailVerification((prev) => !prev);
    }

    const handleVerifyDistrict = async () => {
        await verifyDistrict(district);
        if (districtExists) {
            setStep(2);
        }
    };

    const handleVerifyCommune = async () => {
        await verifyCommune(district, commune);
        if (communeExists) {
            setStep(3);
        }
    };

    const handleVerifyFokontany = async () => {
        await verifyFokontany(commune, fokontany);
    };

    const handleVerifyEmail = async () => {
        try {
            const response = await verifyEmail(email); // Vérifie l'email
            console.log("condition verified")
            if (emailExists) {
                // Vérifiez que BasicId est bien défini
                const { BasicId } = useAuthStore.getState(); // Accède directement à l'état actuel
                console.log(BasicId);

                if (BasicId) {
                    navigate("/Questionnaire", { state: response });
                } else {
                    console.error("BasicId n'a pas été défini correctement.");
                }
            }
        } catch (e) {
            console.error("Erreur lors de la vérification de l'email :", e);
        }
    };

    return (
        <div className="flex items-center h-full bg-gray-300 grid grid-cols-10 gap-6">
            
            <Login />

            <div className="ml-20 mr-20  bg-gray-100 py-2 rounded-lg shadow-lg col-span-4">

                {drawEmailVerification ? (                
                        <div className="mt-4 px-4">
                            <label htmlFor="email" className="block font-medium text-gray-700">
                                J'ai deja un Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Entrez votre email"
                            />
                            <button
                                onClick={handleVerifyEmail}
                                className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                            >
                                Continuer
                            </button>

                            <div className="flex justify-center mt-2 mb-2">
                                <button className="text-center py-2 px-2 rounded-lg bg-green-300 w-48" onClick={updatedraw}>Retour </button>
                            </div>
                        </div>
                        
                        ) : ( 
                            <div>
                                <RegisterBasicData />
                                <div className="flex justify-center mt-2 mb-2">
                                    <button className="text-center py-2 px-2 rounded-lg bg-green-300 w-48" onClick={updatedraw}>j'ai une email debloquer</button>
                                </div>
                            </div>
                        )
                }
               
            </div>
        </div>
    );
};

export default Home;
