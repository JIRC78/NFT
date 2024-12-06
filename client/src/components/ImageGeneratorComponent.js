import React, { useState } from "react";
import "./ImageGeneratorComponent.css";
import { mintNFT } from "../scripts/nfts"; // Asegúrate de importar tu función `mintNFT`

const ImageGeneratorComponent = () => {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [message, setMessage] = useState("");

  const handleGenerateImage = async () => {
    if (!description) {
      alert("Por favor, ingresa una descripción.");
      return;
    }

    // Generar una imagen con Lorem Picsum
    const id = description
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000;
    const generatedImageUrl = `https://picsum.photos/seed/${id}/512/512`;
    setImageUrl(generatedImageUrl);

    // Ahora mintar el NFT con la imagen generada
    try {
      setMessage("Mintando NFT, espera por favor...");
      const tokenURI = generatedImageUrl; // La URL de la imagen será el tokenURI
      const txHash = await mintNFT(tokenURI); // Mintar el NFT con la URL de la imagen
      setMessage(`¡NFT Mintado! TxHash: ${txHash}`);
    } catch (error) {
      console.error("Error mintando NFT:", error);
      setMessage("Error al mintar el NFT. Intenta de nuevo.");
    }
  };

  return (
    <div className="image-generator">
      <h3>Generar Imagen y Mintar NFT</h3>
      <input
        type="text"
        placeholder="Escribe una descripción..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="description-input"
      />
      <button onClick={handleGenerateImage} className="generate-button">
        Generar Imagen y Mintar NFT
      </button>
      {imageUrl && (
        <div className="image-container">
          <h4>Imagen Generada:</h4>
          <img src={imageUrl} alt="Generado por descripción" className="generated-image" />
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
};

export default ImageGeneratorComponent;
