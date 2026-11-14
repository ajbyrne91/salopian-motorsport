const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    });
  });
}

document.querySelectorAll('[data-current-year]').forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const bookingForm = document.querySelector('#bookingForm');

if (bookingForm) {
  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const button = bookingForm.querySelector('button[type="submit"]');
    const status = bookingForm.querySelector('.form-status');
    const data = new FormData(bookingForm);

    const bike = [data.get('make'), data.get('model')].filter(Boolean).join(' ');
    const subjectParts = [
      data.get('service'),
      bike || null,
      data.get('registration') ? `(${data.get('registration')})` : null
    ].filter(Boolean);

    const message = [
      `Service: ${data.get('service') || 'Not specified'}`,
      `Registration: ${data.get('registration') || 'Not provided'}`,
      `Make: ${data.get('make') || 'Not provided'}`,
      `Model: ${data.get('model') || 'Not provided'}`,
      `Mileage: ${data.get('mileage') || 'Not provided'}`,
      `Preferred date: ${data.get('preferredDate') || 'Not provided'}`,
      `Location preference: ${data.get('visit') || 'Workshop appointment'}`,
      '',
      'Work / symptoms:',
      data.get('details') || ''
    ].join('\n');

    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      phone: data.get('phone'),
      subject: subjectParts.join(' - ') || 'Motorcycle booking request',
      message
    };

    button.disabled = true;
    button.textContent = 'Sending…';
    status.className = 'form-status';
    status.textContent = 'Sending your booking request…';

    try {
      await fetch(bookingForm.action, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      bookingForm.reset();
      status.classList.add('success');
      status.textContent = 'Thanks — your request has been sent. We’ll contact you to discuss the work and arrange an appointment.';
    } catch (error) {
      console.error(error);
      status.classList.add('error');
      status.textContent = 'Sorry, the form could not be sent. Please call 07874 072613 or email info@salopianmotorsport.co.uk.';
    } finally {
      button.disabled = false;
      button.textContent = 'Send booking request';
    }
  });
}

// Leave disabled until the Ars customer-beta release and privacy notice are accepted.
// A widget token is public embed configuration, never a staff credential or API secret.
const ARS_WIDGET_BETA = Object.freeze({
  enabled: false,
  widgetToken: '',
  privacyNoticeUrl: ''
});

