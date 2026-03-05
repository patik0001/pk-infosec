describe('Frontend E2E form flows', () => {
  beforeEach(() => {
    jest.resetModules();
    global.window = { PK_API_BASE_URL: 'http://localhost:3001' };
  });

  function createContactForm() {
    const statusNode = { textContent: '', style: {} };
    const submitBtn = { disabled: false };
    return {
      name: { value: 'Alice' },
      email: { value: 'alice@example.com' },
      subject: { value: 'Audit' },
      message: { value: 'Hello' },
      reset: jest.fn(),
      querySelector: (selector) => {
        if (selector === '[data-form-status]') return statusNode;
        if (selector === 'button[type="submit"]') return submitBtn;
        return null;
      },
      _statusNode: statusNode,
      _submitBtn: submitBtn,
    };
  }

  function createNewsletterForm() {
    const statusNode = { textContent: '', style: {} };
    const submitBtn = { disabled: false };
    return {
      email: { value: 'bad-email' },
      dataset: { source: 'footer' },
      reset: jest.fn(),
      querySelector: (selector) => {
        if (selector === '[data-form-status]') return statusNode;
        if (selector === 'button[type="submit"]') return submitBtn;
        return null;
      },
      _statusNode: statusNode,
      _submitBtn: submitBtn,
    };
  }

  it('contact flow success', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ ok: true }),
    });

    const { handleContactSubmit } = require('../../frontend.js');
    const form = createContactForm();

    await handleContactSubmit({
      preventDefault: () => {},
      currentTarget: form,
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/contact',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(form._statusNode.textContent).toContain('Message envoyé');
  });

  it('newsletter flow validation error', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: async () => ({ ok: false, errors: ['Invalid email'] }),
    });

    const { handleNewsletterSubmit } = require('../../frontend.js');
    const form = createNewsletterForm();

    await handleNewsletterSubmit({
      preventDefault: () => {},
      currentTarget: form,
    });

    expect(fetch).toHaveBeenCalledWith(
      'http://localhost:3001/api/newsletter',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(form._statusNode.textContent).toContain('Échec inscription');
  });
});
