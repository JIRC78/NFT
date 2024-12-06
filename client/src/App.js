import React, { useState, useEffect } from "react";
import AuthCard from "./components/AuthCard";
import RegisterForm from "./components/RegisterForm";
import RegisterBookForm from "./components/RegisterBookForm";
import BookList from "./components/BookList";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);
    const [books, setBooks] = useState([]);
    const [view, setView] = useState("list"); // "list" para la lista de libros, "register" para registrar libros

    function handleLogin(user) {
        setCurrentUser(user);
    }

    function toggleRegister() {
        setIsRegistering(!isRegistering);
    }

    async function fetchBooks() {
        try {
            const response = await fetch("http://localhost:3000/books/all");
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    }

    useEffect(() => {
        if (currentUser) {
            fetchBooks();
        }
    }, [currentUser]);

    return (
        <div style={styles.appContainer}>
            {!currentUser ? (
                isRegistering ? (
                    <RegisterForm onRegister={() => setIsRegistering(false)} />
                ) : (
                    <div style={styles.centeredContainer}>
                        <AuthCard onLogin={handleLogin} onToggleRegister={toggleRegister} />
                    </div>
                )
            ) : (
                <>
                    <header style={styles.header}>
                        <h1 style={styles.headerTitle}>Book Registry</h1>
                        <nav style={styles.nav}>
                            {view === "register" && (
                                <button
                                    style={styles.navButton}
                                    onClick={() => setView("list")}
                                >
                                    Volver a la lista
                                </button>
                            )}
                            <button
                                style={styles.navButton}
                                onClick={() => setView("register")}
                            >
                                Registrar
                            </button>
                            <button style={styles.navButton}>Consultar</button>
                        </nav>
                    </header>
                    <main style={styles.main}>
                        {view === "list" ? (
                            <BookList books={books} />
                        ) : (
                            <RegisterBookForm onBooksUpdated={fetchBooks} />
                        )}
                    </main>
                </>
            )}
        </div>
    );
}

const styles = {
    appContainer: {
        fontFamily: "'Arial', sans-serif",
        backgroundColor: "#f4f4f4", // Fondo blanco para todo el contenedor
        minHeight: "100vh",
    },
    centeredContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f4", // Fondo blanco para evitar el gris
    },
    header: {
        backgroundColor: "#343a40",
        color: "#fff",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: "1.5rem",
    },
    nav: {
        display: "flex",
        gap: "10px",
    },
    navButton: {
        backgroundColor: "#6c757d",
        color: "#fff",
        border: "none",
        padding: "10px 15px",
        borderRadius: "5px",
        cursor: "pointer",
    },
    main: {
        flex: 1,
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        overflowY: "auto",
    },
};

export default App;
