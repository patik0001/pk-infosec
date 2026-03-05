const nodemailer = require('nodemailer');

function createTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return nodemailer.createTransport({ jsonTransport: true });
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(SMTP_SECURE).toLowerCase() === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

const transporter = createTransporter();

async function sendAdminNotification({ type, payload }) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const from = process.env.FROM_EMAIL || 'no-reply@example.com';

  if (!adminEmail) return;

  await transporter.sendMail({
    from,
    to: adminEmail,
    subject: `[pk-infosec] New ${type} submission`,
    text: JSON.stringify(payload, null, 2),
  });
}

async function sendUserAck({ email, type }) {
  const from = process.env.FROM_EMAIL || 'no-reply@example.com';
  await transporter.sendMail({
    from,
    to: email,
    subject: `[pk-infosec] We received your ${type}`,
    text: `Hello,\n\nWe received your ${type} request. Our team will get back to you soon.\n\n- pk-infosec`,
  });
}

module.exports = {
  sendAdminNotification,
  sendUserAck,
};
