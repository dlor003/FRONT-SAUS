import React, { useState, useEffect } from "react";
import GetStore from "../../ZustandFile/GetStore";
import Modify from "../../../assets/Modify.svg";
import { event } from "jquery";

const PolesData = ({data, onUpdate}) => {
    const { fetchAllData, getPoles, loading, error } = GetStore();
    const [tables, setTables] = useState(Array(2).fill({ value: "" })); // Valeur initiale vide
    const poles = getPoles();
    const [isEditing, setIsEditing] = useState(false);
    const polesData = data;

    useEffect(() => {
        fetchAllData(); // Récupérer toutes les données au montage du composant
    }, []);

    // Lorsque vous activez le mode édition, initialisez les tables avec les valeurs de polesData
    useEffect(() => {
        if (isEditing && polesData) {
            const updatedTables = tables.map((table, index) => ({
                ...table,
                value: polesData[index] ? polesData[index].id : "", // Assigner l'id du poleData à la valeur
            }));
            setTables(updatedTables);
        }
    }, [isEditing, polesData]);

    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    // Fonction pour gérer les changements dans les champs de sélection
    const handleSelectChange = (event, index) => {
        const newTables = [...tables];
        newTables[index] = { ...newTables[index], value: event.target.value }; // Mettre à jour la valeur du champ
        setTables(newTables);
    };

    const handleSubmit = (event) =>
    {
        event.prevent.default()
        const formattedData = {
            PolesSearch: tables.map((table) => ({
                id: table.value, // Utilisez table.value pour obtenir l'ID sélectionné
            })),
    
        }
    } 

    return (
        <div className="relative bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4 text-center">PÔLE DE RECHERCHE</h3>

            {isEditing ? (
                <div>
                    <form onSubmit={handleSubmit}>
                        {tables.map((table, index) => (
                            <div className="flex mt-2 ml-20" key={table.id || index}>
                                <div>
                                    <label htmlFor={`table${index + 1}`} className="mb-2 ml-10 mr-5">
                                        Pôle {index + 1} :
                                    </label>
                                    <select
                                        id={`table${index + 1}`}
                                        name={`table${index + 1}`}
                                        value={table.value || ""}
                                        onChange={(e) => handleSelectChange(e, index)}
                                        className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
                                    >
                                        <option value="" disabled>
                                            -
                                        </option>
                                        {poles.map((option) => (
                                            <option key={option.id} value={option.id}>
                                                {option.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                        <button
                                type="submit"
                                className="bg-green-500 text-white rounded-lg px-4 py-1 hover:bg-green-600"
                        >
                            Sauver
                        </button>
                    </form>
                    
                </div>
            ) : (
                <div>
                    <ul className="list-disc ml-14">
                        {polesData.map((poleData) => (
                            <li key={poleData.id}>{poleData.nom}</li>
                        ))}
                    </ul>
                </div>
            )}

            <button className="absolute top-0 right-0 p-2" onClick={toggleEditMode}>
                <img src={Modify} alt="Icône" className="h-6 w-6 text-gray-600" />
            </button>
        </div>
    );
};

export default PolesData;