function installArsWidgetBeta(config) {
  const websiteOrigins = [
    'https://salopianmotorsport.co.uk',
    'https://www.salopianmotorsport.co.uk'
  ];
  if (config?.enabled !== true) return;
  if (!websiteOrigins.includes(window.location.origin)) return;
  if (!/^ars_w_[A-Za-z0-9_-]{32,128}$/.test(config.widgetToken || '')) return;

  let privacyNotice;
  try {
    privacyNotice = new URL(config.privacyNoticeUrl);
    if (!websiteOrigins.includes(privacyNotice.origin) ||
        privacyNotice.pathname === '/' || privacyNotice.username ||
        privacyNotice.password || privacyNotice.search || privacyNotice.hash) return;
  } catch {
    return;
  }

  if (document.getElementById('ars-widget-beta')) return;
  const footer = document.querySelector('.site-footer');
  if (!footer?.parentNode) return;

  function create(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  const section = create('section', 'ars-beta shell');
  section.id = 'ars-widget-beta';
  section.setAttribute('aria-labelledby', 'ars-beta-title');
  section.appendChild(create('p', 'eyebrow', 'Optional beta assistant'));
  const title = create('h2', '', 'A new way to ask about your motorcycle');
  title.id = 'ars-beta-title';
  section.appendChild(title);
  section.appendChild(create('p', '', 'Service questions and staff-reviewed enquiries only. Contact the workshop directly to arrange an appointment.'));

  const reveal = create('button', 'button secondary', 'About the beta assistant');
  reveal.type = 'button';
  reveal.setAttribute('aria-expanded', 'false');
  reveal.setAttribute('aria-controls', 'ars-beta-panel');
  section.appendChild(reveal);

  const panel = create('div', 'ars-beta-panel');
  panel.id = 'ars-beta-panel';
  panel.hidden = true;
  const notice = create('h3', '', 'Before you start');
  notice.tabIndex = -1;
  panel.appendChild(notice);
  panel.appendChild(create('p', '', 'This beta AI assistant handles enquiries and service questions only. It cannot book, change or cancel appointments, provide portal access, or take payments. Its replies may be wrong; check important details with the workshop.'));
  panel.appendChild(create('p', '', 'Messages are processed using AI and saved in Ars Stataria for Alex Byrne to review. Our raw beta chat policy is 30 days; necessary enquiry details may be retained separately. Handoffs go to the staff queue, with no automatic emails or texts.'));
  panel.appendChild(create('p', '', 'Please share only what is needed for your enquiry. Do not enter passwords, card details, health information or sensitive documents. You can contact the workshop as usual instead.'));
  const privacy = create('a', '', 'Read how your information is handled');
  privacy.href = privacyNotice.href;
  panel.appendChild(privacy);

  const actions = create('div', 'ars-beta-actions');
  const start = create('button', 'button primary', 'Start beta assistant');
  start.type = 'button';
  const close = create('button', 'button secondary', 'Not now');
  close.type = 'button';
  actions.appendChild(start);
  actions.appendChild(close);
  panel.appendChild(actions);

  const status = create('p', 'ars-beta-status');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.setAttribute('aria-atomic', 'true');
  panel.appendChild(status);
  const fallback = create('p', 'ars-beta-fallback');
  const contact = create('a', '', 'Contact the workshop');
  contact.href = 'contact.html';
  const phone = create('a', '', 'call 07874 072613');
  phone.href = 'tel:+447874072613';
  fallback.appendChild(contact);
  fallback.appendChild(document.createTextNode(' or '));
  fallback.appendChild(phone);
  fallback.appendChild(document.createTextNode(' if you prefer.'));
  panel.appendChild(fallback);
  section.appendChild(panel);
  footer.parentNode.insertBefore(section, footer);

  function setPanelOpen(open) {
    panel.hidden = !open;
    reveal.setAttribute('aria-expanded', String(open));
    if (open) notice.focus();
    else reveal.focus();
  }
  reveal.addEventListener('click', () => setPanelOpen(panel.hidden));
  close.addEventListener('click', () => setPanelOpen(false));
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      setPanelOpen(false);
    }
  });

  let started = false;
  start.addEventListener('click', () => {
    if (started || document.getElementById('ars-widget-beta-script')) return;
    started = true;
    start.disabled = true;
    start.textContent = 'Loading assistant…';
    status.textContent = 'The assistant is loading. You can still contact the workshop below.';
    const script = document.createElement('script');
    script.id = 'ars-widget-beta-script';
    script.src = 'https://app.arsstataria.co.uk/widget.js';
    script.async = true;
    script.referrerPolicy = 'strict-origin-when-cross-origin';
    script.setAttribute('data-widget-token', config.widgetToken);
    let phase = 'loading';
    function stopListening() {
      window.removeEventListener('ars-widget:ready', ready);
      window.removeEventListener('ars-widget:error', unavailable);
    }
    function ready() {
      if (phase !== 'loading') return;
      phase = 'ready';
      stopListening();
      start.textContent = 'Assistant launcher ready';
      status.textContent = 'The assistant launcher is ready. Use “Ask Ars” to open it. You can still contact the workshop below.';
    }
    function unavailable() {
      if (phase !== 'loading') return;
      phase = 'error';
      stopListening();
      start.textContent = 'Assistant unavailable';
      status.textContent = 'The assistant is unavailable. Please contact the workshop below.';
    }
    window.addEventListener('ars-widget:ready', ready);
    window.addEventListener('ars-widget:error', unavailable);
    script.addEventListener('load', () => {
      if (phase !== 'loading') return;
      status.textContent = 'The assistant is loading. Use “Ask Ars” when it becomes available, or contact the workshop below.';
    });
    script.addEventListener('error', () => {
      unavailable();
    });
    document.body.appendChild(script);
  });
}

installArsWidgetBeta(ARS_WIDGET_BETA);
