const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Create a User using: POST '/api/auth/createUser'. No login required
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
      //creating new user
      user = await User.create({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
      });
      // .then(user=> res.json(user))
      // .catch(err=>{console.log(err)
      // res.json({error: 'Please enter a unique value for email', message: err.message})}); //Commenting out this beause if there is any other error than email then we can send this error message
      res.json(user);
    } catch (error) {
      console.error(error.meassage);
      res.status(500).send("Some Error occured");
    }
  }
);
module.exports = router;
