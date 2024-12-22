import  { useState } from "react";
import useAdminStore from "../../../ZustandFile/AdminStore"; // Store Zustand
import { useNavigate } from "react-router-dom";

const PromoteUser = () => {
  const { promoteUser, searchUser, onAdminSuccess } = useAdminStore(); // Fonction Zustand : promouvoir et rechercher
  const [searchQuery, setSearchQuery] = useState(""); // Recherche utilisateur
  const [userResults, setUserResults] = useState([]); // Résultats de la recherche
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const [usersPerPage] = useState(10); // Nombre d'utilisateurs par page
  const [selectedUser, setSelectedUser] = useState(null); // Utilisateur sélectionné pour la modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Gestion de la modal

  // Gérer la recherche utilisateur
  const handleSearch = async () => {
    const results = await searchUser(searchQuery); // Appel à une fonction Zustand
    setUserResults(results); // Stocker les résultats
    setCurrentPage(1); // Réinitialiser à la première page après une recherche
  };

  // Ouvrir la modal pour un utilisateur donné
  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handlePromote = async () => {
    if (selectedUser) {
      await promoteUser(selectedUser.id); // Appel Zustand pour la promotion
      setIsModalOpen(false); // Fermer la modal après soumission
      await handleSearch(); // Rafraîchir les résultats après la promotion
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userResults.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(userResults.length / usersPerPage);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div>
      {onAdminSuccess && (
        <div
          className={`mt-2 text-center text-sm p-4 rounded-lg shadow-md ${
            onAdminSuccess.includes("succès")
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {onAdminSuccess}
        </div>
      )}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher un utilisateur"
          className="p-2 border rounded w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Rechercher
        </button>
      </div>

      {/* Résultats de la recherche */}
      {currentUsers.length > 0 ? (
        <div>
          <table className="w-full bg-white border rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">ID</th>
                <th className="p-2">Nom</th>
                <th className="p-2">Prenom</th>
                <th className="p-2">Email</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id} className="text-center border-b">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.nom}</td>
                  <td className="p-2">{user.prenom}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">
                    <button
                      onClick={() => openModal(user)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Promouvoir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4">
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num + 1}
                onClick={() => paginate(num + 1)}
                className={`px-4 py-2 mx-1 rounded ${
                  currentPage === num + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {num + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-center mt-4">Aucun utilisateur trouvé.</p>
      )}

      {/* Modal de confirmation */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h3 className="text-lg font-bold mb-4">Confirmer la promotion</h3>
            <p>
              Êtes-vous sûr de vouloir promouvoir{" "}
              <strong>{selectedUser.nom || "Nom non défini"}</strong> en
              administrateur ?
            </p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Retour
              </button>
              <button
                onClick={handlePromote}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromoteUser;
