process.env.DATA_FILE = './data/test-submissions.json';

const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../src/app');

const testFile = path.resolve(process.cwd(), process.env.DATA_FILE);

beforeEach(() => {
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
});

afterAll(() => {
  if (fs.existsSync(testFile)) fs.unlinkSync(testFile);
});

describe('POST /api/contact', () => {
  it('rejects invalid email', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'John',
      email: 'bad-email',
      subject: 'Hi',
      message: 'Need security audit',
    });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('accepts valid payload', async () => {
    const res = await request(app).post('/api/contact').send({
      name: 'John',
      email: 'john@example.com',
      subject: 'Hi',
      message: 'Need security audit',
    });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
  });
});

describe('POST /api/newsletter', () => {
  it('rejects missing email', async () => {
    const res = await request(app).post('/api/newsletter').send({ source: 'footer' });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
  });

  it('accepts valid payload', async () => {
    const res = await request(app).post('/api/newsletter').send({
      email: 'john@example.com',
      source: 'footer',
    });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
  });
});
