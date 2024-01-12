'use strict';
const  auth = require('basic-auth');
const bcrypt = require('bcryptjs');
const { User } = require('../models/');
console.log("User from credentials", User);


exports.authenticateUser = async (req, res, next) => {
    // basic auth module credentials
    const credentials = auth(req);
    console.log({credentials})
    let message; 

    if (credentials){
        console.log(credentials.name, credentials.pass)
            //user in database
        const user = await User.findOne({where: {emailAddress: credentials.name}});
        if (user){
            console.log('found user', user.emailAddress,)
            // match password provided in credentials
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);
            if (authenticated){
                console.log("Authentication successful for user.", user.emailAddress);
                req.currentUser = user;
            } else {
                message = "Authentication failed.";
            }
        } else {
            message = "User not found.";
        }
    } else {
        message = "Auth header not found.";
    }

    if (message){
        console.warn(message);
        res.status(401).json({ message: 'Access denied.' })
    } else {
        next();
    }
}