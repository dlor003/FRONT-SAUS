import React, { useState, useEffect } from "react";
import GetStore from "../../ZustandFile/GetStore";
import Modify from "../../../assets/Modify.svg";

const ActivityData = ({ data, onUpdate }) => {
    const { fetchAllData, getActivity, loading, error } = GetStore();
    const [isEditing, setIsEditing] = useState(false);
    const [activities, setActivities] = useState(data); // 'data' est un tableau d'activités
    const [domain, setDomain] = useState("");
    const allActivities = getActivity(); // Obtenir toutes les activités à partir du store

    useEffect(() => {
        fetchAllData(); // Récupérer toutes les données au montage du composant

        // Initialiser le champ 'domain' si présent dans 'activities'
        if (data.length > 0) {
            setDomain(data[0].pivot?.domain || "");
        }
    }, [data]);

    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    // Mise à jour du domaine
    const handleDomainChange = (event) => {
        setDomain(event.target.value);

        // Mettre à jour le domaine pour la première activité
        setActivities((prev) => [
            {
                ...prev[0],
                pivot: {
                    ...prev[0]?.pivot,
                    domain: event.target.value,
                },
            },
            ...prev.slice(1), // Conserver le reste des activités
        ]);
    };

    // Mise à jour de l'activité sélectionnée
    const handleFieldChange = (event) => {
        const selectedId = parseInt(event.target.value, 10); // Convertir la valeur sélectionnée en nombre
        const selectedActivity = allActivities.find((activity) => activity.id === selectedId);

        if (selectedActivity) {
            // Mettre à jour l'activité principale (par ex. la première de la liste)
            setActivities((prev) => [
                {
                    ...selectedActivity,
                    pivot: {
                        ...prev[0]?.pivot,
                        domain: domain || "", // Garder le domaine ou une chaîne vide
                    },
                },
                ...prev.slice(1), // Conserver le reste des activités (s'il y en a)
            ]);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Formater les données pour l'envoi
        const formattedData = {
            ActivityData: activities.map((activity) => ({
                id: activity.id,
                domain: domain || "",
            })),
        };


        // Appeler le callback pour envoyer les données
        onUpdate(formattedData);

        // Quitter le mode édition
        setIsEditing(false);
    };

    const selectedActivity = activities[0] || null;

    return (
        <div className="relative bg-white rounded-lg shadow-md p-6">
            {isEditing ? (
                <>
                    <h3 className="text-xl font-semibold mb-4 text-center">
                        ACTIVITÉ PROFESSIONNELLE
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="activity" className="mb-2 ml-10 mr-5">
                                Activité :
                            </label>
                            <select
                                id="activity"
                                name="id"
                                value={selectedActivity ? selectedActivity.id : ""}
                                onChange={handleFieldChange}
                                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-128"
                            >
                                <option value="" disabled>
                                    -
                                </option>
                                {Array.isArray(allActivities) &&
                                    allActivities.map((activityItem) => (
                                        <option key={activityItem.id} value={activityItem.id}>
                                            {activityItem.nom}
                                        </option>
                                    ))}
                            </select>
                            <br />
                            <div className="ml-10">
                                <label htmlFor="domain" className="mt-2">
                                    Domaine :
                                </label>
                                <input
                                    type="text"
                                    id="domain"
                                    name="domain"
                                    value={domain}
                                    placeholder="Précisez votre domaine"
                                    onChange={handleDomainChange}
                                    className="mt-2 ml-10 border border-gray-300 rounded-md px-3 py-2 w-72 focus:ring focus:ring-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="bg-green-500 text-white rounded-lg px-4 py-1 hover:bg-green-600"
                        >
                            Sauver
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-semibold mb-4 text-center">
                        ACTIVITÉ PROFESSIONNELLE
                    </h3>
                    {activities.map((activity) => (
                        <div key={activity.id}>
                            <p className="ml-10">
                                Activité : <strong>{activity.nom}</strong>
                            </p>
                            <p className="ml-10">
                                Domaine : <strong>{activity.pivot?.domain}</strong>
                            </p>
                        </div>
                    ))}
                </>
            )}
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
    );
};

export default ActivityData;
