import React, {useState} from "react";
import Modify from "../../../assets/Modify.svg";

const PersoData = ({data, onUpdate}) => 
{   
    const Donne = data.data;
    const [isEditing, setIsEditing] = useState(false); // État pour suivre le mode d'affichage
    const [formData, setFormData] = useState({
        date_naissance: Donne.BodyData.date_naissance,
        nationalite: Donne.BodyData.nationalite,
        phone: Donne.BodyData.phone.toString(),
        adresse: Donne.BodyData.adresse,
        genre: Donne.BodyData.genre,
        
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

    return(
        <div>
            
            <div className="bg-white rounded-lg shadow-md p-6 relative">
                
                {isEditing ? 
                (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                                <h3 className="text-xl text-center font-semibold mb-4">DONNÉES PERSONNELLES </h3>

                                <div className="mb-4 flex items-center">
                                    <label htmlFor="date_naissance" className="text-sm font-medium text-gray-700 mr-2">
                                        <strong>Date de Naissance :</strong>
                                    </label>
                                    <input
                                        type="date"
                                        name="date_naissance"
                                        id="date_naissance"
                                        value={formData.date_naissance}
                                        onChange={handleInputChange("date_naissance")}
                                        className="mt-1 block w-32 py-2  rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                                    />
                                </div>

                                <div className="mb-4 flex items-center">
                                    <label htmlFor="nationalite" className="text-sm font-medium text-gray-700 mr-2">
                                        <strong>Nationalité :</strong>
                                    </label>
                                    <input
                                        type="text"
                                        name="nationalite"
                                        id="nationalite"
                                        value={formData.nationalite}
                                        onChange={handleInputChange("nationalite")}
                                        className="mt-1 block w-32 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                                    />
                                </div>

                                <div className="mb-4 flex items-center">
                                    <label htmlFor="phone" className="text-sm font-medium text-gray-700 mr-2">
                                        <strong>Téléphone :</strong>
                                    </label>
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange("phone")}
                                        className="mt-1 block w-32  py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
                                    />
                                </div>

                                <div className="mb-4 flex items-center">
                                    <label htmlFor="adresse" className="text-sm font-medium text-gray-700 mr-2">
                                        <strong>Adresse :</strong>
                                    </label>
                                    <input
                                        type="text"
                                        name="adresse"
                                        id="adresse"
                                        value={formData.adresse}
                                        onChange={handleInputChange("adresse")}
                                        className="mt-1 block w-32 py-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-gray-100"
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
                ) :(
                    <>
                        <h3 className="text-xl text-center font-semibold mb-4">DONNÉES PERSONNELLES </h3>
                        <p className="ml-10"><strong>Date de Naissance :</strong> {formData.date_naissance}</p>
                        <p className="ml-10"><strong>Genre :</strong> {formData.genre}</p>
                        <p className="ml-10"><strong>Nationalité :</strong> {formData.nationalite}</p>
                        <p className="ml-10"><strong>Téléphone :</strong> {formData.phone}</p>
                        <p className="ml-10"><strong>Adresse :</strong> {formData.adresse}</p>
                        
                    </>

                )}

                {/* Icône en haut à droite */}
                <div className=" absolute top-0 right-0 p-2">
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
        
    )

}

export default PersoData;