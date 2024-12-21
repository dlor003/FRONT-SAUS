import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "./component/ZustandFile/AuthStore"; // Import du store Zustand
import Membership from "./component/MemberShip";
import Login from "./component/Auth/Login";
import Home from "./component/Pages/Home";
import Registration from "./component/Auth/Registration";
import Profil from "./component/Pages/Profil";
import Dashboard from "./component/Pages/Dashboard";
import logo from "./assets/logo.png";
import RegisterBasicData from "./component/Auth/RegisterBasicData";
import Questionnaire from "./component/Pages/Verification/Questionnaire";
import useStore from "./component/store";
import Administration from "./component/Pages/Administration/Administration";
import UserProfil from "./component/Pages/Administration/AdminComposant/UserProfil";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { user, checkAuth, BasicId, authLoading } = useAuthStore();

    // Vérifie l'authentification au chargement
    useEffect(() => {
      checkAuth(); // Charge l'état utilisateur au montage
    }, [checkAuth]);
  
    // Pendant le chargement, affiche un message ou un spinner
    if (authLoading) {
        return <div>Chargement...</div>;
    }
  
    // Autoriser l'accès à /membership si BasicId est présent
    if (!user && BasicId) {
        return children; // Permet d'afficher Membership
    }
  
    // Redirige vers /login si aucun utilisateur n'est authentifié
    if (!user) {
        return <Navigate to="/login" />;
    }
  
    // Vérifie les rôles spécifiés, si nécessaire
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }
  
    // Si tout est correct, affiche les enfants
    return children;
};
  


function App() {
    const { user, logout, checkAuth } = useAuthStore();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [activeLink, setActiveLink] = useState("");
    const navigate = useNavigate();
    const location = useLocation(); // Permet de détecter l'URL actuelle
    const { isBlocked } = useStore(); // Suppose que isBlocked est géré dans le store


    // Mettre à jour `activeLink` en fonction du chemin actuel
    useEffect(() => {
        const currentPath = location.pathname;
        setActiveLink("/Dashboard")
        if (currentPath === "/Dashboard") {
            setActiveLink("Dashboard");
        } else if (currentPath === "/Profil") {
            setActiveLink("Profil");
        } else if (currentPath === "/Administration") {
            setActiveLink("Administration");
        } 
    }, [location.pathname]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-emerald-400 to-indigo-800 py-2 ">
                <div className="flex justify-between items-center mx-28">
                    <div className="flex items-center space-x-3">
                        {/* Ajouter l'image à gauche */}
                        <img src={logo} alt="Logo" className="w-24 h-26" />
                        <div className="text-white text-4xl font-bold">SAUS</div>
                    </div>
                    <div className="flex gap-6">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/" className="text-white font-semibold hover:underline">
                                    Accueil
                                </Link>
                                <Link to="/login" className="text-white font-semibold hover:underline">
                                    Login
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/Dashboard"
                                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                        activeLink === "Dashboard"
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/Profil"
                                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                        activeLink === "Profil"
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    Profil
                                </Link>

                                {user?.role === "admin" && (
                                <Link
                                    to="/Administration"
                                    className={`rounded-md px-3 py-2 text-sm font-semibold ${
                                        activeLink === "Administration"
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    Administration
                                </Link>
                            )}
                            </>
                        )}
                        <br />
                        {isBlocked && (
                            <div className="alert alert-danger">
                                Vous êtes temporairement bloqué en raison de trop nombreuses tentatives.
                            </div>
                        )}
                    </div>
                    {isAuthenticated && user && (
                        <button
                            onClick={logout}
                            className="text-white font-semibold hover:underline bg-red-500 rounded-lg py-1 px-2"
                        >
                            Déconnexion
                        </button>
                    )}
                </div>
            </nav>


            <Routes>
                <Route path="/" element={<Home  />} />
                <Route path="/Profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
                <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />  
                <Route path="/registerBasicData" element={<RegisterBasicData />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/membership" 
                    element={
                        <ProtectedRoute >
                            <Membership />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/Questionnaire" 
                    element={
                        <ProtectedRoute >
                            <Questionnaire />
                        </ProtectedRoute>
                    } 
                />
                <Route
                    path="/Administration" // Route pour l'administration
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <Administration />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/UserProfil/:id" // Route pour l'administration
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <UserProfil />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
