const router = require("express").Router();
const { request } = require("express");
let User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

//http://localhost:8070/user/register
//register a new user
const register = async(req, res)=> {
    const user = req.body;
    const newUser = new User();

    newUser.firstName = user.firstName;
    newUser.lastName = user.lastName;
    newUser.password = newUser.generateHash(user.password);
    newUser.userType = user.userType;
    newUser.email = user.email;
    newUser.phone = user.phone;
    newUser.address = user.address;

    await newUser.save().then((user)=> {
            // res.json("User Registered")
            jwt.sign(
                {id: user._id, userType: user.userType}, 'jwtSecret', {expiresIn: '1d'},
                (err, token)=>{
                    if(err) throw err;
                    res.json({
                        user,
                        token
                    });
                }
            )
        }).catch((err)=>{
            console.log(err)
    })
}

//http://localhost:8070/user/
//get all users

const getAllUsers = async(req, res)=>{
    await User.find().then((users)=>{
        res.json(users)
    }).catch((err)=>{
        console.log(err)
    })
}

//get a user by the id
const getUserByID = async(req, res)=>{
    let id = req.params.id;
    await User.findById(id).then((user)=>{
        res.status(200).send({user: user})
    }).catch((err)=>{
        res.status(500).send({status: "Error with get user", error:err.message});
    })
}

module.exports = {
    register,
    getAllUsers,
    getUserByID
};