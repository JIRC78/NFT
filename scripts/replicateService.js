require('dotenv').config();
const axios = require('axios');

// Configura tu API Key de Replicate
const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;

async function generateImage(prompt) {
    try {
        const response = await axios.post(
            'https://api.replicate.com/v1/predictions',
            {
                version: "db21e621b96837aa26ed8df03840af0c1ee6bba1e0d0c2cb30e6cd355d1d43e1", // Stable Diffusion version
                input: {
                    prompt: prompt,
                    width: 512,
                    height: 512,
                }
            },
            {
                headers: {
                    Authorization: `Token ${REPLICATE_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Image Generation Started. Prediction ID:', response.data.id);

        // Poll the API to check the status
        let status = response.data.status;
        let imageUrl = null;

        while (status !== 'succeeded' && status !== 'failed') {
            console.log('Waiting for the image to generate...');
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera 2 segundos

            const result = await axios.get(
                `https://api.replicate.com/v1/predictions/${response.data.id}`,
                {
                    headers: {
                        Authorization: `Token ${REPLICATE_API_KEY}`,
                    },
                }
            );

            status = result.data.status;
            if (status === 'succeeded') {
                imageUrl = result.data.output[0];
            } else if (status === 'failed') {
                throw new Error('Image generation failed');
            }
        }

        console.log('Image Generated Successfully:', imageUrl);
        return imageUrl;

    } catch (error) {
        console.error('Error generating image:', error.message);
    }
}

generateImage("A futuristic cityscape with flying cars at sunset");
