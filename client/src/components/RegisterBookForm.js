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
            setTitle("");
            setAuthor("");
            setDescription("");
        } catch (error) {
            console.error("Error registering book:", error);
            setMessage("Error registering book. Please try again.");
        }
    }

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.title}>Register a Book</h2>
            <input
                type="text"
                placeholder="Book Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
            />
            <input
                type="text"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={styles.input}
            />
            <textarea
                placeholder="Short Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={styles.textarea}
            />
            <button onClick={handleRegister} style={styles.button}>
                Register Book
            </button>
            {message && <p style={styles.message}>{message}</p>}
        </div>
    );
}

const styles = {
    formContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: "20px auto",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "400px",
    },
    title: {
        fontSize: "1.5rem",
        marginBottom: "20px",
        color: "#343a40",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ced4da",
        fontSize: "1rem",
    },
    textarea: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        borderRadius: "5px",
        border: "1px solid #ced4da",
        fontSize: "1rem",
        height: "80px",
        resize: "none",
    },
    button: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        fontSize: "1rem",
        cursor: "pointer",
    },
    message: {
        marginTop: "15px",
        color: "#28a745",
        fontSize: "1rem",
        textAlign: "center",
    },
};

export default RegisterBookForm;
