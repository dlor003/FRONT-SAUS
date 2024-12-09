import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../AuthStore";
import Modify from "../../assets/Modify.svg";

const Profil = () => {
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

    const diplomes = dataUser.diplomes || [];
    const activities = dataUser.activity || [];
    const section = personnel.section;
    const typesMembres = personnel.types_membres || [];

    return (
        <div className="bg-gray-100 min-h-screen p-6 mt-16">
                <h2 className="text-4xl mb-3"> MON PROFILE </h2>
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="relative flex items-center space-x-4">
                    {/* Photo de profil */}
                    {personnel.profile_picture ? (
                        <img
                            src={personnel.profile_picture}
                            alt="Profile"
                            className="w-24 h-24 rounded-full"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-gray-600">No Image</span>
                        </div>
                    )}

                    {/* Informations utilisateur */}
                    <div>
                        <p className="ml-10"><strong>Nom : </strong> {personnel.nom}</p> 
                        <p className="ml-10"><strong>Prenom :</strong> {personnel.prenom}</p>
                        <p className="ml-10"><strong>Appelation :</strong> {personnel.appelation}</p>
                        <p className="ml-10"><strong>Email :</strong> {personnel.mail}</p>
                    </div>

                    {/* Icône en haut à droite */}
                    <div className="absolute top-0 right-0 p-2">
                        <button>
                        <img
                            src={Modify}
                            alt="Icône"
                            className="h-6 w-6 text-gray-600"
                        />
                        </button>
                    </div>
                </div>
            </div>


            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl text-center font-semibold mb-4">DONNÉES PERSONNELLES</h3>
                        <p className="ml-10"><strong>Date de Naissance :</strong> {personnel.date_naissance}</p>
                        <p className="ml-10"><strong>Genre :</strong> {personnel.genre}</p>
                        <p className="ml-10"><strong>Nationalité :</strong> {personnel.nationalite}</p>
                        <p className="ml-10"><strong>Téléphone :</strong> {personnel.phone}</p>
                        <p className="ml-10"><strong>Adresse :</strong> {personnel.adresse}</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">DIPLÔME UNIVERSITAIRE</h3>
                        <ul className="list-disc ml-14">
                            {diplomes.map((diplome) => (
                            <li key={diplome.id}>{diplome.nom}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">SECTION</h3>
                        <p className="ml-10">
                            <strong>Nom de la Section :</strong> {section.nom}
                        </p>
                    </div>


                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">ACTIVITÉ PROFESSIONNELLE</h3>
                    {activities.length > 0 ? (
                        activities.map((activity) => (
                        <>
                            <p key={activity.id} className="ml-10">
                                activite<strong>{activity.nom}</strong>
                            </p>
                            <p className="ml-10">
                                Domaine : <strong>{activity.domain}</strong>
                            </p>
                        </>
                        ))
                    ) : (
                        <p>Aucune activité enregistrée.</p>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">TYPES D'ADHESION</h3>
                    <ul className="list-disc ml-10">
                        {typesMembres.map((type) => (
                        <li key={type.id}>{type.type}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Profil;
