const ResearchPole = ({ formData, handleInputChange, errors }) => {
    const options = [
        "Sciences Humaines, Sociales et du Langage",
        "Sciences de la Société",
        "Sciences du Vivant",
        "Sciences Agronomiques et Alimentaires",
        "Sciences de la Santé",
        "Sciences de l'ingénierie et technologie",
        "Sciences de l'éducation",
    ];

    return (
        <div className="p-6 bg-gray-50 mt-2">
            <div className="text-center text-xl font-bold mb-2">
                <b>
                    <h1>PÔLE DE RECHERCHE</h1>
                </b>
            </div>

            {/* Affiche une erreur globale si aucun pôle n'est sélectionné */}
            {errors.poles && (
                <p className="text-red-500 text-sm mb-4 text-center">{errors.poles}</p>
            )}

            {/* Générer les sélecteurs dynamiquement */}
            {formData.poles.map((pole, index) => (
                <div className="flex mt-2 ml-20" key={index}>
                    <div>
                        <label htmlFor={`pole${index + 1}`} className="mb-2 ml-10 mr-5">
                            Pôle {index + 1} :
                        </label>
                        <select
                            id={`pole${index + 1}`}
                            name={`pole${index + 1}`}
                            value={pole.value || ""}
                            onChange={handleInputChange}
                            className={`border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 w-64 ${
                                errors[`pole${index + 1}`] ? "border-red-500" : ""
                            }`}
                        >
                            <option value="" disabled>
                                -
                            </option>
                            {options.map((option, optionIndex) => (
                                <option key={optionIndex} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors[`pole${index + 1}`] && (
                            <p className="text-red-500 text-sm mt-1">{errors[`pole${index + 1}`]}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResearchPole;
