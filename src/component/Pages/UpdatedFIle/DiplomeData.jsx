import React, { useState, useEffect } from "react";
import GetStore from "../../ZustandFile/GetStore";
import Modify from "../../../assets/Modify.svg";


const DiplomeData = ({ data, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false); // État pour le mode édition
    const { fetchAllData, getDiplomes, loading, error } = GetStore(); // Récupération des données avec Zustand
    const [selectedDiplomes, setSelectedDiplomes] = useState([]); // Diplômes sélectionnés
    const [autresDiplomes, setAutresDiplomes] = useState(""); // Valeur de l'input autresDiplomes

    useEffect(() => {
        // Charger les données de l'API
        fetchAllData();

        // Initialiser les diplômes déjà associés à la personne
        setSelectedDiplomes(data.data.diplomes.map((diplome) => diplome.id));

        // Initialiser le champ autresDiplomes
        setAutresDiplomes(data.data.autresDiplomes.map(((autresDiplome) => autresDiplome.name)) || ""); // Défaut à une chaîne vide si aucun autre diplôme
    }, [data]);

    const diplomesFetch = getDiplomes(); // Diplômes disponibles dans l'application

    // Gestion du changement des cases à cocher
    const handleCheckboxChange = (diplomeId) => {
        if (selectedDiplomes.includes(diplomeId)) {
            // Retirer le diplôme si décoché
            setSelectedDiplomes((prev) =>
                prev.filter((id) => id !== diplomeId)
            );
        } else {
            // Ajouter le diplôme si coché
            setSelectedDiplomes((prev) => [...prev, diplomeId]);
        }
    };

    // Gestion du changement de l'input autresDiplomes
    const handleAutresDiplomesChange = (event) => {
        setAutresDiplomes(event.target.value); // Met à jour l'état local
    };

    // Gestion de l'enregistrement des modifications
    const handleSave = () => {
        // Création de l'objet avec les IDs des diplômes sélectionnés et autresDiplomes
        const selectedDiplomesObject = {
            diplomes: selectedDiplomes, // Envoyer le tableau directement
            autresDiplomes: autresDiplomes, // Inclure le champ autresDiplomes
        };

        console.log("Données mises à jour :", selectedDiplomesObject);

        // Appeler la fonction de mise à jour
        onUpdate(selectedDiplomesObject);
        setIsEditing(false); // Quitter le mode édition
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }
     // Fonction pour basculer entre les modes d'édition et d'affichage
     const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    return (
        <div className="relative bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-1 text-center">
                DIPLÔME UNIVERSITAIRE
            </h3>

            {isEditing ? (
                // Mode édition : afficher les cases à cocher
                <div className="space-y-2">
                    {diplomesFetch.map((option) => (
                        <label
                            key={option.id}
                            className="flex items-center space-x-2"
                        >
                            <input
                                type="checkbox"
                                name={option.id.toString()}
                                className="form-checkbox h-5 w-5 text-blue-600"
                                checked={selectedDiplomes.includes(option.id)}
                                onChange={() =>
                                    handleCheckboxChange(option.id)
                                }
                            />
                            <span className="text-gray-800">{option.nom}</span>
                        </label>
                    ))}

                    <input
                        type="text"
                        name="autresDiplomes"
                        value={autresDiplomes} // Lier la valeur de l'input à l'état
                        placeholder="Précisez votre diplôme"
                        onChange={handleAutresDiplomesChange} // Appeler la gestion du changement
                        className="ml-20 border border-gray-300 rounded-md px-3 py-2 w-72 focus:ring focus:ring-blue-500 focus:outline-none"
                    />

                    <button
                        onClick={handleSave}
                        className="mt-2 px-2 py-2 bg-blue-500 text-white rounded"
                    >
                        Save
                    </button>
                </div>
            ) : (
                // Mode lecture : afficher la liste des diplômes
                <>
                    <ul className="list-disc ml-14">
                        {data.data.diplomes.map((diplome) => (
                            <li key={diplome.id}>{diplome.nom || "Nom non disponible"}</li>
                        ))}
                        <hr className="mt-1 mb-1"/>
                        {Array.isArray(data.data.autresDiplomes) && data.data.autresDiplomes.length > 0 && (
                            <>
                                Autres diplomes : <br />
                                {data.data.autresDiplomes.map((autreDiplome) => (
                                
                                    <li key={autreDiplome.id} className="mt-1">
                                        {autreDiplome.name || "Nom de diplôme non précisé"} {/* Afficher le nom du diplôme */}
                                    </li>
                                ))}
                            </>
                        )}
                    </ul>

                </>
            )}

            {/* Bouton pour basculer entre les modes */}
            <div className="absolute top-0 right-0 p-2">
                    <button onClick={toggleEditMode}>
                        <img
                            src={Modify}
                            alt="Icône"
                            className="h-6 w-6 text-gray-600"
                        />
                    </button>
            </div>
        </div>
    );
};

export default DiplomeData;
