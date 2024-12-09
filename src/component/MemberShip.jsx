import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import PersoData from "./Form/PersoData";
import Diplome from "./Form/Diplome";
import Member from "./Form/Member";
import Contact from "./Form/Contact";
import ResearchPole from "./Form/ResearchPole";
import Section from "./Form/Section";
import ActivityProfesionnal from "./Form/ActivityProfesionnal";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Membership = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const   navigate = useNavigate();
    const [formData, setFormData] = useState({
        appelation: "",
        Nom: "",
        Prenom: "",
        date_naissance: "",
        genre: "",
        adress: "",
        nationalite: "",
        autresNationalite: "",
        telephone: "",
        email: "",
        diplome: [],
        autreDiplome: "", // Gère la valeur saisie pour "Autres"
        poles: Array(2).fill({ name: "" }), // Initialisez avec 2 objets
        section: "",
        profession: "",
        domain: "",
        date_inscription: "",
        membre_Actif: false,
        membre_sympathisant: false,
    });
    const [errors, setErrors] = useState({});


    // Handle changes in the text input
    const handleOtherNationaliteChange = (e) => {
        const { value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            autresNationalite: value,
        }));
    };

    // Get the final value for nationalité
    const getFinalNationalite = () =>
        formData.nationalite === "Autres" ? formData.autresNationalite : formData.nationalite;

    const updatePoles = (name, value) => {
        const newPoles = [...formData.poles];
        const index = parseInt(name.replace('pole', '')) - 1;
        newPoles[index] = { value };
        return newPoles;
    };
    // Fonction de gestion des cases à cocher
    const handleCheckboxChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

     // Handle changes in the select
     const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Si c'est un champ de type 'pole', on met à jour le tableau des pôles
        if (name.startsWith("pole")) {
            setFormData((prevData) => ({
                ...prevData,
                poles: updatePoles(name, value),
            }));
        } else {
            // Pour les autres champs (ex : nationalite), on utilise la logique existante
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
                ...(name === "nationalite" && value !== "Autres" ? { autresNationalite: "" } : {}),
            }));
        }

        // Efface les erreurs pour ce champ
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: undefined,
            ...(name === "nationalite" && value !== "Autres" ? { autresNationalite: undefined } : {}),
        }));
        
    };

    const validateForm = () => {
        const errors = {}; // Collect all errors here.
        const validGenres = ["homme", "femme"]; // Valeurs autorisées
        const validSections = ["Antananarivo", "Toamasina", "Mahajanga", "Fianarantsoa", "Toliara", "Antsiranana"]
        const validProfession = ["Etudiant", "Retraité", "Recherche emploi", "Salarié", "Indépendant"]
    
        // Example validations
        if (!formData.appelation.trim()) errors.appelation = "Appelation is required.";
        if (!formData.Nom.trim()) errors.Nom = "Last name is required.";
        if (!formData.Prenom.trim()) errors.Prenom = "First name is required.";
        if (!formData.date_naissance.trim()) errors.date_naissance = "Date of birth is required.";
        if (!formData.telephone.trim()) errors.telephone = "Phone number is required.";
        if (!formData.adress.trim()) errors.adress = "adress is required.";
        if (!formData.domain.trim()) errors.domain = "domain is required.";
        if (formData.diplome.length === 0) errors.diplome = "At least one diploma is required.";
        
        // Vérifie que l'utilisateur a coché au moins un type de membre
        if (!formData.membre_Actif && !formData.membre_sympathisant) {
            errors.member = "Au moins un type de membre doit être sélectionné.";
        }

        // Vérification des diplômes
        if (formData.diplome.length === 0 && !(formData.diplome.includes("autres") && formData.autreDiplome.trim() !== "")) {
            errors.diplome = "At least one diploma must be selected or entered if 'Autres' is chosen.";
        }

        if (!formData.email.trim()) {
            errors.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            errors.email = "Invalid email format.";
        }        

         // Vérifier si "genre" est vide
        if (!formData.genre.trim()) {
            errors.genre = "Genre is required.";
        } else {
            // Vérifier si "genre" est valide
            const validGenres = ["homme", "femme"];
            if (!validGenres.includes(formData.genre.trim().toLowerCase())) {
                errors.genre = "Genre must be 'homme' or 'femme'.";
            }
        }

        // Vérifier si "genre" est vide
        if (!formData.profession.trim()) {
            errors.profession = "Profession is required.";
        } else {
            // Vérifier si "genre" est valide
            const validProfession = ["Etudiant", "Retraité", "Recherche emploi", "Salarié", "Indépendant"];
            if (!validProfession.includes(formData.profession.trim())) {
                errors.profession = "profession must be Etudiant, Retraité, Recherche emploi.";
            }
        }

         // Vérifier si "section" est vide
        if (!formData.section.trim()) {
            errors.section = "Section is required.";
        }


        // Validation pour nationalité
        if (!formData.nationalite.trim()) {
            errors.nationalite = "La nationalité est requise.";
        } else if (formData.nationalite === "Autres" && !formData.autresNationalite.trim()) {
            errors.autresNationalite = "Veuillez préciser votre nationalité.";
        }

        const hasAtLeastOnePole = formData.poles.some((pole) => pole.value && pole.value.trim() !== "");
        if (!hasAtLeastOnePole) {
            errors.poles = "Veuillez sélectionner au moins un pôle de recherche.";
        }

        // Vérifier si tous les champs sont remplis
        //  formData.poles.forEach((pole, index) => {
        //     if (!pole.value || pole.value.trim() === "") {
        //         errors[`pole${index + 1}`] = `Pôle ${index + 1} est vide.`;
        //     }
        // });

        // Vérifier les doublons
        const values = formData.poles.map((pole) => pole.value);
        const uniqueValues = new Set(values);
        if (values.length !== uniqueValues.size) {
            errors.poles = "Les pôles doivent être uniques.";
        }

        // Return errors object
        return errors;
    };
    

    

    // Fonction de mise à jour des diplômes
    const handleDiplomeChange = (diplomes, autreDiplome) => {
        setFormData({ ...formData, diplome: diplomes, autreDiplome });
    };

    // Fonction de soumission du formulaire
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // Active l'état "en cours de soumission"

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log("Form is valid. Submitting data:", formData);
            // Perform submission logic here

            // Créez une copie de `diplome` et ajoutez le champ "autreDiplome" si nécessaire
            let updatedDiplomes = [...formData.diplome];
            if (updatedDiplomes.includes("autres") && formData.autreDiplome.trim() !== "") {
                updatedDiplomes = updatedDiplomes.filter((diplome) => diplome !== "autres");
                updatedDiplomes.push(formData.autreDiplome.trim());
            }

            // Prépare les données à envoyer
            const dataToSend = {
                ...formData,
                diplome: updatedDiplomes,
            };

            try{
                const response = await axios.post("http://127.0.0.1:8000/api/INSCRIPTION-SAUS", dataToSend);
                console.log('Données enregistrer :', response.data); // Debug des données
                if (response.data && response.data.id) {
                    // Naviguer avec les données
                    navigate('/Register', { state: { userData: response.data } });
                  }
            }catch (error) {
                console.error('Erreur lors de la sauvegarde des donnees :', error.message);
            }

            

            console.log("Données envoyées :", dataToSend);
            // Ici tu peux envoyer `dataToSend` à une API via Axios ou Fetch

            setIsSubmitting(false); // Réactive le bouton une fois terminé
            

        }

        
    };

    return (
        <form onSubmit={handleSubmit }>
            <div className="bg-white shadow-lg rounded-lg p-6 " >
                {/* Logos et titre alignés horizontalement */}
                <div className="flex items-center justify-around mb-4">
                    {/* Logo gauche */}
                    <img src={logo} alt="Logo" className="w-48 h-42" />

                    {/* Titre */}
                    <div>
                        <h1 className="text-5xl font-bold text-gray-800">SAUS - Mada</h1><br />
                        <p className="text-2xl font-Bold text-gray-600 mt-4">
                            <b className="text-2xl font-bold text-gray-800">S</b>ociété des
                            <b className="text-2xl font-bold text-gray-800">A</b>cadémiciens et
                            <b className="text-2xl font-bold text-gray-800">U</b>niversitaires de la
                            <b className="text-2xl font-bold text-gray-800">S</b>ofia <br />
                            <b className="text-2xl font-bold text-gray-800">M</b>adagascar
                        </p>
                    </div>

                    {/* Logo droit */}
                    <img src={logo} alt="Logo" className="w-48 h-42" />
                </div>

                <div className="text-2xl font-bold text-gray-800">
                    Formulaire d’adhésion à la SAUS - Mada
                </div>

                <div className="ml-4 flex text-left text-lg leading-6 mt-3 mb-3">
                    Le présent formulaire consiste en une identiﬁcation et un engagement auquel le membre candidat doit
                    souscrire pour l’adhésion à la SAUS-Mada. <br />
                    Type d’adhésion (Cochez la case correspondante) :
                </div>

                <Member 
                    formData={formData} 
                    onCheckboxChange={handleCheckboxChange} 
                    errors={{ member: errors.member }}
                />

                <div className="ml-4 flex text-left text-lg leading-6 mt-3 mb-3">
                    Les membres actifs et sympathisants ont le droit de vote lors de l’Assemblée Générale.
                    Seuls les membres actifs ont le droit d’être candidat lors de l’élection des membres de Bureau Exécutif
                    et/ou de Conseil Scientiﬁque d’Orientation. Chaque membre dispose d’une voix.
                </div>

                <PersoData
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleOtherNationaliteChange={handleOtherNationaliteChange}
                    getFinalNationalite={getFinalNationalite}
                    errors={{
                        appelation: errors.appelation,
                        Nom: errors.Nom,
                        Prenom: errors.Prenom,
                        date_naissance: errors.date_naissance,
                        genre: errors.genre,
                        nationalite: errors.nationalite,
                        adress: errors.adress
                    }}
                />

                <Contact 
                    formData={formData} 
                    handleInputChange={handleInputChange}
                    errors={{ 
                        telephone: errors.telephone,
                        email: errors.email
                    }}
                />

                <Diplome 
                    onDiplomeChange={handleDiplomeChange} 
                    errors={{diplome: errors.diplome}}
                />

                <ResearchPole 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    errors={{
                        poles: errors.poles, // Spécifique pour les erreurs de pôles
                        ...Object.keys(errors).filter((key) => key.startsWith("pole")).reduce((acc, key) => {
                            acc[key] = errors[key];
                            return acc;
                        }, {})
                    }}
                />

                <Section 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    errors={{ section: errors.section}}
                />

                <ActivityProfesionnal 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    errors={{
                        profession: errors.profession,
                        domain: errors.domain
                    }}
                />

                <div className="p-6 bg-gray-50 mt-2">
                    <div className="flex mt-2 ml-20">
                        <div>
                            <label htmlFor="date_inscription" className="mb-2 mr-5">Date d'inscription :</label>
                            <input
                                type="date"
                                name="date_inscription"
                                value={formData.date_inscription}
                                onChange={handleInputChange}
                                className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="flex text-left text-lg leading-6 mt-3 mb-3 ml-20">
                        J’atteste avoir pris connaissance des statuts et du règlement intérieur de la SAUS – Mada et certiﬁe que
                        toutes les données apposées dans ce formulaire sont exactes et véridiques. <br />
                    </div>

                </div>

                <div className="text-center">
                    <button disabled={isSubmitting} // Désactive le bouton si isSubmitting est true
                        className={`bg-blue-500 text-white px-6 py-3 rounded-lg w-full mt-3 ${
                            isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                        }`}
                    >
                        <h2>Soumettre mon candidature</h2>
                    </button>
                </div>
            </div>
        </form>
    );
};

export default Membership;
