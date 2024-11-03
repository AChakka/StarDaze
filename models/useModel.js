/*
This is the schema, basically declares the structure of user like the username and password
*/

const mongoose = require("mongoose")

const Schema = mongoose.Schema

const useSchema = new Schema({
    userName: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('Use', useSchema)

