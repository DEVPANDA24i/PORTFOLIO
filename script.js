/* Smooth scrolling + mobile nav + project modal + demo contact form */

(() => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('navMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.getAttribute('data-state') === 'open';
      menu.setAttribute('data-state', isOpen ? 'closed' : 'open');
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        menu.setAttribute('data-state', 'closed');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      const target = e.target;
      if (!menu.contains(target) && !toggle.contains(target)) {
        menu.setAttribute('data-state', 'closed');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth scroll for internal anchors (same-page). If the anchor target
  // doesn’t exist, do nothing.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });



  // Project modal
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalStack = document.getElementById('modalStack');
  const modalLinks = document.getElementById('modalLinks');

  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const openModalFromButton = (btn) => {
    if (!modal) return;
    if (btn) {
      modalTitle.textContent = btn.getAttribute('data-project-title') || 'Project';
      modalDesc.textContent = btn.getAttribute('data-project-desc') || '';
      modalStack.textContent = btn.getAttribute('data-project-stack') || '';
      modalLinks.textContent = btn.getAttribute('data-project-links') || '';
    }
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  if (modal && modalTitle && modalDesc && modalStack && modalLinks) {
    // Open
    document.querySelectorAll('.project__details').forEach(btn => {
      btn.addEventListener('click', () => openModalFromButton(btn));
    });

    // Close buttons
    document.querySelectorAll('[data-close="true"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
      });
    });

    // Backdrop click
    const backdrop = modal.querySelector('.modal__backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeModal);
    }

    // ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
    });
  }

  // Contact form demo
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (form && note) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.textContent = 'Demo only: connect this form to email/API to receive messages.';
      form.reset();
    });
  }
})();

