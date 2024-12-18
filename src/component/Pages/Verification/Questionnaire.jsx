import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store";
import useAuthStore from "../../ZustandFile/AuthStore";
import { useLocation } from "react-router-dom";
import { data } from "jquery";

const Questionnaire = () => {
    const {
        fetchdataToVerified,
        dataToVerified,
        loading,
        error,
        districtExists,
        communeExists,
        fokontanyExists,
        verifyDistrict,
        verifyCommune,
        verifyFokontany,
        VerificationErrorMessage,
        setVerificationErrorMessage
    } = useStore();

    const [results, setResults] = useState([]); // Résultats filtrés
    const [searchQuery, setSearchQuery] = useState(""); // Requête de recherche
    const { BasicId } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(1); // Étape actuelle
    const [district, setDistrict] = useState(""); // District sélectionné
    const [commune, setCommune] = useState(""); // Commune sélectionnée
    const [fokontany, setFokontany] = useState(""); // Fokontany sélectionné

    const dataFromPreviousPage = location.state;
    console.log(dataFromPreviousPage.data.id)
    useEffect(() => {
        if (!BasicId) {
            navigate("/login");
        }
    }, [BasicId, navigate]);

    useEffect(() => {
        if (VerificationErrorMessage) {
            const timer = setTimeout(() => {
                setVerificationErrorMessage(null); // Réinitialiser après 3 secondes
            }, 3000);
    
            return () => clearTimeout(timer); // Nettoyer le timer si le composant est démonté
        }
    }, [VerificationErrorMessage]);
    

    useEffect(() => {
        console.log("Message d'erreur mis à jour :", VerificationErrorMessage);
    }, [VerificationErrorMessage]);
    
    useEffect(() => {
        fetchdataToVerified();
    }, [fetchdataToVerified]);
    

    // Validation des étapes
    const handleVerifyDistrict = async () => {
        if (district && district.id) {
            await verifyDistrict(district.name);
            if (districtExists) {
                setSearchQuery(""); // Réinitialiser la recherche pour la prochaine étape
                useStore.getState().resetVerificationState();
                setStep(2);
            }
        } else {
            console.log("District invalide");
        }
    };

    const handleVerifyCommune = async () => {
        if (!commune || !district) {
            useStore.getState().setVerificationErrorMessage("Veuillez sélectionner un district et une commune.");
            return;
        }
    
        const communeData = {
            district: district.name,
            commune: commune.name,
            id: dataFromPreviousPage.data.id,
        };
    
        await verifyCommune(communeData);
    
        if (communeExists) {
            setSearchQuery("");
            setStep(3);
        } else {
            // Attendre 3 secondes avant de réinitialiser le message
            setTimeout(() => {
                useStore.getState().resetVerificationState();
            }, 3000);
        }
    };
    

    const handleVerifyFokontany = async () => {
    
        if (fokontany && commune) {
            const fokontanyData = {
                fokontany_commune_id: fokontany.commune_id,
                commune: commune.name,
                fokontany: fokontany.name,
                id: dataFromPreviousPage.data.id,
            };
    
            await verifyFokontany(fokontanyData);
    
            if (fokontanyExists) {
                navigate("/membership", { state: dataFromPreviousPage });
            }
        } else {
            console.log("Fokontany ou Commune invalide");
        }
    };

    

    // Mise à jour des résultats filtrés pour chaque étape
    useEffect(() => {
        if (dataToVerified) {
            let data = [];
            if (step === 1 && dataToVerified.districts) {
                data = dataToVerified.districts;
            } else if (step === 2 && dataToVerified.communes) {
                data = dataToVerified.communes;
            } else if (step === 3 && dataToVerified.fokontanys) {
                data = dataToVerified.fokontanys;
            }
            // Filtrer selon la recherche
            const filteredResults = data.filter((item) =>
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setResults(filteredResults);
        }
    }, [dataToVerified, step, searchQuery]);
    console.log("État loading :", loading);


    if (loading) {
        return <div>Chargement des données...</div>;
    }

    if (error) {
        return <div>Erreur : {error}</div>;
    }

    return (
        <div className="mt-28">
            <h1 className="text-2xl font-bold mb-6">Questionnaire de Vérification</h1>
            
            {/* Étape 1 : District */}
            {step === 1 && (
                <StepComponent
                    title="Étape 1 : Sélectionner un District"
                    placeholder="Sélectionnez un district"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedValue={district}
                    setSelectedValue={setDistrict}
                    results={results}
                    handleVerify={handleVerifyDistrict}
                />
            )}

            {/* Étape 2 : Commune */}
            {step === 2 && (
                <StepComponent
                    title="Étape 2 : Sélectionner une Commune"
                    placeholder="Sélectionnez une commune"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedValue={commune}
                    setSelectedValue={setCommune}
                    results={results}
                    handleVerify={handleVerifyCommune}
                    verificationErrorMessage={VerificationErrorMessage}
                />
            )}

            {/* Étape 3 : Fokontany */}
            {step === 3 && (
                
                <StepComponent
                    title="Étape 3 : Sélectionner un Fokontany"
                    placeholder="Sélectionnez un fokontany"
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    selectedValue={fokontany}
                    setSelectedValue={setFokontany}
                    results={results}
                    handleVerify={handleVerifyFokontany}
                    verificationErrorMessage={VerificationErrorMessage}
                />
                
            )}

            
        </div>
    );
};

// Composant pour chaque étape
const StepComponent = ({
    title,
    placeholder,
    searchQuery,
    setSearchQuery,
    selectedValue,
    setSelectedValue,
    results,
    handleVerify,
    verificationErrorMessage
}) => {
    return (
        <div className="bg-white shadow-md rounded-md p-6 max-w-md mx-auto">
            {verificationErrorMessage && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
                    {verificationErrorMessage}
                </div>
            )}


            <h2 className="text-xl font-semibold mb-4">{title}</h2>
            
            {/* Barre de recherche */}
            <div className="mb-4">
                <label htmlFor="search" className="block text-gray-700 mb-2">
                    Rechercher
                </label>
                <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher une option..."
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
                {/* Résultats filtrés sous l'input */}
                {results.length > 0 && (
                    <ul className="mt-2 bg-white border border-gray-300 rounded-md max-h-40 overflow-y-auto">
                        {results.map((result) => (
                            <li
                                key={result.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelectedValue(result); // Mettre à jour la sélection
                                    setSearchQuery(result.name); // Mettre à jour la barre de recherche
                                }}
                            >
                                {result.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Liste déroulante */}
            <div className="mb-4">
                <label htmlFor="selection" className="block text-gray-700 mb-2">
                    {placeholder}
                </label>
                <select
                    id="selection"
                    value={JSON.stringify(selectedValue)}
                    onChange={(e) => setSelectedValue(JSON.parse(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                    <option value="">-- Choisir une option --</option>
                    {results.map((result) => (
                        <option key={result.id} value={JSON.stringify(result)}>
                            {result.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Bouton Valider */}
            <button
                onClick={handleVerify}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                disabled={!selectedValue} // Désactivation si aucune valeur n'est sélectionnée
            >
                Valider
            </button>

        </div>
    );
};

export default Questionnaire;
