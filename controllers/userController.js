const User = require("../models/useModel")

//Create a new user
const createUser = async(req, res) =>{
    const{userName, password} = req.body
    try{
        const user = await User.create({userName, password})
        res.status(200).json(user)
    }
    catch(error){
        res.status(400).json({ error: "Could not create user, please enter valid username and password" });
    }

}

//authenticate user
const checkUser = async(req, res) => {
    const{userName, password} = req.body

   // try{
        const user = await User.findOne({userName, password})

        if(!user){
            res.status(400).json({ error: "User not found please create an account" });

        }

        if(user.password != password){
            res.status(400).json({ error: "Incorrect password" });

        }

        else if(user.password == password){
            res.status(200).json("Login successful!" );

        }


   // }

    /*catch(error){
        res.status(400).json({ error: "Could not create user, please enter valid username and password\nor create a new account" });
    }*/
}

//Check password

module.exports = {
    createUser,
    checkUser
    
}