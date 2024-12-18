import React, { useState } from "react";
import Modify from "../../../assets/Modify.svg";
import useProfileStore from "../../ZustandFile/AuthStore"; // Import Zustand store

const BaseData = ({ data, onUpdate }) => {
  const Donne = data.data;

  // Zustand state
  const {
    profilePicture,
    updateProfileImage,
    loading,
    messages,
    setProfilePicture,
  } = useProfileStore();

  // État local pour le formulaire
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nom: Donne.BodyData.basic_data.nom,
    prenom: Donne.BodyData.basic_data.prenom,
    email: Donne.BodyData.basic_data.email,
    id: Donne.BodyData.basic_data.id,
  });

  // Basculer le mode édition
  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  // Mise à jour des champs de formulaire
  const handleInputChange = (fieldName) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: event.target.value,
    }));
  };

  // Soumission du formulaire
  const handleSubmit = (event) => {
    event.preventDefault();

    const formattedData = {
      BasicData: { ...formData },
    };

    console.log("Données formatées à envoyer :", formattedData);

    // Appeler la fonction onUpdate (peut être liée à une API)
    onUpdate(formattedData);

    // Quitter le mode édition
    setIsEditing(false);
  };

  // Gérer l'upload d'image
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      updateProfileImage({
        file,
        token: Donne.token, // Remplace par le token de ton utilisateur
        id: Donne.id, // Utilise l'ID de l'utilisateur
      });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="relative flex items-center space-x-4">
        {/* Profile Picture Component */}
        {/* Affichage de l'image de profil */}
        {Donne.profile_picture ? (
            <img
            src={Donne.profile_picture} // Utilise l'image de profil provenant des données
            alt="Profile"
            className="w-24 h-24 rounded-full"
            />
        ) : profilePicture ? (
            <img
            src={profilePicture} // Si aucune image dans Donne, utilise celle de Zustand
            alt="Profile"
            className="w-24 h-24 rounded-full"
            />
        ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
            <label className="flex flex-col items-center justify-center">
                <span className="text-gray-600">Upload Image</span>
                <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                />
            </label>
            </div>
        )}

        <div>
          {isEditing ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                  Nom
                </label>
                <input
                  type="text"
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
                  id="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange("prenom")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600"
                >
                  Enregistrer
                </button>
                <button
                  type="button"
                  onClick={toggleEditMode}
                  className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-red-600 ml-4"
                >
                  Annuler
                </button>
              </div>
            </form>
          ) : (
            <div>
              <p>
                <strong>Nom : </strong> {formData.nom}
              </p>
              <p>
                <strong>Prénom : </strong> {formData.prenom}
              </p>
              <p>
                <strong>Email : </strong> {formData.email}
              </p>
            </div>
          )}
        </div>

        <div className="absolute top-0 right-0 p-2">
          <button onClick={toggleEditMode}>
            <img src={Modify} alt="Modifier" className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Message d'état */}
      {messages && (
        <p className={`mt-4 text-sm ${loading ? "text-yellow-500" : "text-green-500"}`}>
          {messages}
        </p>
      )}
    </div>
  );
};

export default BaseData;
