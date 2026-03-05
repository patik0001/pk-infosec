const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const { appendEntry, ensureStore } = require('./storage');
const { sendAdminNotification, sendUserAck } = require('./mailer');
const { validateContact, validateNewsletter } = require('./validation');

const app = express();

app.use(helmet());
app.use(express.json({ limit: '25kb' }));

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', writeLimiter);

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  const validation = validateContact(req.body || {});
  if (!validation.ok) {
    return res.status(400).json({ ok: false, errors: validation.errors });
  }

  const payload = {
    type: 'contact',
    ...validation.data,
  };

  ensureStore();
  appendEntry(payload);

  try {
    await sendAdminNotification({ type: 'contact', payload });
    await sendUserAck({ email: validation.data.email, type: 'contact request' });
  } catch (error) {
    console.error('Email send failed:', error.message);
  }

  return res.status(201).json({ ok: true, message: 'Contact request received.' });
});

app.post('/api/newsletter', async (req, res) => {
  const validation = validateNewsletter(req.body || {});
  if (!validation.ok) {
    return res.status(400).json({ ok: false, errors: validation.errors });
  }

  const payload = {
    type: 'newsletter',
    ...validation.data,
  };

  ensureStore();
  appendEntry(payload);

  try {
    await sendAdminNotification({ type: 'newsletter', payload });
    await sendUserAck({ email: validation.data.email, type: 'newsletter subscription' });
  } catch (error) {
    console.error('Email send failed:', error.message);
  }

  return res.status(201).json({ ok: true, message: 'Newsletter subscription received.' });
});

module.exports = app;
