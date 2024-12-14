import React, { useState } from 'react';
import useAuthStore from '../AuthStore';
import { useNavigate } from 'react-router-dom';

const RegisterBasicData = () => {
  const { registerBasicData, error, loading } = useAuthStore((state) => state);
  const navigate = useNavigate();
  
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { nom, prenom, email };

    try {
      const response = await registerBasicData(data);

      // Vérification si la réponse est valide
      if (response) {
        console.log('Utilisateur enregistré avec succès', response);
        navigate('/membership'); // Redirection après succès
      }
    } catch (error) {
      console.log(error); // Affichage de l'erreur en console
    }
  };

  return (
    <div className="flex bg-white p-6 rounded-lg shadow-lg col-span-6 ml-20 mr-10 mt-64">
      <div className="w-1/2 flex flex-col justify-center items-center bg-gray-50 p-8">
        <form className="w-full max-w-md" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold text-center mb-6">BASIC DATA</h1>

          <div>
            <label>Nom:</label>
            <input
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label>Prénom:</label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
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
  );
};

export default RegisterBasicData;
