/*
This is where the commands are passed through.
EX: router.post adds a user to the database
router.delete can remove a user from the data base

React buttons should call different router. methods
Ex: create account button should somehow connect to router.post
*/

const express = require("express");
const router = express.Router()
const{
    createUser,
    checkUser
}= require('../controllers/userController')

router.get('/', (req, res) => {
    res.json({mssg: 'GET ALL USERS'})
})

router.get('/:id', (req , res) => {
    res.json({mssg: 'GET A SINGLE USER'})
})

router.post('/', createUser)

router.post('/login', checkUser)

module.exports = router