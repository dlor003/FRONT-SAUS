import React, { useState } from 'react';
import useAuthStore from '../AuthStore';
import { useNavigate, useLocation } from 'react-router-dom';

const RegisterBasicData = () => {
    const { registerBasicData, error, loading } = useAuthStore((state) => state);
    const navigate = useNavigate();
    const location = useLocation(); // Récupère l'URL actuelle
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const data = { nom, prenom, email };
      
        try {
          const response = await registerBasicData(data);
      
          // Si l'enregistrement est réussi
          if (response) {
            console.log("Utilisateur enregistré avec succès", response);
      
            // Vérifiez que BasicId est bien défini
            const { BasicId } = useAuthStore.getState(); // Accède directement à l'état actuel
            console.log(useAuthStore.getState().BasicId);

            if (BasicId) {
              navigate("/Questionnaire", { state: response });
            } else {
              console.error("BasicId n'a pas été défini correctement.");
            }
          }
        } catch (error) {
          console.log(error);
        }
      };

       // Applique mt-64 uniquement si on est sur /login
    const containerClass = location.pathname === "/registerBasicData"
    ? "flex bg-white p-6 rounded-lg shadow-lg col-span-6 ml-20 mr-10 mt-64"
    : "flex bg-white p-6 rounded-lg shadow-lg col-span-6 ml-20 mr-10";
      
  

    return (
        <div className="flex items-center justify-center bg-gray-100">
            <div className={containerClass}>
                <div>
                    <form className="w-full max-w-md " onSubmit={handleSubmit}>
                        <h1 className="text-2xl  font-bold text-center mb-6">ENTREZ VOS DONNEES DE BASE</h1>

                        <div className="mt-2">
                            <label>Nom:</label>
                            <input
                            type="text"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="mt-2">
                            <label>Prénom:</label>
                            <input
                            type="text"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="mt-2">
                            <label>Email:</label>
                            <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full bg-blue-500 text-white py-3 rounded-md transition hover:bg-blue-600"
                        >
                            {loading ? 'Chargement...' : 'Enregistrer'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterBasicData;
