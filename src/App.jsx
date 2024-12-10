import React, { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import useAuthStore from "./component/AuthStore"; // Import du store Zustand
import Membership from "./component/MemberShip";
import Login from "./component/Auth/Login";
import Home from "./component/Pages/Home";
import Registration from "./component/Auth/Registration";
import Profil from "./component/Pages/Profil";
import Dashboard from "./component/Pages/Dashboard";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
    const { user, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    const [isVerifiedRegion, setIsVerifiedRegion] = useState(false);
    const { user, logout, checkAuth } = useAuthStore();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [activeLink, setActiveLink] = useState("Dashboard");
    const navigate = useNavigate();

    useEffect(() => {
        if (isVerifiedRegion) {
            navigate("/membership");
        }
    }, [isVerifiedRegion, navigate]);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-emerald-400 to-indigo-800 py-5">
                <div className="flex justify-between items-center mx-36">
                    <div className="text-white text-4xl font-bold">SAUS</div>
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
                                    onClick={() => setActiveLink("Dashboard")}
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                                        activeLink === "Dashboard"
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/Profil"
                                    onClick={() => setActiveLink("Profil")}
                                    className={`rounded-md px-3 py-2 text-sm font-medium ${
                                        activeLink === "Profil"
                                            ? "bg-gray-900 text-white"
                                            : "text-gray-300 hover:bg-gray-700 hover:text-white"
                                    }`}
                                >
                                    Profil
                                </Link>
                            </>
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
                <Route path="/" element={<Home setIsVerifiedRegion={setIsVerifiedRegion} />} />
                <Route path="/Profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
                <Route path="/Dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/membership" element={<Membership />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </>
    );
}

export default App;
