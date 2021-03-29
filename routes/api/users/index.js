const express = require('express');
const router = express.Router();

const usersController = require('../../../controllers/usersController');
const guard = require('../../../helpers/guard');
const upload = require('../../../helpers/upload');

const validate = require('./validation');

router.post('/register', validate.validateAuth, usersController.create);
router.post('/login', validate.validateAuth, usersController.login);
router.post('/logout', guard, usersController.logout);
router.get('/current', guard, usersController.current);
router.patch(
  '/',
  guard,
  validate.validateUpdateSub,
  usersController.updateSubscription,
);
router.patch(
  '/avatar',
  [guard, upload.single('avatar'), validate.updateAvatar],
  usersController.updateAvatar,
);
router.get('/verify/:verificationToken', usersController.verifyEmail);

module.exports = router;
