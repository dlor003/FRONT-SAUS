import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../store";
import Login from "../Auth/Login";
import RegisterBasicData from "../Auth/RegisterBasicData";

const Home = () => {
    const [district, setDistrict] = useState("");
    const [commune, setCommune] = useState("");
    const [fokontany, setFokontany] = useState("");
    const [step, setStep] = useState(1);


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
        
    }


    

    return (
            <div className="flex items-center h-full bg-gray-300 grid grid-cols-10 gap-6">

                        <Login />
                    
                <div className=" ml-20 mr-20 bg-gray-100 py-2 rounded-lg shadow-lg  col-span-4 ">
                            <p className="text-center font-semibold mb-1">
                                Pour l'inscription, il y a quelque etapes a respecter. <br />
                                Veuillez a les suivre attentivement s'il vous plait
                            </p>
                            <RegisterBasicData />
                </div>
                
            </div>
            
    );
};

export default Home;
