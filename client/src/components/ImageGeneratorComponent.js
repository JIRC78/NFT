import React, { useState } from "react";
import "./ImageGeneratorComponent.css";

const ImageGeneratorComponent = () => {
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(null);

  const handleGenerateImage = () => {
    if (!description) {
      alert("Por favor, ingresa una descripción.");
      return;
    }

    // Usaremos la API de Lorem Picsum con un ID generado por descripción
    const id = description
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 1000; // Genera un número pseudoaleatorio basado en la descripción
    const generatedImageUrl = `https://picsum.photos/seed/${id}/512/512`;

    setImageUrl(generatedImageUrl);
  };

  return (
    <div className="image-generator">
      <h3>Generar Imagen</h3>
      <input
        type="text"
        placeholder="Escribe una descripción..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="description-input"
      />
      <button onClick={handleGenerateImage} className="generate-button">
        Generar Imagen
      </button>
      {imageUrl && (
        <div className="image-container">
          <h4>Imagen Generada:</h4>
          <img src={imageUrl} alt="Generado por descripción" className="generated-image" />
        </div>
      )}
    </div>
  );
};

export default ImageGeneratorComponent;
