import React, { useState } from "react";
import Modify from "../../../assets/Modify.svg";

const DiplomeData = ({ data, onUpdate }) => {
    

    const diplomes = data.data; // Liste des diplômes        

    return (
                <div className="relative bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold mb-4 text-center">
                        DIPLÔME UNIVERSITAIRE
                    </h3>
                    <ul className="list-disc ml-14">
                        {diplomes.map((diplome) => (
                            <li key={diplome.id}>{diplome.nom}</li>
                        ))}
                    </ul>
                </div>
    );
};

export default DiplomeData;
