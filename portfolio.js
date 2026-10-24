// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');
menuBtn.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

// Photo fallback: show initials if photo.jpg is missing
const photo = document.getElementById('photo');
const wrap = photo.parentElement;
function checkPhoto(){ if (!photo.complete || photo.naturalWidth === 0) wrap.classList.add('no-photo'); }
photo.addEventListener('error', () => wrap.classList.add('no-photo'));
if (photo.complete) checkPhoto();

// Skill bars fill when scrolled into view
const fills = document.querySelectorAll('.bar i');
const fill = el => { el.style.width = el.dataset.level + '%'; };
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { fill(e.target); io.unobserve(e.target); } });
  }, { threshold: .4 });
  fills.forEach(f => io.observe(f));
} else { fills.forEach(fill); }

// Highlight current section in navbar
const sections = document.querySelectorAll('main section[id]');
const links = navLinks.querySelectorAll('a');
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => spy.observe(s));

// Contact form: validate, then open the visitor's email app with the message filled in
const EMAIL = 'youremail@example.com'; // <-- change to your real email
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  [form.name, form.email, form.message].forEach(f => f.classList.remove('invalid'));
  status.className = 'status';

  let bad = null;
  if (!name) bad = form.name;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad = form.email;
  else if (!message) bad = form.message;
  if (bad) {
    bad.classList.add('invalid'); bad.focus();
    status.textContent = bad === form.email ? 'Enter a valid email address.' : 'Fill in this field before sending.';
    status.classList.add('error');
    return;
  }
  const subject = encodeURIComponent('Portfolio message from ' + name);
  const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');
  window.location.href = 'mailto:' + EMAIL + '?subject=' + subject + '&body=' + body;
  status.textContent = 'Opening your email app. Press send there to finish.';
  status.classList.add('ok');
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
