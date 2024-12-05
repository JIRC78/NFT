// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BookRegistry {
    struct Book {
        string title;
        string author;
        string description;
        address owner;
    }

    mapping(uint256 => Book) public books;
    uint256 public bookCount;

    event BookRegistered(uint256 bookId, string title, string author, address owner);

    function registerBook(string memory title, string memory author, string memory description) public {
        require(bytes(title).length > 0, "Title is required");
        require(bytes(author).length > 0, "Author is required");

        books[bookCount] = Book(title, author, description, msg.sender);
        emit BookRegistered(bookCount, title, author, msg.sender);
        bookCount++;
    }
    

    function getBook(uint256 bookId) public view returns (Book memory) {
        require(bookId < bookCount, "Book does not exist");
        return books[bookId];
    }

    function getAllBooks() public view returns (Book[] memory) {
        Book[] memory allBooks = new Book[](bookCount);
        for (uint256 i = 0; i < bookCount; i++) {
            allBooks[i] = books[i];
        }
        return allBooks;
    }

    
}
