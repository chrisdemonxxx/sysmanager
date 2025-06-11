const express = require('express');
const controller = require('../controllers/remote.controller');
const { authenticate } = require('../configs/auth.middleware');

const router = express.Router();

router.get('/screenshot', authenticate, controller.captureScreenshot);
router.get('/processes', authenticate, controller.listProcesses);
router.delete('/processes/:pid', authenticate, controller.killProcess);
router.get('/files', authenticate, controller.listFiles);
router.get('/download', authenticate, controller.downloadFile);
router.delete('/files', authenticate, controller.deleteFile);
router.get('/security', authenticate, controller.detectSecuritySoftware);

module.exports = router;
