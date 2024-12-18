import React from "react";
import useAdminStore from "../../../ZustandFile/AdminStore";
import {useNavigate} from "react-router-dom";

const AddAdmin = ({ data }) => {
    const {fetchOneUser} = useAdminStore();
    const allAdmins = data?.AllAdmin || []; // Récupérer AllAdmin depuis les props
    const navigate = useNavigate();

    // Fonction à implémenter pour gérer la vue utilisateur
    const handleViewUser = (id) => {
        fetchOneUser(id);
        navigate(`/UserProfil/${id}`);
    };

    return (
        <div>
            <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Les Administrateur</h2>

                            {/* Barre de recherche */}
                            <div className="flex items-center gap-4">
                                
                                <input
                                    type="text"
                                    placeholder="Ajouter une nouveau admin"
                                    className="p-2 border rounded w-64"
                                />
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
                                >Ajouter
                                </button>
                            </div>
                        </div>
            <table className="w-full bg-white border rounded-lg mr-20">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">ID</th>
                        <th className="p-2">Utilisateur</th>
                        <th className="p-2">Statut</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {allAdmins.length > 0 ? (
                        allAdmins.map((admin) => (
                            <tr key={admin.id} className="text-center border-b">
                                <td className="p-2">{admin.id}</td>
                                <td className="p-2">{admin.personnel?.appelation || "Non défini"}</td>
                                <td className="p-2">
                                    {admin.roles === "admin" ? "Admin" : "Utilisateur"}
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleViewUser(admin.personnel.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Voir
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-4 text-center">
                                Aucun administrateur trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};



export default AddAdmin;
