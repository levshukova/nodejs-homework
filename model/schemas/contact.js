const mongoose = require('mongoose');
const { Schema, model, SchemaTypes } = mongoose;
const { ContactType } = require('../../helpers/constants');

const mongoosePaginate = require('mongoose-paginate-v2');

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
    category: {
      type: String,
      enum: {
        values: [ContactType.FRIEND, ContactType.WORK, ContactType.OTHER],
        message: "This category doesn't exist",
      },
      default: ContactType.OTHER,
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.plugin(mongoosePaginate);

const Contact = model('contact', contactSchema);

module.exports = Contact;
