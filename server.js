const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require("./routes/user")
// Creating express app and storing it in app
const app = express()

app.use(express.json())
app.use((req, res, next) => { 
    console.log(req.path, req.method)
    next() 
})

app.get('/', (req, res) => {
    res.json({ mssg: "Welcome to the app" })
})

app.use('/api/user', userRoutes)

//connect to the database
mongoose.connect("[Insert DATABASE CONNECTION STRING")
    .then(() => {
        app.listen(5173, () => {
            console.log("Listening on Port 4000")
        })
    })
    .catch((error) => {
        console.log(error)
    })



