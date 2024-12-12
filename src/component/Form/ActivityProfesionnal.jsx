import React, { useEffect } from "react";
import GetStore from "../ZustandFile/GetStore";

const ActivityProfesionnal = ({ formData, handleInputChange, errors }) => {
    const { fetchAllData, getActivity, loading, error } = GetStore();

    useEffect(() => {
        fetchAllData();
    }, []);

    const activity = getActivity();

    return (
        <div className="p-6 bg-gray-50 mt-2">
            <div className="text-center text-xl font-bold mb-2">
                <b>
                    <h1>ACTIVITÉ PROFESSIONNELLE</h1>
                </b>
            </div>

            <div className="flex mt-2 ml-20">
                <div className="mr-20">
                    <label htmlFor="activity" className="mb-2 ml-10 mr-5">
                        Activité
                    </label>
                    <select
                        id="activity"
                        name="activity"
                        value={formData.activity}
                        onChange={handleInputChange} // Met à jour formData.activity avec l'ID sélectionné
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-128"
                    >
                        <option value="" disabled>
                            {" "}
                            -{" "}
                        </option>
                        {activity.map((activities) => (
                            <option key={activities.id} value={activities.id}>
                                {activities.nom}
                            </option>
                        ))}
                    </select>
                    <br />
                    {errors.activity && (
                        <span className="text-red-500">{errors.activity}</span>
                    )}
                </div>

                <div className="ml-10">
                    <label htmlFor="domain" className="mt-2 mr-5 px-2">
                        Domaine :{" "}
                    </label>
                    <input
                        type="text"
                        id="domain"
                        name="domain"
                        value={formData.domain}
                        onChange={handleInputChange} // Met à jour formData.domain
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Entrez votre domaine"
                        aria-describedby="error-domain"
                    />
                    <br />
                    {errors.domain && (
                        <span id="error-domain" className="text-red-500">
                            {errors.domain}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityProfesionnal;
