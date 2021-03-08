const fs = require('fs/promises');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, './contacts.json');

const listContacts = async () => {
  try {
    const result = await fs.readFile(contactsPath, 'utf8');
    const contacts = JSON.parse(result);
    return contacts;
  } catch (error) {
    return console.error(error.message);
  }
};

const getContactById = async contactId => {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(({ id }) => id.toString() === contactId);
    return contact;
  } catch (error) {
    return console.error(error.message);
  }
};

const removeContact = async contactId => {
  try {
    const contacts = await listContacts();

    if (contacts.find(contact => contact.id === contactId)) {
      const updatedContacts = contacts.filter(
        contact => contact.id !== contactId,
      );
      await fs.writeFile(
        contactsPath,
        JSON.stringify(updatedContacts, null, 2),
        'utf8',
      );
      console.log(`Contact (id ${contactId}) has been removed`);
    }
    return contacts;
  } catch (error) {
    return console.error(error.message);
  }
};

const addContact = async body => {
  try {
    const contacts = await listContacts();
    const newContact = { id: uuidv4(), ...body };
    const updatedContacts = [...contacts, newContact];

    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts), 'utf8');
    return newContact;
  } catch (error) {
    return console.error(error.message);
  }
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contact = contacts.filter(({ id }) => id.toString() === contactId);

  const newContact = { ...contact, ...body };
  const newContacts = contacts.map(contact =>
    contact.id.toString() === contactId ? newContact : contact,
  );

  await fs.writeFile(pathToContacts, JSON.stringify(newContacts, null, 2));
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
