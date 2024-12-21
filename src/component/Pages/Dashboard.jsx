import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../ZustandFile/AuthStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    demandes,
    loading,
    status,
    fetchDemandes,
    postDemande,
    isAuthenticated,
    dataUser,
    postCotisation,
    cotisationAdd,
  } = useAuthStore();

  const [error, setError] = useState(null); // État pour gérer les erreurs
  const [typeDemande, setTypeDemande] = useState("adhesion");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("faire-payement"); // Tab active
  const [paymentType, setPaymentType] = useState("adhesion"); // Type de paiement
  const [paymentDate, setPaymentDate] = useState(""); // Initialisé à une chaîne vide
  const [date, setDate] = useState(""); // Initialisé à une chaîne vide
  const [file, setFile] = useState(null); // Fichier sélectionné
  const [filePreview, setFilePreview] = useState(null); // Aperçu du fichier

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];

    if (uploadedFile && !uploadedFile.type.startsWith("image/")) {
      setError("Le fichier doit être une image au format PNG, JPEG ou JPG.");
      setFile(null);
      setFilePreview(null);
      return;
    }

    setError(null); // Réinitialiser l'erreur si le fichier est valide
    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      setFilePreview(event.target.result);
    };
    reader.readAsDataURL(uploadedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dataUser || !dataUser.personnelData?.bodyData?.id) {
      setError("L'utilisateur n'est pas correctement authentifié.");
      return;
    }

    const formData = new FormData();
    formData.append("type_demande", typeDemande);
    formData.append("message", message);
    formData.append("date", date || ""); // Assure une chaîne vide si la date est absente
    formData.append("file", file);
    formData.append("id", dataUser.personnelData.bodyData.id);

    const token = dataUser.token;
    postDemande({ data: formData, token });
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (!dataUser || !dataUser.personnelData?.bodyData?.id) {
      setError("L'utilisateur n'est pas correctement authentifié.");
      return;
    }

    const formData = new FormData();
    formData.append("type_paiement", paymentType);
    formData.append("date_paiement", paymentDate || ""); // Assure une chaîne vide si la date est absente
    formData.append("file", file);
    formData.append("id", dataUser.personnelData.bodyData.id);

    const token = dataUser.token;
    postCotisation({ data: formData, token });
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    if (isAuthenticated && dataUser) {
      fetchDemandes({
        userId: dataUser.personnelData?.bodyData?.id || "",
        token: dataUser.token || "",
      });
    }
  }, [isAuthenticated, dataUser, fetchDemandes, navigate]);

  return (
    <div className="flex min-h-screen bg-gray-100 mt-28 fixed w-full">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <ul className="space-y-4">
          <li
            onClick={() => setActiveTab("faire-payement")}
            className={`cursor-pointer text-lg ${
              activeTab === "faire-payement" ? "text-indigo-400" : ""
            }`}
          >
            Faire un Paiement
          </li>
          <li
            onClick={() => setActiveTab("faire-demande")}
            className={`cursor-pointer text-lg ${
              activeTab === "faire-demande" ? "text-indigo-400" : ""
            }`}
          >
            Faire une Demande
          </li>
          <li
            onClick={() => setActiveTab("liste-demande")}
            className={`cursor-pointer text-lg ${
              activeTab === "liste-demande" ? "text-indigo-400" : ""
            }`}
          >
            Mes Demandes
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === "faire-payement" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Faire un Paiement
            </h2>
            {cotisationAdd && (
              <div
                className={`mt-2 text-center text-sm p-4 rounded-lg shadow-md ${
                  cotisationAdd.includes("succès")
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {cotisationAdd}
              </div>
            )}
            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="payment_type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type de Paiement
                </label>
                <select
                  id="payment_type"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="adhesion">Adhésion</option>
                  <option value="cotisation">Cotisation</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="payment_date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date de Paiement
                </label>
                <input
                  type="date"
                  id="payment_date"
                  value={paymentDate || ""}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700"
                >
                  Preuve de Paiement
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {filePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Aperçu du fichier :</p>
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover mt-2"
                  />
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-50"
                >
                  {loading ? "Envoi..." : "Envoyer le Paiement"}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "faire-demande" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Faire une Demande
            </h2>
            {status && (
              <div
                className={`mt-2 text-center text-sm p-4 rounded-lg shadow-md ${
                  status.includes("succès")
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {status}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="type_demande"
                  className="block text-sm font-medium text-gray-700"
                >
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
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
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

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date || ""}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div>
                <label
                  htmlFor="file"
                  className="block text-sm font-medium text-gray-700"
                >
                  Fichier
                </label>
                <input
                  type="file"
                  id="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={handleFileChange}
                  className="mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {filePreview && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Aperçu du fichier :</p>
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover mt-2"
                  />
                </div>
              )}

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
        )}

        {activeTab === "liste-demande" && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Liste de Demandes
            </h2>
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left text-gray-600">ID</th>
                  <th className="py-2 px-4 text-left text-gray-600">
                    Type de Demande
                  </th>
                  <th className="py-2 px-4 text-left text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-2 px-4 text-center text-gray-600"
                    >
                      Chargement...
                    </td>
                  </tr>
                ) : demandes.length === 0 ? (
                  <tr>
                    <td
                      colSpan="3"
                      className="py-2 px-4 text-center text-gray-600"
                    >
                      {status || "Aucune demande trouvée."}
                    </td>
                  </tr>
                ) : (
                  demandes.map((demande) => (
                    <tr key={demande.id}>
                      <td className="py-2 px-4">{demande.id}</td>
                      <td className="py-2 px-4">{demande.type_demande}</td>
                      <td className="py-2 px-4">
                        <p
                          className={`mt-2 text-sm p-4 rounded-lg shadow-md ${
                            demande.status === "en_attente"
                              ? "bg-blue-200 text-blue-600"
                              : demande.status === "traitee"
                              ? "bg-green-200 text-green-600"
                              : demande.status === "rejete"
                              ? "bg-red-200 text-red-600"
                              : ""
                          }`}
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
