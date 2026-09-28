const { Router } = require('express');
const multer = require("multer");
const { optionController } = require('../controllers');
//const { paginate, upload } = require('../middleware');

// api/option
const optionRouter = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB limit
});

optionRouter
  .route('/')
  .post(upload.single("file"), optionController.saveOption)

optionRouter.post(
  "/save-options-file",
  optionController.saveOptionsFile
);

module.exports = optionRouter;