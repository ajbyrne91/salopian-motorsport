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
