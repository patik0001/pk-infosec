const validator = require('validator');

function sanitizeText(value = '') {
  return validator.escape(String(value).replace(/[\x00-\x1F\x7F]/g, '').trim());
}

function isLengthOk(value, max) {
  return typeof value === 'string' && value.length > 0 && value.length <= max;
}

function validateContact(input) {
  const name = sanitizeText(input.name);
  const email = sanitizeText(input.email).toLowerCase();
  const subject = sanitizeText(input.subject || '');
  const message = sanitizeText(input.message || '');

  const errors = [];

  if (!validator.isEmail(email)) errors.push('Invalid email');
  if (!isLengthOk(name, 120)) errors.push('Invalid name length');
  if (!isLengthOk(subject, 180)) errors.push('Invalid subject length');
  if (!isLengthOk(message, 4000)) errors.push('Invalid message length');

  return {
    ok: errors.length === 0,
    errors,
    data: { name, email, subject, message },
  };
}

function validateNewsletter(input) {
  const email = sanitizeText(input.email).toLowerCase();
  const source = sanitizeText(input.source || 'website');

  const errors = [];

  if (!validator.isEmail(email)) errors.push('Invalid email');
  if (!isLengthOk(source, 120)) errors.push('Invalid source length');

  return {
    ok: errors.length === 0,
    errors,
    data: { email, source },
  };
}

module.exports = {
  validateContact,
  validateNewsletter,
};
