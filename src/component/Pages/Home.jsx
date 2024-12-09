import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store";
import Login from "../Auth/Login";

const Home = ({ setIsVerifiedRegion }) => {
    const [district, setDistrict] = useState("");
    const [commune, setCommune] = useState("");
    const [fokontany, setFokontany] = useState("");
    const [step, setStep] = useState(1);
    const [different, setDifferent] = useState(false); // Mots de passe différents


    const { 
        districtExists, 
        communeExists, 
        fokontanyExists, 
        error, 
        loading, 
        verifyDistrict, 
        verifyCommune, 
        verifyFokontany 
    } = useStore();

    const navigate = useNavigate();

    const handleVerifyDistrict = async () => {
        await verifyDistrict(district);
        if (districtExists) {
        setStep(2);
        }
    };

    const handleVerifyCommune = async () => {
        await verifyCommune(district, commune);
        if (communeExists) {
        setStep(3);
        }
    };

    const handleVerifyFokontany = async () => {
        await verifyFokontany(commune, fokontany);
        if (fokontanyExists) {
        setStep(4);
        setIsVerifiedRegion(true);
        navigate("/membership");
        }
    };

    return (
            <div className="flex items-center h-full bg-gray-300 grid grid-cols-10 gap-6">

                <div className="bg-white  p-6 rounded-lg shadow-lg  col-span-6 ml-20 mr-10">
                        <Login />
                </div>
                    
                <div className=" ml-20 mr-20 bg-white p-6 rounded-lg shadow-lg  col-span-4 ">
                    <h1 className="text-xl text-center font-bold mb-3"> INSCRIPTION</h1>
                    <p className="text-base/loose text-left mb-2">
                        Pour verifier que vous avez des conaissances ou que vous habitez 
                        dans la region de Sofia. <br />
                        Veuillez repondre a ces quelques questions. 
                    </p>
                    {/* Progress Bar */}
                    <div className="w-full flex items-center mb-6">
                        {/* Étape 1 */}
                        <div
                        className={`h-2 flex-1 mx-1 ${
                            step > 1 ? "bg-green-500" : "bg-gray-300"
                        } rounded transition-all duration-300`}
                        ></div>

                        {/* Étape 2 */}
                        <div
                        className={`h-2 flex-1 mx-1 ${
                            step > 2 ? "bg-green-500" : "bg-gray-300"
                        } rounded transition-all duration-300`}
                        ></div>
                        
                        {/* Étape 3 */}
                        <div
                        className={`h-2 flex-1 mx-1 ${
                            step > 3 ? "bg-green-500" : "bg-gray-300"
                        } rounded transition-all duration-300`}
                        ></div>
                    </div>

                    {step === 1 && (
                        <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Saisissez une district dans la region de sofia
                        </label>
                        <input
                            type="text"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                        <button
                            onClick={handleVerifyDistrict}
                            className="w-full bg-blue-500 text-white mt-4 py-2 px-4 rounded-md"
                        >
                            {loading ? "Vérification..." : "Soumettre"}
                        </button>
                        </div>
                    )}
                    {step === 2 && (
                        <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Commune
                        </label>
                        <input
                            type="text"
                            value={commune}
                            onChange={(e) => setCommune(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                        <button
                            onClick={handleVerifyCommune}
                            className="w-full bg-blue-500 text-white mt-4 py-2 px-4 rounded-md"
                        >
                            {loading ? "Vérification..." : "Soumettre"}
                        </button>
                        </div>
                    )}
                    {step === 3 && (
                        <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Fokontany
                        </label>
                        <input
                            type="text"
                            value={fokontany}
                            onChange={(e) => setFokontany(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md"
                        />
                        <button
                            onClick={handleVerifyFokontany}
                            className="w-full bg-blue-500 text-white mt-4 py-2 px-4 rounded-md"
                        >
                            {loading ? "Vérification..." : "Soumettre"}
                        </button>
                        </div>
                    )}
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
               
            </div>
            
    );
};

export default Home;
