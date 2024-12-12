import React, { useEffect } from "react";
import GetStore from "../ZustandFile/GetStore";

const ResearchPole = ({ formData, handleInputChange, errors }) => {
    const { fetchAllData, getPoles, loading, error } = GetStore();

    useEffect(() => {
        fetchAllData(); // Fetch all data when the component mounts
    }, []);

    const poles = getPoles(); // Get poles from the store

    return (
        <div className="p-6 bg-gray-50 mt-2">
            <div className="text-center text-xl font-bold mb-2">
                <b>
                    <h1>PÔLE DE RECHERCHE</h1>
                </b>
            </div>

            {/* Show global error if no pole is selected */}
            {errors.poles && (
                <p className="text-red-500 text-sm mb-4 text-center">{errors.poles}</p>
            )}

            {/* Show loading spinner if data is loading */}
            {loading && <p className="text-center text-blue-500">Loading poles...</p>}

            {/* Show error message if there was an error fetching poles */}
            {error && (
                <p className="text-center text-red-500">
                    There was an error fetching poles: {error}
                </p>
            )}

            {/* Generate dynamic select fields for each pole */}
            {formData.poles.map((pole, index) => (
                <div className="flex mt-2 ml-20" key={pole.id || index}>
                    <div>
                        <label htmlFor={`pole${index + 1}`} className="mb-2 ml-10 mr-5">
                            Pôle {index + 1} :
                        </label>
                        <select
                            id={`pole${index + 1}`}
                            name={`pole${index + 1}`}
                            value={pole.value || ""}
                            onChange={handleInputChange}
                            className={`border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-64 ${
                                errors[`pole${index + 1}`] ? "border-red-500" : ""
                            }`}
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
                        {errors[`pole${index + 1}`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`pole${index + 1}`]}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResearchPole;
