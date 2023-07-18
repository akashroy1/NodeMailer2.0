const express = require("express");
const multer = require("multer");

const { mailSender } = require("../controllers/mailSender");

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post("/", upload.fields([{ name: 'csvFile' }, { name: 'attachment', maxCount: 5 }]), mailSender);

module.exports = router;