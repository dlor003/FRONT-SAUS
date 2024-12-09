import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Section = ({ formData, handleInputChange, errors }) => {
    const [sections, setSections] = useState([]); // Initialiser comme un tableau vide

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/sections');
                console.log('Données récupérées :', response.data); // Debug des données
                setSections(response.data.section); // Accéder à la clé "section"
            } catch (error) {
                console.error('Erreur lors de la récupération des sections :', error.message);
            }
        };

        fetchSections();
    }, []);

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
        </div>
    );
};

export default Section;
