const express = require('express');
const router = express.Router();
const validate = require('./validation');
const contactsController = require('../../../controllers/contactsController');
const guard = require('../../../helpers/guard');

router
  .get('/', guard, contactsController.getAllContacts)
  .post('/', guard, validate.createContact, contactsController.createContact);

router
  .get('/:id', guard, contactsController.getContactById)
  .delete('/:id', guard, contactsController.removeContact)
  .patch(
    '/:id',
    guard,
    validate.updateContactField,
    contactsController.updateContact,
  );

module.exports = router;
