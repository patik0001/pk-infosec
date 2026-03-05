(function () {
  const API_BASE_URL = (window.PK_API_BASE_URL || 'http://localhost:3001').replace(/\/$/, '');

  function setStatus(node, type, message) {
    if (!node) return;
    node.textContent = message;
    node.style.color = type === 'error' ? '#ff2244' : type === 'success' ? '#00ff88' : '#00e5ff';
  }

  async function postJson(path, body) {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const statusNode = form.querySelector('[data-form-status]');
    const submitBtn = form.querySelector('button[type="submit"]');

    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      message: form.message.value.trim(),
    };

    submitBtn.disabled = true;
    setStatus(statusNode, 'loading', 'Envoi en cours...');

    try {
      const result = await postJson('/api/contact', payload);
      if (!result.ok) {
        const errors = Array.isArray(result.data.errors) ? result.data.errors.join(', ') : 'Erreur de validation.';
        setStatus(statusNode, 'error', `Échec envoi: ${errors}`);
        return;
      }
      setStatus(statusNode, 'success', 'Message envoyé. Nous revenons vers vous sous 24h ouvrées.');
      form.reset();
    } catch (_err) {
      setStatus(statusNode, 'error', 'Service indisponible. Réessayez dans quelques minutes.');
    } finally {
      submitBtn.disabled = false;
    }
  }

  async function handleNewsletterSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const statusNode = form.querySelector('[data-form-status]');
    const submitBtn = form.querySelector('button[type="submit"]');

    const payload = {
      email: form.email.value.trim(),
      source: form.dataset.source || 'website',
    };

    submitBtn.disabled = true;
    setStatus(statusNode, 'loading', 'Inscription en cours...');

    try {
      const result = await postJson('/api/newsletter', payload);
      if (!result.ok) {
        const errors = Array.isArray(result.data.errors) ? result.data.errors.join(', ') : 'Erreur de validation.';
        setStatus(statusNode, 'error', `Échec inscription: ${errors}`);
        return;
      }
      setStatus(statusNode, 'success', 'Inscription confirmée. Merci.');
      form.reset();
    } catch (_err) {
      setStatus(statusNode, 'error', 'Service indisponible. Réessayez dans quelques minutes.');
    } finally {
      submitBtn.disabled = false;
    }
  }

  function wireForms() {
    document.querySelectorAll('[data-contact-form]').forEach((form) => {
      form.addEventListener('submit', handleContactSubmit);
    });

    document.querySelectorAll('[data-newsletter-form]').forEach((form) => {
      form.addEventListener('submit', handleNewsletterSubmit);
    });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { handleContactSubmit, handleNewsletterSubmit, wireForms };
  }

  if (typeof window !== 'undefined') {
    window.PKFrontend = { handleContactSubmit, handleNewsletterSubmit, wireForms };
    if (typeof document !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', wireForms);
      } else {
        wireForms();
      }
    }
  }
})();
