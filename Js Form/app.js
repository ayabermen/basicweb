// Book class to create book objects
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class for handling UI-related tasks
class UI {
    // Display books on the page
    static displayBook() {
        const books = Store.getBook();
        books.forEach(book => UI.addBook(book)); 
    }

    // Add a book to the table
    static addBook(book) {
        const list = document.querySelector("#book-list");
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    // Clear input fields
    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    // Show alert messages
    static showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(msg));
        const cont = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        cont.insertBefore(div, form);
        setTimeout(() => document.querySelector('.alert').remove(), 3000);
    }

    // Delete book from the UI
    static deleteEl(el) {
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
            UI.showAlert('Book Removed', 'success');
        }
    }
}

// Store class for managing localStorage operations
class Store {
    // Get books from localStorage
    static getBook() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    // Add a book to localStorage
    static addBook(book) {
        const books = Store.getBook();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    // Remove a book from localStorage
    static removeBook(isbn) {
        const books = Store.getBook();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display books when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", UI.displayBook);

// Event: Add a book when the form is submitted
document.querySelector("#book-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    // Validate input fields
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill all fields', 'danger');
    } else {
        const book = new Book(title, author, isbn);
        // Add book to the store
        Store.addBook(book);
        // Add book to the UI
        UI.addBook(book);
        // Show success message
        UI.showAlert('Book Added', 'success');
        // Clear input fields
        UI.clearFields();
    }
});

// Event: Remove a book when the delete button is clicked
document.querySelector('#book-list').addEventListener("click", (e) => {
    UI.deleteEl(e.target);
    // Remove book from the store
    if (e.target.classList.contains('delete')) {
        const isbn = e.target.parentElement.previousElementSibling.textContent;
        Store.removeBook(isbn);
    }
});
