import React from "react";

const PersoData = ({
    formData,
    handleInputChange,
    handleOtherNationaliteChange,
    getFinalNationalite,
    errors
}) => {
    return (
        <div className="p-6 bg-gray-50 mt-2">
            <div className="text-center text-xl font-bold mb-2">
                <b><h1>DONNÉES PERSONNELLES</h1></b>
            </div>

            {/* Appelation */}
            <div className="flex mt-2 ml-20">
                <div className="ml-12">
                    <label htmlFor="Appelation" className="mt-2 mr-5 py-3">
                        Appelation :
                    </label>
                    <input
                        type="text"
                        name="appelation"
                        id="appelation"
                        value={formData.appelation}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ml-10"
                        placeholder="Entrez votre texte"
                        aria-describedby="error-appelation"
                    /> <br />
                    {errors.appelation && <span id="error-appelation" className="text-red-500">{errors.appelation}</span>}
                </div>
            </div>

            {/* Name and Prénom */}
            <div className="flex mt-2 ml-20">
                <div className="ml-10 mr-20">
                    <label htmlFor="Nom" className="mt-2 mr-8 py-5">Nom :</label>
                    <input
                        disabled
                        type="text"
                        name="Nom"
                        id="Nom"
                        value={formData.Nom}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ml-20"
                        placeholder="Entrez votre texte"
                        aria-describedby="error-nom"
                    /><br />
                    {/* {errors.Nom && <span id="error-nom" className="text-red-500">{errors.Nom}</span>} */}
                </div>
                <div>
                    <label htmlFor="Prenom" className="mt-2 mr-5 px-2">Prénom :</label>
                    <input
                        disabled
                        type="text"
                        name="Prenom"
                        id="Prenom"
                        value={formData.Prenom}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Entrez votre texte"
                        aria-describedby="error-prenom"
                    /><br />
                    {/* {errors.Prenom && <span id="error-Prenom" className="text-red-500">{errors.Prenom}</span>} */}
                </div>
            </div>

            {/* Date de naissance */}
            <div className="flex mt-2 ml-20">
                <div className="ml-10 mr-16">
                    <label htmlFor="date_naissance" className="mt-2 w-32 py-5 mr-4">Date de naissance :</label>
                    <input
                        type="date"
                        name="date_naissance"
                        id="date_naissance"
                        value={formData.date_naissance}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-describedby="error-date_naissance"
                    /><br />
                    {errors.date_naissance && <span id="error-date_naissance" className="text-red-500">{errors.date_naissance}</span>}
                </div>
                <div className="ml-20">
                    <label htmlFor="genre" className="mb-2 ml-14 mr-10">Genre :</label>
                    <select
                        id="genre"
                        name="genre"
                        value={formData.genre}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="" disabled>Choisir un genre</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                    </select><br />
                    {errors.genre && <span className="text-red-500">{errors.genre}</span>}
                </div>
            </div>

            {/* Adresse */}
            <div className="flex mt-2 ml-20">
                <div className="ml-11 mr-20">
                    <label htmlFor="Adresse" className="mt-2 mr-5 py-3">Adresse :</label>
                    <input
                        type="text"
                        name="adress"
                        id="adress"
                        value={formData.adress}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 ml-16"
                        placeholder="Entrez votre texte"
                        aria-describedby="error-adress"
                    /><br />
                    {errors.adress && <span id="error-adress" className="text-red-500">{errors.adress}</span>}
                </div>
            </div>

            {/* Nationalité */}
            <div className="flex mt-2 ml-20">
                <div className="ml-10 mr-5">
                    <label htmlFor="nationalite" className="mb-2 mr-20">Nationalité :</label>
                    <select
                        id="nationalite"
                        name="nationalite"
                        value={formData.nationalite}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
                    >
                        <option value="" disabled>-</option>
                        <option value="Malagasy">Malagasy</option>
                        <option value="Autres">Autres</option>
                    </select><br />
                    {errors.nationalite && <span className="text-red-500 mt-1 block">{errors.nationalite}</span>}
                </div>

                {/* Autres Nationalité */}
                <input
                    type="text"
                    disabled={formData.nationalite !== "Autres"}
                    id="autresNationalite"
                    name="autresNationalite"
                    value={formData.autresNationalite}
                    onChange={handleOtherNationaliteChange}
                    className={`border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 ml-6 ${formData.nationalite !== "Autres" ? "bg-gray-100" : ""}`}
                    placeholder="Précisez ici votre nationalité"
                /><br />
                {errors.autresNationalite && <span className="text-red-500 mt-1 block">{errors.autresNationalite}</span>}
            </div>

        </div>
    );
};

export default PersoData;
