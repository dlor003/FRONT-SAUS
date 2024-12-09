import React, { useEffect,useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import useAuthStore from './component/AuthStore'; // Import du store Zustand
import Membership from './component/MemberShip';
import Login from './component/Auth/Login';
import Home from './component/Pages/Home';
import Registration from './component/Auth/Registration';
import Profil from './component/Pages/Profil';
import Dashboard from './component/Pages/Dashboard';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { user, checkAuth } = useAuthStore(); // Récupère les données d'auth depuis le store// Définir les états pour les liens

    useEffect(() => {
        checkAuth(); // Vérifie l'authentification au montage du composant
    }, [checkAuth]);

    if (!user) {
        return <Navigate to="/login" />; // Redirige si l'utilisateur n'est pas connecté
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />; // Redirige si l'utilisateur n'a pas le bon rôle
    }

    return children;
};

function App() {
    const { user, logout, checkAuth } = useAuthStore(); // Récupère les fonctions et l'utilisateur du store
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated); // Vérifie l'état de connexion
    const [activeLink, setActiveLink] = useState('Dashboard'); // Par défaut, 'dashboard' est actif
    // Fonction pour changer l'état actif
    const handleLinkClick = (link) => {
        setActiveLink(link);
    };

    // Vérifie l'authentification au démarrage
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Router>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-emerald-400 to-indigo-800 py-5">
                <div className="flex justify-between items-center mx-36">
                    <div className='justify-start text-white text-4xl font-bold'>
                            <h1>SAUS</h1>
                    </div>
                    {/* Liens centraux */}
                    <div
                        className={`flex gap-6 ${
                            !isAuthenticated ? "justify-center w-full" : "justify-center w-full"
                        }`}
                        >
                        {!isAuthenticated && (
                            <>
                            <Link to="/" className="text-white font-semibold hover:underline">
                                Accueil
                            </Link>
                            <Link to="/login" className="text-white font-semibold hover:underline">
                                Login
                            </Link>
                            </>
                        )}
                        {isAuthenticated && user && (
                            <>
                            <div className="hidden sm:ml-6 sm:block">
                                <div className="flex space-x-4">
                                    
                                    {/* Lien Dashboard */}
                                    <Link
                                        to="/Dashboard"
                                        onClick={() => handleLinkClick('Dashboard')} // Change l'état quand le lien est cliqué
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                                            activeLink === 'Dashboard' 
                                                ? 'bg-gray-900 text-white' 
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        Dashboard
                                    </Link>
                                    {/* Lien Profil */}
                                    <Link
                                        to="/Profil"
                                        onClick={() => handleLinkClick('Profil')} // Change l'état quand le lien est cliqué
                                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                                            activeLink === 'Profil' 
                                                ? 'bg-gray-900 text-white' 
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        }`}
                                    >
                                        Profil
                                    </Link>
                                </div>
                            </div></>
                        )}
                    </div>

                    {/* Bouton déconnexion */}
                    {isAuthenticated && user && (
                    <div className="ml-auto">
                        <button
                            onClick={logout}
                            className="text-white font-semibold hover:underline bg-red-500 rounded-lg py-1 px-2"
                        >
                        Déconnexion
                        </button>
                    </div>
                    )}
                </div>
            </nav>

            <Routes>
                {/* Page d'accueil */}
                <Route path="/" element={<Home />} />

                {/* Dashboard accessible uniquement pour les utilisateurs connectés */}
                <Route
                    path="/Profil"
                    element={
                        <ProtectedRoute>
                            <Profil />
                        </ProtectedRoute>
                    }
                />
                {/* Dashboard accessible uniquement pour les utilisateurs connectés */}
                <Route
                    path="/Dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Page de questionnaire */}
                <Route
                    path="/membership"
                    element={
                        <ProtectedRoute>
                            <Membership />
                        </ProtectedRoute>
                    }
                />

                {/* Pages d'enregistrement et de connexion */}
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
}

export default App;
