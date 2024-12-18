import React from "react";
import useAdminStore from "../../../ZustandFile/AdminStore";

const Demandes = ({ data }) => {
    const { traiterDemande } = useAdminStore();
    const demandes = data || []; // Assurez-vous que 'demandes' est bien un tableau

    const handleTraiter = async (id) => {
        try {
            const message = await traiterDemande(id); // Traiter la demande
            alert(message); // Afficher un message de succès
        } catch (error) {
            console.error("Erreur lors du traitement de la demande :", error);
        }
    };

    const handleRejeter = async (id) => {
        try {
            const message = await traiterDemande(id); // Traiter la demande
            alert(message); // Afficher un message de succès
        } catch (error) {
            console.error("Erreur lors du traitement de la demande :", error);
        }
    };

    // Vérifier si toutes les demandes ont le statut "traitee"
    const toutesTraitees = demandes.every(demande => demande.status === "traitee");

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Les demandes</h2>
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
                    {demandes.map((demande) => (
                        demande.status !== "traitee" && ( // Vérifiez si le statut n'est pas "traitee"
                            <tr key={demande.id} className="text-center border-t">
                                <td className="p-2">{demande.id}</td>
                                <td className="p-2">{demande.personnel.appelation}</td>
                                <td className="p-2">{demande.status}</td>
                                <td className="p-2">
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                        onClick={() => handleTraiter(demande.id)}
                                    >
                                        Valider
                                    </button>
                                    <button 
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleRejeter(demande.id)}
                                    >
                                        Refuser
                                    </button>
                                </td>
                            </tr>
                        )
                    ))}

                    {/* Affiche un message si toutes les demandes ont le statut "traitee" */}
                    {toutesTraitees && (
                        <tr className="text-center border-t">
                            <td colSpan="4" className="p-2">Aucune demande à traiter pour le moment</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Demandes;
