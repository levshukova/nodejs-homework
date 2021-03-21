const Contact = require('./schemas/contact');

const getAllContacts = async (
  userId,
  { sortBy, sortByDesc, filter, limit = '5', page = '1' },
) => {
  const results = await Contact.paginate(
    { owner: userId },
    {
      limit,
      page,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split('|').join(' ') : '',
      populate: {
        path: 'owner',
        select: 'name email -_id',
      },
    },
  );

  const { docs: contacts, totalDocs: total } = results;
  return { total: total.toString(), limit, page, contacts };
};

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email -_id',
  });
  return result;
};

const addContact = async body => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findByIdAndUpdate(
    { _id: contactId, owner: userId },
    { ...reqBody },
    { new: true },
  ).populate({
    path: 'owner',
    select: 'email -_id',
  });
  return result;
};

const removeContact = async (contactId, userId) => {
  const result = await Contact.findByIdAndDelete({
    _id: contactId,
    owner: userId,
  }).populate({
    path: 'owner',
    select: 'email -_id',
  });
  return result;
};

module.exports = {
  getAllContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact,
};
