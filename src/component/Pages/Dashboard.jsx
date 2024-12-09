import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../AuthStore";

const Dashboard = () =>
{
    const navigate = useNavigate();
    const { isAuthenticated, dataUser } = useAuthStore();

    useEffect(() => {
        if (!isAuthenticated) {
        navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    // Vérification sécurisée des données
    if (!dataUser || !dataUser.user) {
        console.log("dataUser is missing:", dataUser);
        return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-gray-700 text-lg">Chargement...</p>
        </div>
        );
    }
    console.log(dataUser)

    const personnel = dataUser.user.personnel;
    if (!personnel) {
        return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-gray-700 text-lg">Données du personnel introuvables.</p>
        </div>
        );
    }

    return (
        <div className="bg-gray-100 rounded-lg p-5 min-h-screen p-6 pt-24 ">
                <h1 className="text-4xl"> MON DASHBOARD </h1>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-x-4">
                        <h3 className="text-xl text-center font-semibold mb-4">MES ADHESIONS ET COTISATIONS</h3>    
                    </div>
                </div>
        </div>
    )

}

export default Dashboard;