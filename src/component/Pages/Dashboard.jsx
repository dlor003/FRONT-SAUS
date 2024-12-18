import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../ZustandFile/AuthStore";
import axios from "axios";

const Dashboard = () => {
    const navigate = useNavigate();
    const { demandes, loading, status, fetchDemandes, postDemande, isAuthenticated, dataUser } = useAuthStore();
    
    const [typeDemande, setTypeDemande] = useState("adhesion");
    const [message, setMessage] = useState("");
    const [activeTab, setActiveTab] = useState("faire-demande"); // État pour la tab active

    const handleSubmit = async (e) => {
        e.preventDefault();
        postDemande({typeDemande, message, token: dataUser.token, id: dataUser.personnelData.bodyData.id});
    };

    useEffect(() => {
        if (!isAuthenticated) {
        navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (isAuthenticated && dataUser) {
            // Charger les demandes de l'utilisateur lorsqu'il est authentifié
            fetchDemandes({ userId: dataUser.personnelData.bodyData.id, token: dataUser.token });
        }
    }, [isAuthenticated, dataUser, fetchDemandes]);
    

    // Vérification sécurisée des données
    if (!dataUser || !dataUser.user) {
        return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-gray-700 text-lg">Chargement...</p>
        </div>
        );
    }

    const personnel = dataUser.user;
    if (!personnel) {
        return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <p className="text-gray-700 text-lg">Données du personnel introuvables.</p>
        </div>
        );
    }

  return (
    <div className="flex h-screen mb-2">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 mt-24 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li
            onClick={() => setActiveTab("faire-demande")}
            className={`cursor-pointer text-lg ${activeTab === "faire-demande" ? "text-indigo-400" : ""}`}
          >
            Faire une Demande
          </li>
          <li
            onClick={() => setActiveTab("liste-demande")}
            className={`cursor-pointer text-lg ${activeTab === "liste-demande" ? "text-indigo-400" : ""}`}
          >
            Liste de Demandes
          </li>
          
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="bg-gray-100 rounded-lg p-5">
          <h1 className="text-4xl font-semibold mb-4">DASHBOARD</h1>
          <h3 className="text-xl font-semibold mb-4">Mes Adhésions et Cotisations</h3>
        </div>

        {/* Content based on active tab */}
        {activeTab === "faire-demande" ? (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">Faire une Demande</h2>
            {status && (
                <div
                className={`mt-2 text-center text-sm p-4 rounded-lg shadow-md ${status.includes("succès") ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                >
                    {status}
                </div>
              
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="type_demande" className="block text-sm font-medium text-gray-700">
                  Type de Demande
                </label>
                <select
                  id="type_demande"
                  value={typeDemande}
                  onChange={(e) => setTypeDemande(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="adhesion">Adhésion</option>
                  <option value="cotisation">Cotisation</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                >
                  {loading ? "Envoi..." : "Envoyer la Demande"}
                </button>
              </div>
            </form>
          </div>
        ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">Liste de Demandes</h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-gray-600">ID</th>
                  <th className="py-2 px-4 text-left text-gray-600">Type de Demande</th>
                  <th className="py-2 px-4 text-left text-gray-600 ">Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-2 px-4 text-center text-gray-600">Chargement...</td>
                  </tr>
                ) : demandes.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-2 px-4 text-center text-gray-600 ">{status || "Aucune demande trouvée."}</td>
                  </tr>
                ) : (
                  demandes.map((demande) => (
                    <tr key={demande.id}>
                        <td className="py-2 px-4">{demande.id}</td>
                        <td className="py-2 px-4">{demande.type_demande}</td>
                        <td className="py-2 px-4">
                            <p
                                className={`mt-2 text-sm p-4 rounded-lg shadow-md 
                                ${demande.status === 'en_attente' ? 'bg-blue-200 text-blue-600' : ''}
                                ${demande.status === 'traitee' ? 'bg-green-200 text-green-600' : ''}
                                ${demande.status === 'rejete' ? 'bg-red-200 text-red-600' : ''}`}
                            >
                                {demande.status}
                            </p>
                        </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
