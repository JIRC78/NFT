const axios = require("axios");

const generateAIImage = async (description) => {
    const API_KEY = process.env.REPLICATE_API_KEY; // Asegúrate de configurarlo en tu .env

    try {
        const response = await axios.post(
            "https://api.replicate.com/v1/predictions",
            {
                version: "YOUR_MODEL_VERSION", // Sustituye con la versión del modelo de IA
                input: { prompt: description },
            },
            {
                headers: {
                    Authorization: `Token ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        // Asegúrate de que el enlace generado esté disponible
        const imageUrl = response.data.output[0];
        return imageUrl;
    } catch (error) {
        console.error("Error generating AI image:", error);
        throw new Error("Failed to generate AI image.");
    }
};

module.exports = { generateAIImage };
