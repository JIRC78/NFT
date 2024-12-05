import React, { useState } from "react";

function RegisterBookForm({ onBooksUpdated }) {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");

    async function handleRegister() {
        try {
            const response = await fetch("http://localhost:3000/books/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, author, description }),
            });

            if (!response.ok) {
                throw new Error("Failed to register book");
            }

            const data = await response.json();
            setMessage("Book registered successfully!");
            onBooksUpdated(); // Actualiza la lista de libros
        } catch (error) {
            console.error("Error registering book:", error);
            setMessage("Error registering book. Please try again.");
        }
    }

    return (
        <div>
            <h2>Register a Book</h2>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
            />
            <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleRegister}>Register Book</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default RegisterBookForm;
