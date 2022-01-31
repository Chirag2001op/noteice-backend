const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require('../middleware/fetchUser');

const JWT_SECRET = "ChinuIsGreat$";




//Route 1: Create a User using: POST '/api/auth/createUser'. No login required
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("password", "Enter a valid password").isLength({ min: 5 }),
    body("email", "Enter a valid email").isEmail(), //this message after comma is the custom message you want to send when the input doesn't satisfy the validation
  ],
  async (req, res) => {
    //if there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //if there is any error it sends that error with its type
    }
    //Wrapping everything in a try catch method
    try {
      //check whether the user with email exixts already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exixts" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //creating new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      // .then(user=> res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error: 'Please enter a unique value for email', message: err.message})}); //Commenting out this beause if there is any other error than email then we can send this error message

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      console.log(authToken);

      res.json({ authToken });
      // res.json(user);  //we are not sending user anymore we will be sending authToken now
    } catch (error) {
      console.error(error.meassage);
      res.status(500).send("Internal server error");
    }
  }
);



//Route 2: Authentication a user using : POST"api/auth/login" no login required
router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(), //this message after comma is the custom message you want to send when the input doesn't satisfy the validation
    body("password", "Password cannot be blank").exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //if there is any error it sends that error with its type
    }

    const {email, password} = req.body;
    try{
      let user = await User.findOne({email});
      if(!user){
        return res.status(400).json({error:"Please try to login with correct credentials"});
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if(!passwordCompare){
        return res.status(400).json({error:"Please try to login with correct credentials"});
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({authToken})
    }catch(error){
      console.error(error.meassage);
      res.status(500).send("Internal server error");
    }
  }
);

//Route 3: Get Logged in user details using: POST "/api/auth/getUser".  login required
router.post("/getUser" , fetchuser, async (req, res) => {
try {
  const userId = req.user.id;
  const user = await User.findById(userId).select("-password");
  res.send(user)
} catch (error) {
  
}});
module.exports = router;
