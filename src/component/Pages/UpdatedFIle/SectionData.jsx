import React, { useState, useEffect } from "react";
import GetStore from "../../ZustandFile/GetStore";
import Modify from "../../../assets/Modify.svg";

const SectionData = ({ data, onUpdate }) => {
    const { fetchAllData, getSections, loading, error } = GetStore();
    const [isEditing, setIsEditing] = useState(false);
    const [section, setSection] = useState(data);
    const sections = getSections(); // Obtenir les sections à partir du store

    useEffect(() => {
        fetchAllData(); // Récupérer toutes les données au montage du composant
    }, []);

    // Synchroniser l'état local avec les données parentales
    useEffect(() => {
        setSection(data);
    }, [data]);

    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    // Gestionnaire général pour mettre à jour les valeurs des champs
    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setSection((prev) => ({
            ...prev,
            [name]: value, // Mettre à jour la clé correspondant au nom du champ
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Création de l'objet au format demandé
        const formattedData = {
            sectionsData: { ...section },
        };


        // Envoi de l'objet formaté
        onUpdate(formattedData);

        // Quitter le mode édition
        setIsEditing(false);
    };

    return (
        <div className="relative bg-white rounded-lg shadow-md p-6">
            {isEditing ? (
                <>
                    <h3 className="text-xl font-semibold mb-4 text-center">SECTION</h3>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="section" className="mb-2 ml-10 mr-5">
                                SECTION :
                            </label>
                            <select
                                id="section"
                                name="id" // Correspond à la clé à mettre à jour dans l'état local
                                value={section.id || ""}
                                onChange={handleFieldChange}
                                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-128"
                            >
                                <option value="" disabled>
                                    -
                                </option>
                                {Array.isArray(sections) &&
                                    sections.map((sectionItem) => (
                                        <option key={sectionItem.id} value={sectionItem.id}>
                                            {sectionItem.nom}
                                        </option>
                                    ))}
                            </select>
                            <br />
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600"
                        >
                            Sauver
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-semibold mb-4 text-center">SECTION</h3>
                    <p className="ml-10">
                        <strong>Nom de la Section :</strong> {section.nom}
                    </p>
                </>
            )}
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

export default SectionData;
