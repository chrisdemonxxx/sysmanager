const express = require('express');
const controller = require('../controllers/remote.controller');

const router = express.Router();

router.get('/screenshot', controller.captureScreenshot);
router.get('/processes', controller.listProcesses);
router.delete('/processes/:pid', controller.killProcess);
router.get('/files', controller.listFiles);
router.get('/download', controller.downloadFile);
router.delete('/files', controller.deleteFile);
router.get('/security', controller.detectSecuritySoftware);

module.exports = router;
