import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import useAdminStore from "../../../ZustandFile/AdminStore";

const UserProfil = () => {
    const { id } = useParams(); // Récupère l'ID de l'utilisateur depuis l'URL
    const { OneUser, fetchOneUser } = useAdminStore();
    console.log(OneUser)
    const User = OneUser.personnelData;
    
    if (!OneUser) {
        return <p>Chargement...</p>;
    }

  

    return (
        <div className="p-6 bg-white shadow-md rounded-lg mt-32">
            <h1 className="text-2xl font-bold mb-4">Profil de : {User.basicData.nom} {User.basicData.prenom}</h1>
            
            <div className="flex justify-start mb-6">
                <img
                    src={User.profile_picture || "https://via.placeholder.com/150"}
                    alt="Profile"
                    className="w-32 h-32 rounded-full ml-20"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {/* Carte 1 */}
                <div className="card p-4 bg-white shadow-md rounded-lg">
                    <p><strong>Nom:</strong> {User.basicData.nom} {User.basicData.prenom}</p>
                    <p><strong>Email:</strong> {User.basicData.email}</p>
                    <p><strong>Statut:</strong> {User.basicData.is_blocked ? "Bloqué" : "Actif"}</p>
                    <p><strong>Date de naissance:</strong> {User.bodyData.date_naissance}</p>
                </div>

                {/* Carte 2 */}
                <div className="card p-4 bg-white shadow-md rounded-lg">
                    <p><strong>Adresse:</strong> {User.bodyData.adresse}</p>
                    <p><strong>Nationalité:</strong> {User.bodyData.nationalite}</p>
                    <p><strong>Section:</strong> {User.bodyData.section.nom}</p>
                    <p><strong>Numéro de téléphone:</strong> {User.bodyData.phone}</p>
                </div>

                {/* Carte 3 */}
                <div className="card p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold mt-6 mb-2">Diplômes</h2>
                    <ul>
                        {User.bodyData.diplomes.map((diplome) => (
                            <li key={diplome.id}>{diplome.nom}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                {/* Carte 4 */}
                <div className="card p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold mt-6 mb-2">Activités</h2>
                    <ul>
                        {User.bodyData.activite_individual.map((activity) => (
                            <li key={activity.id}>{activity.nom} - {activity.pivot.domain}</li>
                        ))}
                    </ul>
                </div>

                {/* Carte 5 */}
                <div className="card p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold mt-6 mb-2">Pôles de recherche</h2>
                    <ul>
                        {User.bodyData.poles_recherche.map((pole) => (
                            <li key={pole.id}>{pole.nom}</li>
                        ))}
                    </ul>
                </div>

                {/* Carte 6 */}
                <div className="card p-4 bg-white shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold mt-6 mb-2">Types de membres</h2>
                    <ul>
                        {User.bodyData.types_membres.map((type) => (
                            <li key={type.id}>{type.type}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default UserProfil;
