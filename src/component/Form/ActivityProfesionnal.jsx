import React from "react";

const ActivityProfesionnal = ({formData, handleInputChange, errors}) =>
{

    return (

        <div className="p-6 bg-gray-50 mt-2">
                <div className="text-center text-xl font-bold mb-2">
                    <b><h1>ACTIVITÉ PROFESSIONNELLE</h1></b>
                </div>

                <div className="flex mt-2 ml-20">
                    <div className="mr-20">
                        <label htmlFor="pole2" className="mb-2 ml-10 mr-5">Profession</label>
                        <select
                            id="profession"
                            name="profession"
                            value={formData.profession}
                            onChange={handleInputChange}
                            className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-128"
                        >
                            <option value="" disabled> - </option>
                            <option value="Etudiant">Étudiant(e)</option>
                            <option value="Retraité">Retraité(e)</option>
                            <option value="Recherche emploi">En recherche d'emploi</option>
                            <option value="Salarié">En activité</option>
                            <option value="Indépendant">Indépendant</option>
                        </select><br />
                        {errors.profession && <span className="text-red-500">{errors.profession}</span>}
                    </div>

                    <div className="ml-10">
                        <label htmlFor="domain" className="mt-2 mr-5 px-2">DOMAINE : </label>
                        <input
                            type="text"
                            id="domain"
                            name="domain"
                            value={formData.domain}
                            onChange={handleInputChange}
                            className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Entrez votre domaine" 
                            aria-describedby="error-domain"
                        /><br />
                        {errors.domain && <span id="error-domain" className="text-red-500">{errors.domain}</span>}
                    </div>
                </div>
            </div>
    )

}

export default ActivityProfesionnal