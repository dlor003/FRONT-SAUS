import React from 'react';

const Member = ({ formData, onCheckboxChange, errors }) => {
    console.log(formData.nom)
    return (
        <div className="p-6 bg-gray-50 mt-2">
            <div className="flex items-start mb-4">
                <input
                    type="checkbox"
                    id="formData.membre_Actif"
                    checked={formData.membre_Actif}
                    onChange={(e) => onCheckboxChange("membre_Actif", e.target.checked)}
                    className="mr-2 w-8 h-8 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="membre_Actif" className="text-left text-gray-700 leading-6">
                    Membre Actif (Droit d’adhésion : 1000 Ar + Cotisation Annuelle : 20.000 Ar pour les membres
                    en activité et 5.000 Ar pour les membres étudiants ou en recherche d’emploi ou retraité-e-s)
                </label>
            </div>

            <div className="flex items-start mb-3">
                <input
                    type="checkbox"
                    id="formData.membre_sympathisant"            
                    onChange={(e) => onCheckboxChange("membre_sympathisant", e.target.checked)}
                    className="mr-3 w-8 h-8 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="membre_sympathisant" className="text-gray-700 leading-6">
                    Membre Sympathisant (Droit d’adhésion : 1000 Ar + Cotisation Annuelle : 0 Ar)
                </label>
            </div>

            {errors.member && (
                <p className="text-red-500 text-sm">{errors.member}</p>
            )}
            

            <div className="flex items-start">
                Paiement par Mobile Money à &nbsp;
                <b>Maxime RAFANOMEZANTSOA</b> au 033.51.085.12 ou 038.05.867.17
            </div>
    </div>
    );
};

export default Member;
