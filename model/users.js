const User = require('./schemas/user');

const findByEmail = async email => {
  return await User.findOne({ email });
};

const findById = async id => {
  return await User.findOne({ _id: id });
};

const create = async ({ email, password, verificationToken }) => {
  const user = new User({ email, password, verificationToken });
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubscription = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

const updateAvatarUrl = async (id, url) => {
  return await User.updateOne({ _id: id }, { avatarURL: url });
};

const findUserByVerificationToken = async verificationToken => {
  return await User.findOne({ verificationToken });
};

const updateVerificationToken = async (id, verified, verificationToken) => {
  return await User.findOneAndUpdate(
    { _id: id },
    { verified, verificationToken },
  );
};

module.exports = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateSubscription,
  updateAvatarUrl,
  findUserByVerificationToken,
  updateVerificationToken,
};
