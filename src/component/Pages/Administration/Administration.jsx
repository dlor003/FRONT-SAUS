import React, { useState, useEffect } from "react";
import Demande from "./AdminComposant/Demande";
import Users from "./AdminComposant/Users";
import Statistique from "./AdminComposant/Statistique";
import AddAdmin from "./AdminComposant/AddAdmin";
import useAdminStore from "../../ZustandFile/AdminStore";
import PromoteUser from "./AdminComposant/PromoteUser";

const Administration = () => {
    const [activeTab, setActiveTab] = useState("demandes");
    const { 
        loading, 
        error, 
        data, 
        fetchDemandes, 
        fetchAllUser, 
        AllUser,
        AllAdmin,
        fetchAllAdmin
    } = useAdminStore();

    useEffect(() => {
        // Récupère les demandes si elles ne sont pas encore chargées
        if (!data.demandes || data.demandes.length === 0) {
            fetchDemandes();
        }

        // Récupère les utilisateurs si nécessaire
        if (!AllUser || AllUser.length === 0) {
            fetchAllUser();
        }

        if(!AllAdmin || AllAdmin.length === 0)
        {
            fetchAllAdmin();
        }
    }, [data.demandes, fetchDemandes, AllUser, fetchAllUser, fetchAllAdmin, AllAdmin]);
    const demandes = data.demandes || []; // Assurez-vous que 'demandes' est un tableau

    if (loading) return <div>Chargement...</div>; // Affiche un message de chargement
    if (error) return <div>Erreur : {error}</div>; // Affiche une erreur si elle survient

    const tabs = [
        { name: "Les demandes", id: "demandes" },
        { name: "Les utilisateurs", id: "utilisateurs" },
        { name: "Statistiques", id: "statistiques" },
        { name: "Les admins", id: "admins" },
        { name: "Promotion", id: "promotion" },
    ];

    return (
        <div className="min-h-screen bg-gray-100 mt-28 fixed w-full">
            {/* Barre de navigation */}
            <nav className="bg-gray-800 text-white">
                <ul className="flex justify-around py-3">
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            className={`cursor-pointer px-4 py-2 rounded-md ${
                                activeTab === tab.id
                                    ? "bg-blue-500 text-white font-semibold"
                                    : "hover:bg-gray-700"
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.name}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Contenu des tabs */}
            <div className="p-4 bg-gray-100">
                {activeTab === "demandes" && <Demande data={demandes} />}
                {activeTab === "utilisateurs" && <Users users={AllUser.AllUsers} />}
                {activeTab === "statistiques" && <Statistique/>}
                {activeTab === "admins" && <AddAdmin  data={AllAdmin}/>}
                {activeTab === "promotion" && <PromoteUser />}
            </div>
        </div>
    );
};

export default Administration;
