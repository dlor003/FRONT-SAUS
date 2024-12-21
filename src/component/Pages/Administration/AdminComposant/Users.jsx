import React, { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAdminStore from "../../../ZustandFile/AdminStore";

const Users = ({ users }) => {
    const [currentPage, setCurrentPage] = useState(1); // Page actuelle
    const [searchTerm, setSearchTerm] = useState(""); // Texte dans la barre de recherche
    const [filterBlocked, setFilterBlocked] = useState(false); // Filtrer par utilisateurs bloqués
    const {fetchOneUser, unBlockUser, unBlockSuccess} = useAdminStore();
    const navigate = useNavigate(); // Hook pour la navigation

    const usersPerPage = 10; // Nombre d'utilisateurs par page
    const startIndex = (currentPage - 1) * usersPerPage; // Calcul de l'index de début
    const endIndex = startIndex + usersPerPage; // Calcul de l'index de fin

    // Filtrer les utilisateurs par recherche et bloqué/non-bloqué
    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.nom.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesBlocked = filterBlocked ? user.is_blocked : true;
        return matchesSearch && matchesBlocked;
    });

    // Extraire les utilisateurs pour la page courante
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // Calcul du nombre total de pages
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    // Fonction pour changer de page
    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Fonction pour gérer la recherche
    const handleSearch = () => {
        setCurrentPage(1); // Revenir à la première page après une recherche
    };

    // Fonction pour basculer le filtre (bloqués/non-bloqués)
    const toggleFilterBlocked = () => {
        setFilterBlocked(!filterBlocked);
        setCurrentPage(1); // Revenir à la première page après un changement de filtre
    };

    const handleViewUser = (id) => {
        fetchOneUser(id);
        navigate(`/UserProfil/${id}`);
    };
    

    // Fonction pour débloquer un utilisateur
    const handleUnblockUser = (id) => {
        unBlockUser(id);
        // Ici, ajoutez la logique pour débloquer l'utilisateur via une requête API ou autre
    };

    return (
        <div>
            {unBlockSuccess && (
                <div
                className={`mt-2 text-center text-sm p-4 rounded-lg shadow-md ${unBlockSuccess.includes("succès") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                    {unBlockSuccess}
                </div>
              
            )}
            {/* Titre et options */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Les utilisateurs</h2>

                {/* Barre de recherche */}
                <div className="flex items-center gap-4">
                     {/* Filtre : Tous les utilisateurs / Utilisateurs bloqués */}
                    <div className="mb-1 flex justify-end">
                        <button
                            onClick={toggleFilterBlocked}
                            className={`px-4 py-1 rounded border ${
                                filterBlocked
                                    ? "bg-red-500 text-white hover:bg-red-600"
                                    : "bg-gray-300 text-gray-700 hover:bg-gray-400"
                            }`}
                        >
                            {filterBlocked
                                ? "Afficher tous les utilisateurs"
                                : "Afficher les utilisateurs bloqués"}
                        </button>
                    </div>
                    
                    <input
                        type="text"
                        placeholder="Rechercher par nom"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="p-2 border rounded w-64"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
                    >
                        <MagnifyingGlassIcon className="h-5 w-5 text-white" />
                    </button>
                </div>
            </div>

           

            {/* Tableau des utilisateurs */}
            <table className="w-full bg-white border rounded-lg mr-20">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2">ID</th>
                        <th className="p-2">Nom</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Statut</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers && paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user) => (
                            <tr key={user.id} className="text-center border-b">
                                <td className="p-2">{user.id}</td>
                                <td className="p-2">{user.nom}</td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">
                                    {user.is_blocked ? "Bloqué" : "Actif"}
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleViewUser(user.personnel.id)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Voir
                                    </button>
                                    {filterBlocked && user.is_blocked && (
                                        <button
                                            onClick={() => handleUnblockUser(user.id)}
                                            className="ml-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                        >
                                            Débloquer
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="p-4 text-center">
                                Aucun utilisateur trouvé.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Pagination */}
            {filteredUsers.length > usersPerPage && (
                <div className="mt-2 flex justify-center items-center gap-4">
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 border rounded ${
                            currentPage === 1
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        Précédent
                    </button>
                    <span>
                        Page {currentPage} sur {totalPages}
                    </span>
                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 border rounded ${
                            currentPage === totalPages
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                        Suivant
                    </button>
                </div>
            )}
        </div>
    );
};

export default Users;
