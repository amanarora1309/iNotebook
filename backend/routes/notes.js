const express = require('express');
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middlewares/fetchuser");
const { body, validationResult } = require("express-validator");

// Route 1: Get all Notes using: GET "/api/notes/fetchallnotes" .Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
})


// Route 2: Add a new note using: POST "/api/notes/addnote" .Login required
router.post('/addnote', fetchuser,[
    body('title', 'Enter a valid tile').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 })], async (req, res) => {

        const {title, description, tag} = req.body;
        // If there are errors, return Bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors)
            return res.status(400).json({ error: errors.array() });
        }

        try {
            let saveNote = await Note.create({title: title, description: description, tag: tag, user: req.user.id});
            res.json(saveNote);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal Server Error");
        }
        
    })



// Route 3: Update an exsisting Note using: PUT "/api/notes/updatenote" .Login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const {title, description, tag} = req.body;
    try{
        // Create a newNote object 
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Find the note to be updated and update it 
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found");
        }
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json({note});        
    } catch(err){
        console.log(err.message);
        res.status(500).send("Internal server error")
    }
    
})



// Route 4: Delete an exsisting Note using: DELETE "/api/notes/updatenote" .Login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try{
        // Find the note to be Deleted and Delete it 
        let note = await Note.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not found");
        }
        // Allow deltion only if user owns this Note
        if(note.user.toString() !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.send({"Success": "Note has been deleted", note: note});        
    } catch(err){
        console.log(err.message);
        res.status(500).send("Internal server error")
    }
    
})



module.exports = router;