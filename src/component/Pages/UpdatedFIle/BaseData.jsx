import React, { useState } from "react";
import Modify from "../../../assets/Modify.svg";

const BaseData = ({ data, onUpdate }) => {

    const Donne = data.data;
    const [isEditing, setIsEditing] = useState(false); // État pour suivre le mode d'affichage
    const [formData, setFormData] = useState({
        nom: Donne.BodyData.nom,
        prenom: Donne.BodyData.prenom,
        appelation: Donne.BodyData.appelation,
        mail: Donne.BodyData.mail,
    }); // Stocker uniquement les champs nécessaires

    // Fonction pour basculer entre les modes d'édition et d'affichage
    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    // Gestionnaire pour mettre à jour les valeurs locales des champs
    const handleInputChange = (fieldName) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [fieldName]: event.target.value, // Met à jour uniquement le champ modifié
        }));
    };

    // Gestionnaire pour soumettre le formulaire
    const handleSubmit = (event) => {
        event.preventDefault(); // Empêche le rechargement de la page

        // Création de l'objet au format demandé
        const formattedData = {
            personnelData: { ...formData }, // Inclure uniquement les champs sélectionnés
        };

        console.log("Données formatées à envoyer :", formattedData);

        // Envoi de l'objet formaté
        onUpdate(formattedData);

        // Quitter le mode édition
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative flex items-center space-x-4">
                {/* Photo de profil */}
                {Donne.BodyDataprofile_picture ? (
                    <img
                        src={Donne.BodyDataprofile_picture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full"
                    />
                ) : (
                    <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600">No Image</span>
                    </div>
                )}

                {/* Informations utilisateur */}
                <div>
                    {isEditing ? (
                        // Afficher les données dans des champs de formulaire
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                                    Nom
                                </label>
                                <input
                                    type="text"
                                    name="nom"
                                    id="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange("nom")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                                    Prénom
                                </label>
                                <input
                                    type="text"
                                    name="prenom"
                                    id="prenom"
                                    value={formData.prenom}
                                    onChange={handleInputChange("prenom")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="appelation" className="block text-sm font-medium text-gray-700">
                                    Appelation
                                </label>
                                <input
                                    type="text"
                                    name="appelation"
                                    id="appelation"
                                    value={formData.appelation}
                                    onChange={handleInputChange("appelation")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="mail" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="mail"
                                    id="mail"
                                    value={formData.mail}
                                    onChange={handleInputChange("mail")}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600"
                                >
                                    Ajouter
                                </button>
                                <button
                                    onClick={toggleEditMode}
                                    type="button"
                                    className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 ml-20"
                                >
                                    Annuler
                                </button>
                            </div>
                        </form>
                    ) : (
                        // Afficher les données comme du texte statique
                        <div>
                            <p className="ml-10">
                                <strong>Nom : </strong> {formData.nom}
                            </p>
                            <p className="ml-10">
                                <strong>Prénom : </strong> {formData.prenom}
                            </p>
                            <p className="ml-10">
                                <strong>Appelation : </strong> {formData.appelation}
                            </p>
                            <p className="ml-10">
                                <strong>Email : </strong> {formData.mail}
                            </p>
                        </div>
                    )}
                </div>

                {/* Icône en haut à droite */}
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
        </div>
    );
};

export default BaseData;
