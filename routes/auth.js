const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');




//Create a User using: POST '/api/auth/'. Doesn't require Auth
router.post('/',[
    body('name', 'Enter a valid name').isLength({min: 3}),
    body('password', 'Enter a valid password').isLength({min: 5}),
    body('email', 'Enter a valid email').isEmail(), //this message after comma is the custom message you want to send when the input doesn't satisfy the validation
],(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //if there is any error it sends that error with its type
    }
    User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
    }).then(user=> res.json(user))
    .catch(err=>{console.log(err)
    res.json({error: 'Please enter a unique value for email', message: err.message})});
    
})
module.exports = router; 