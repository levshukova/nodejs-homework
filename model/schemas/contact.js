const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set a name for your contact'],
      unique: true,
      minlength: 2,
      maxlength: 15,
    },
    email: {
      type: String,
      required: [true, 'Set an email for your contact'],
      unique: true,
    },
    phone: {
      type: String,
      required: [true, 'Set a phone number for your contact'],
      unique: true,
    },
    subscription: {
      type: String,
      default: 'free',
      enum: ['free', 'pro', 'premium'],
    },
    password: {
      type: String,
      default: 'password',
    },
    token: {
      type: String,
      default: '',
    },
  },
  { versionKey: false, timestamps: true },
);

const Contact = model('contact', contactSchema);

module.exports = Contact;
