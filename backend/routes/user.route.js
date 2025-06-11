const express = require('express');
const { authenticate } = require('../configs/auth.middleware');
const { authorize } = require('../configs/role.middleware');
const controller = require('../controllers/user.controller');

const router = express.Router();

router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/', authenticate, authorize('admin'), controller.listUsers);
router.put('/:id', authenticate, authorize('admin'), controller.updateUser);
router.delete('/:id', authenticate, authorize('admin'), controller.deleteUser);

module.exports = router;
