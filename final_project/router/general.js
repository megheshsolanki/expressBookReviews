const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    if(!req.body.username || !req.body.password){
        return res.status(400).json({message : "Provide all credentials"})
    }
    const isPresent = users.filter((user)=>{
        if(user.username === req.body.username){
            return user;
        }
    })
    if(isPresent.length > 0){
        return res.status(422).json({message : "username already exists"}) 
    }
    const user = {
        username: req.body.username,
        password: req.body.password
    };
    users.push(user);
    return res.status(300).json({ message: "implemented" });
    return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    return res.status(300).json({ message: "implemented", books: books });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    const filteredBooks = books[`${isbn}`];
    return res.status(300).json({ message: "implemented", book: filteredBooks });
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author;
    let filteredBooks = {};
    for (const key in books) {
        if (books[`${key}`].author === author) {
            filteredBooks = { ...filteredBooks, [`${key}`]: books[`${key}`] };
        }
    }
    return res.status(300).json({ message: "implemented", books: filteredBooks });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title;
    let filteredBooks = {};
    for (const key in books) {
        if (books[`${key}`].title === title) {
            filteredBooks = { ...filteredBooks, [`${key}`]: books[`${key}`] };
        }
    }
    return res.status(300).json({ message: "implemented", books: filteredBooks });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;

    return res.status(300).json({ message: "implemented", reviews: books[`${isbn}`].reviews });
});

module.exports.general = public_users;