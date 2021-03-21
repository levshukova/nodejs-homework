const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const contactsRouter = require('./routes/api/contacts');
const authRouter = require('./routes/api/users');

const { HttpCode } = require('./helpers/constants');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/contacts', contactsRouter);
app.use('/api/auth', authRouter);

app.use((_req, res) => {
  res.status(HttpCode.NOT_FOUND).json({ message: 'Not found' });
});

app.use((err, _req, res, _next) => {
  res.status(HttpCode.INTERNAL_SERVER_ERROR).json({ message: err.message });
});

module.exports = app;
