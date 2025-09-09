const express = require('express');
const { register, login, getUser, updateUserAndLogin, resetPassword, forgotPassword, currentUser } = require('../controllers/auth.controller');
const { getCurrentUser } = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/currentUser',authMiddleware.verifyToken, currentUser);
router.get('/me', getCurrentUser);
router.post('/register', register);
router.post('/login', login);
router.put('/updateAndLogin/:id', updateUserAndLogin);
router.post('/user', getUser);
router.post('/forgotPassword', forgotPassword);
router.put('/resetPassword/:token', resetPassword);

module.exports = router;