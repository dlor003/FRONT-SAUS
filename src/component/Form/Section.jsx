import React, { useEffect } from "react";
import GetStore from "../ZustandFile/GetStore";

const Section = ({ formData, handleInputChange, errors }) => {
    const { fetchAllData, getSections , loading, error } = GetStore();

    useEffect(() => {
        fetchAllData(); // Récupérer toutes les données au montage du composant
    }, []);

    const sections = getSections(); // Obtenir les sections à partir du store


  return (
    <div className="p-6 bg-gray-50 mt-2">
      <div className="text-center text-xl font-bold mb-2">
        <h1><b>SECTION</b></h1>
      </div>

      <div className="flex mt-2 ml-20">
        <div>
          <label htmlFor="section" className="mb-2 ml-10 mr-5">SECTION :</label>
          <select
            id="section"
            name="section"
            value={formData.section}
            onChange={handleInputChange}
            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-128"
          >
            <option value="" disabled> - </option>
            {Array.isArray(sections) && sections.map((section) => (
              <option key={section.id} value={section.id}>
                {section.nom}
              </option>
            ))}
          </select><br />
          {errors.section && <span className="text-red-500">{errors.section}</span>}
        </div>
      </div>

      {/* Messages de chargement et d'erreur */}
      {loading && <p>Chargement des sections...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Section;
