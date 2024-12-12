import React, { useEffect, useState } from "react";
import GetStore from "../ZustandFile/GetStore";

const Diplome = ({ formData, errors, handleInputChange }) => {
    const { fetchAllData, getDiplomes, loading, error } = GetStore();
    const [autres, setAutres] = useState(false);

    useEffect(() => {
        fetchAllData();
    }, []);

    const diplomes = getDiplomes();


    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        console.log("Checkbox changée :", name, "Checked :", checked);
    
        if (name === "autres") {
        setAutres(checked);
        handleInputChange({
            target: {
            name: "autresDiplomes",
            value: checked ? formData.autresDiplomes : "",
            },
        });
        } else {
        const updatedDiplomes = checked
            ? [...formData.diplomes, parseInt(name)] // Convertir en entier si nécessaire
            : formData.diplomes.filter((diplomeId) => diplomeId !== parseInt(name));
        console.log("Diplômes mis à jour :", updatedDiplomes);
        handleInputChange({
            target: { name: "diplomes", value: updatedDiplomes },
        });
        }
    };
    
  

  return (
    <div className="p-6 bg-gray-50 mt-2">
      <div className="text-center text-xl font-bold mb-2">
        <b>
          <h1>DIPLÔME UNIVERSITAIRE</h1>
        </b>
      </div>

      <div className="space-y-4">
        {loading && <p>Chargement des diplômes...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {Array.isArray(diplomes) &&
            diplomes.map((option) => (
                <div
                key={option.id}
                className="flex space-x-4 justify-start mt-2 ml-20"
                >
                <label className="flex items-center space-x-2">
                    <input
                    type="checkbox"
                    name={option.id.toString()} // Assurez-vous que le type est cohérent
                    className="form-checkbox h-5 w-5 text-blue-600 ml-10"
                    checked={formData.diplomes.includes(option.id)}
                    onChange={handleCheckboxChange}
                    />
                    <span className="text-gray-800">{option.nom}</span>
                </label>
                </div>
            ))} 



        <div className="flex space-x-4 justify-start mt-2 ml-20">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="autres"
              className="form-checkbox h-5 w-5 text-blue-600 ml-10"
              checked={autres}
              onChange={handleCheckboxChange}
            />
            <span className="text-gray-800 ml-3 mb-3">Autres</span>
          </label>
        </div>

        {autres && (
          <input
            type="text"
            name="autresDiplomes" // Assurez-vous que ce nom correspond au champ
            value={formData.autresDiplomes || ""}
            placeholder="Précisez votre diplôme"
            onChange={handleInputChange}
            className=" ml-20 border border-gray-300 rounded-md px-3 py-2 w-72 focus:ring focus:ring-blue-500 focus:outline-none"
          />
        )}

        {errors.diplomes && (
          <div className="text-red-500 mt-2">{errors.diplomes}</div>
        )}
      </div>
    </div>
  );
};

export default Diplome;
