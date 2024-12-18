import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../ZustandFile/AuthStore";
import BaseData from "./UpdatedFIle/BaseData";
import PersoData from "./UpdatedFIle/PersoData";
import DiplomeData from "./UpdatedFIle/DiplomeData";
import SectionData from "./UpdatedFIle/SectionData";
import Activitydata from "./UpdatedFIle/ActivityData";
import PolesData from "./UpdatedFIle/PolesData";

const Profil = () => {
    const navigate = useNavigate();
    const { isAuthenticated, dataUser, update  } = useAuthStore();
    const persoId = dataUser.personnelData.bodyData.id; // id du donnee a mettre a jour

     useEffect(() => {
        if (!isAuthenticated) {
        navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    const handleUpdate = async (updatedData) => {
        try {
            console.log("Données formatées :", updatedData);
    
            // Envoyer les données formatées au store
            const response = await update(persoId, updatedData);
            
            console.log("Mise à jour réussie !", response);
        } catch (error) {
            
            console.error("Erreur lors de la mise à jour :", error.message);
        }
    };

    // Vérification sécurisée des données
    if (!dataUser || !dataUser.user) {
        console.log("dataUser is missing:", dataUser);
        return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-gray-700 text-lg">Chargement...</p>
        </div>
        );
    }
    console.log( dataUser)

    const personnel = dataUser.user;
    if (!personnel) {
        return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-gray-700 text-lg">Données du personnel introuvables.</p>
        </div>
        );
    }

    const diplomes = dataUser.personnelData.diplomes || [];
    const poles = dataUser.personnelData.polesSearch || [];
    const activities = dataUser.personnelData.activity || [];
    const section = dataUser.personnelData.section;
    const typesMembres = dataUser.personnelData.typesMembers || [];
    const BodyData = dataUser.personnelData.bodyData || [];
    const autresDiplomes = dataUser.personnelData.bodyData.autres_diplomes || [];
    const PersoDonnee = {
        "BodyData" : BodyData,
        "token" : dataUser.token,
        "id" : dataUser.personnelData.bodyData.id,
        "profile_picture" : dataUser.personnelData.profile_picture
    };
    const diplomeDonnee = {
        "diplomes" : diplomes,
        "autresDiplomes" : autresDiplomes,
    }
    

    return (
        <div className="bg-gray-100 min-h-screen p-6 mt-16">
            
                <h2 className="text-4xl mb-3"> PROFILE </h2>
                <BaseData data={{ data: PersoDonnee }} onUpdate={handleUpdate} />

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PersoData data={{ data: PersoDonnee }} onUpdate={handleUpdate}/>

                    <DiplomeData data={{ data:  diplomeDonnee }} onUpdate={handleUpdate} />

                    <SectionData data={section} onUpdate={handleUpdate}/>

                    <Activitydata data={activities} onUpdate={handleUpdate}/>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold mb-4 text-center">TYPES D'ADHESION</h3>
                        <ul className="list-disc ml-10">
                            {typesMembres.map((type) => (
                            <li key={type.id}>{type.type}</li>
                            ))}
                        </ul>
                    </div>

                    <PolesData  data={poles} onUpdate={handleUpdate}/>
            </div>
        </div>
    );
};

export default Profil;
