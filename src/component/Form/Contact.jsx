import React from "react";

const Contact = ({ formData, handleInputChange, errors }) => {
    return (
        <div className="p-6 bg-gray-50 mt-2">
            <div className="text-center text-xl font-bold mb-2">
                <b>
                    <h1>CONTACTS</h1>
                </b>
            </div>

            <div className="flex space-x-4 justify-start mt-2 ml-20">
                <div>
                    <label htmlFor="telephone" className="mt-2 ml-10 mr-8 py-5">
                        Téléphone :
                    </label>
                    <input
                        type="text"
                        id="telephone"
                        name="telephone"
                        value={formData.telephone}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Entrez votre texte"
                        aria-describedby="error-telephone"
                    /> <br />
                    {errors.telephone && <span id="error-telephone" className="text-red-500">{errors.telephone}</span>}
                </div>
                <div>
                    <label htmlFor="email" className="mt-2 ml-20 px-2">
                        Adresse e-mail :
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Entrez votre texte"
                        aria-describedby="error-email"
                    /><br />
                    {/* {errors.email && <span id="error-email" className="text-red-500">{errors.email}</span>} */}

                </div>
            </div>
        </div>
    );
};

export default Contact;
