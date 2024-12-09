import React, { useState } from 'react';

const Diplome = ({ onDiplomeChange, errors }) => {
    const [selectedDiplomes, setSelectedDiplomes] = useState([]);
    const [autreDiplome, setAutreDiplome] = useState("");

    const diplomeOptions = [
        { id: "licence", label: "Premier cycle - Licence" },
        { id: "master", label: "Deuxième cycle - Master" },
        { id: "doctorat", label: "Troisième cycle - Doctorat ou plus" },
        { id: "autres", label: "Autres" },
    ];

    const handleCheckboxChange = (id, checked) => {
        let updatedDiplomes = [...selectedDiplomes];

        if (checked) {
            updatedDiplomes.push(id);
        } else {
            updatedDiplomes = updatedDiplomes.filter((item) => item !== id);
        }

        setSelectedDiplomes(updatedDiplomes);
        onDiplomeChange(updatedDiplomes, autreDiplome);
    };

    const handleAutreDiplomeChange = (e) => {
        const value = e.target.value;
        setAutreDiplome(value);
        onDiplomeChange(selectedDiplomes, value);
    };

    return (
        <div className="p-6 bg-gray-50 mt-2">
            <div className="text-center text-xl font-bold mb-2">
                <b> <h1>DIPLÔME UNIVERSITAIRE</h1> </b>
            </div>
                <div className="space-y-4">
                    {diplomeOptions.map((option) => (
                        <div key={option.id} className="flex space-x-4 justify-start mt-2 ml-20">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id={option.id}
                                    className="form-checkbox h-5 w-5 text-blue-600 ml-10"
                                    checked={selectedDiplomes.includes(option.id)}
                                    onChange={(e) => handleCheckboxChange(option.id, e.target.checked)}
                                />
                                <span className="text-gray-800">{option.label}</span>
                            </label>

                            {option.id === "autres" && selectedDiplomes.includes("autres") && (
                                <input
                                    type="text"
                                    value={autreDiplome || ""}
                                    onChange={handleAutreDiplomeChange}
                                    placeholder="Précisez votre diplôme"
                                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:ring focus:ring-blue-500 focus:outline-none"
                                />
                            )}
                        </div>
                    ))}
                    {/* Display error message for diplome */}
                    {errors.diplome && <div className="text-red-500 mt-2">{errors.diplome}</div>}
                </div>
        </div>
    );
};

export default Diplome;
