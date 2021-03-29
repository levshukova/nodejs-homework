const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs').promises;
const Jimp = require('jimp');
const { nanoid } = require('nanoid');

const createFolderIsExist = require('../helpers/create-dir');

require('dotenv').config();

const Users = require('../model/users');
const { HttpCode, Status } = require('../helpers/constants');
const EmailService = require('../services/emailService');

const SECRET_KEY = process.env.JWT_SECRET;

async function create(req, res, next) {
  try {
    const { email, name } = req.body;

    const user = await Users.findByEmail(email);
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: Status.ERROR,
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'This email is already in use',
      });
    }

    const verificationToken = nanoid();

    const emailService = new EmailService(process.env.NODE_ENV);
    await emailService.sendVerificationEmail(verificationToken, email, name);
    const newUser = await Users.create({ ...req.body, verificationToken });
    return res.status(HttpCode.CREATED).json({
      status: Status.SUCCESS,
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await Users.findByEmail(email);
    const isPasswordValid = await user?.validPassword(password);

    if (!user || !isPasswordValid || !user.verified) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: Status.ERROR,
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'Invalid credentials',
      });
    }

    const id = user._id;
    const payload = { id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });
    await Users.updateToken(id, token);
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        token,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function logout(req, res, next) {
  try {
    const id = req.user.id;
    await Users.updateToken(id, null);
    return res.status(HttpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
}

async function current(req, res, next) {
  try {
    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription: req.user.subscription,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function updateSubscription(req, res, next) {
  try {
    const id = req.user.id;
    const subscription = req.body.subscription;
    await Users.updateSubscription(id, subscription);

    return res.status(HttpCode.OK).json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        id: req.user.id,
        email: req.user.email,
        subscription,
      },
    });
  } catch (e) {
    next(e);
  }
}

async function addAvatarToStatic(req) {
  const id = String(req.user._id);
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;
  const pathFile = req.file.path;
  const newNameAvatar = `${Date.now()}-${req.file.originalname}`;
  const img = await Jimp.read(pathFile);
  await img
    .autocrop()
    .cover(250, 250, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
    .writeAsync(pathFile);
  await createFolderIsExist(path.join(AVATARS_OF_USERS, id));
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, id, newNameAvatar));
  const avatarUrl = path.join(id, newNameAvatar);
  try {
    await fs.unlink(
      path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatarURL),
    );
  } catch (e) {
    console.log(e.message);
  }
  return avatarUrl;
}

const updateAvatar = async (req, res, next) => {
  try {
    const id = String(req.user._id);
    const avatarUrl = await addAvatarToStatic(req);
    await Users.updateAvatarUrl(id, avatarUrl);
    return res.json({
      status: Status.SUCCESS,
      code: HttpCode.OK,
      data: {
        avatarUrl,
      },
    });
  } catch (e) {
    next(e);
  }
};

async function verifyEmail(req, res, next) {
  try {
    const user = await Users.findUserByVerificationToken(
      req.params.verificationToken,
    );

    if (user) {
      await Users.updateVerificationToken(user._id, true, null);

      return res.status(HttpCode.OK).json({
        status: Status.SUCCESS,
        code: HttpCode.OK,
        message: 'Verification is successful',
      });
    }

    return res.status(HttpCode.BAD_REQUEST).json({
      status: Status.ERROR,
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Link is not valid',
    });
  } catch (e) {
    next(e);
  }
}

module.exports = {
  create,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
  verifyEmail,
};
