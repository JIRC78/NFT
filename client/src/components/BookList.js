import React from "react";

function BookList({ books = [] }) {
    if (!books.length) {
        return (
            <div style={styles.container}>
                <h2 style={styles.title}>BOOK LIST</h2>
                <p style={styles.noBooks}>No books registered yet. Add a book to see it here!</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>BOOK LIST</h2>
            <div style={styles.list}>
                {books.map((book, index) => (
                    <div key={index} style={styles.bookItem}>
                        <div style={styles.bookIndex}>{index + 1}</div>
                        <div style={styles.bookDetails}>
                            <h3 style={styles.bookTitle}>{book.title}</h3>
                            <p style={styles.bookAuthor}>By: {book.author}</p>
                            <p style={styles.bookDescription}>{book.description}</p>
                            {book.image && (
                                <img
                                    src={book.image}
                                    alt={`${book.title} cover`}
                                    style={styles.bookImage}
                                />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        marginTop: "20px",
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxWidth: "90%",
        marginLeft: "auto",
        marginRight: "auto",
    },
    title: {
        fontSize: "1.5rem",
        marginBottom: "20px",
        textAlign: "center",
        color: "#343a40",
    },
    noBooks: {
        fontSize: "1rem",
        textAlign: "center",
        color: "#6c757d",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    bookItem: {
        display: "flex",
        alignItems: "center",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ced4da",
        backgroundColor: "#f8f9fa",
    },
    bookIndex: {
        width: "40px",
        height: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.2rem",
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "#6c757d",
        borderRadius: "50%",
        marginRight: "15px",
    },
    bookDetails: {
        flex: 1,
    },
    bookTitle: {
        fontSize: "1.2rem",
        marginBottom: "5px",
        color: "#343a40",
    },
    bookAuthor: {
        fontSize: "1rem",
        marginBottom: "5px",
        color: "#6c757d",
    },
    bookDescription: {
        fontSize: "0.9rem",
        color: "#495057",
    },
    bookImage: {
        marginTop: "10px",
        maxWidth: "100%",
        maxHeight: "200px",
        borderRadius: "5px",
    },
};

export default BookList;
