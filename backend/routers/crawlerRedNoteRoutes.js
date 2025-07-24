const express = require("express");
const router = express.Router();

const RedNoteController = require("../controllers/redNote/RedNoteController");

router.post("/crawlAndSave", RedNoteController.crawlAndSave);

module.exports = router;
