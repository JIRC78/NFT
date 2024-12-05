import React, { useState, useEffect } from "react";

function BookList() {
    const [books, setBooks] = useState([]); // Asegúrate de iniciar con []

    useEffect(() => {
        async function fetchBooks() {
            try {
                const response = await fetch("http://localhost:3000/books/all");
                const data = await response.json();
                setBooks(data); // Esto debe ser un array
            } catch (error) {
                console.error("Error fetching books:", error);
            }
        }

        fetchBooks();
    }, []);

    return (
        <div>
            <h1>Book List</h1>
            {Array.isArray(books) && books.length > 0 ? (
                books.map((book, index) => (
                    <div key={index}>
                        <h2>{book.title}</h2>
                        <p>{book.author}</p>
                        <p>{book.description}</p>
                    </div>
                ))
            ) : (
                <p>No books available</p>
            )}
        </div>
    );
}

export default BookList;
