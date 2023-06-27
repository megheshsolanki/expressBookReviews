const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    username: "qwerty",
    password: "password"
}];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    const isPresent = users.filter((user) => {
        if (user.username === username) {
            return user;
        }
    })
    if (isPresent.length > 0) {
        return true;
    }
    return false;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const isPresent = users.filter((user) => {
        if (user.username === username) {
            return user;
        }
    })
    const user = isPresent[0];
    if (user.username === username && user.password === password) {
        return true;
    }
    return false;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    if (!isValid(req.body.username)) {
        return res.status(404).json({ message: "user doesn't exist." });
    }
    if (!authenticatedUser(req.body.username, req.body.password)) {
        return res.status(422).json({ message: "Invalid credentials" });
    }

    let accessToken = jwt.sign({
        data: req.body.username
    }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken
    }

    return res.status(300).json({ message: "login successful" });;
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;

    let Book = books[`${isbn}`];

    let updatedReview = { ...Book[`reviews`], [`${req.user.data}`]: review };
    Book.reviews = updatedReview;
    books = { ...books, [`${isbn}`]: Book }

    return res.status(300).json({ message: "reviews updated", reviews: updatedReview });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    let Book = books[`${isbn}`];
    delete Book.reviews[`${req.user.data}`];
    books = { ...books, [`${isbn}`]: Book }

    return res.status(300).json({ message: "review deleted", reviews: Book });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;