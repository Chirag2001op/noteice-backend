const express = require("express");
const router = express.Router();
var fetchuser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//Route 1 : Get all the notes using: GET "/api/notes/fetchalluser". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.meassage);
        res.status(500).send("Internal server error");
      }
});

//Route 2 : Add a new note using POST "api/notes/addnotes". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid tile").isLength({ min: 3 }),
    body("description", "Enter a valid description").isLength({ min: 5 }), //this message after comma is the custom message you want to send when the input doesn't satisfy the validation
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      // If there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
        console.error(error.meassage);
        res.status(500).send("Internal server error");
      }
  }
);
module.exports = router;
