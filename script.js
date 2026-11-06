const openButton = document.getElementById('envelopeButton');
const envelope = document.getElementById('envelope');
const opening = document.getElementById('opening');
const invitation = document.getElementById('invitationContent');
let opened = false;
// Always start on the envelope when a visitor opens the link.
opening.hidden = false;
invitation.hidden = true;
window.scrollTo(0, 0);

openButton.addEventListener('click', () => {
  if (opened) return;
  opened = true;
  openButton.disabled = true;
  openButton.setAttribute('aria-expanded', 'true');
  envelope.classList.add('open');
  const delay = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 1650;
  setTimeout(() => {
    invitation.hidden = false;
    startInteriorAnimations();
    opening.classList.add('disappear');
    setTimeout(() => {
      opening.hidden = true;
      window.scrollTo(0, 0);
    }, 500);
  }, delay);
});

// November 13, 2026 at 15:00 in Algeria (UTC+01:00).
const eventTime = new Date('2026-11-13T15:00:00+01:00').getTime();
const pad = value => String(value).padStart(2, '0');
function updateCountdown() {
  const remaining = Math.max(0, eventTime - Date.now());
  const totalSeconds = Math.floor(remaining / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(totalSeconds % 86400 / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  document.getElementById('days').textContent = pad(days);
  document.getElementById('hours').textContent = pad(hours);
  document.getElementById('minutes').textContent = pad(minutes);
  document.getElementById('seconds').textContent = pad(seconds);
  if (remaining === 0) document.getElementById('countdownMessage').textContent = 'Le grand jour est arrivé !';
}
updateCountdown();
setInterval(updateCountdown, 1000);

const music = document.getElementById('backgroundMusic');
const musicButton = document.getElementById('musicToggle');
const musicProgress = document.getElementById('musicProgress');
const musicTime = document.getElementById('musicTime');
const formatTime = s => `${pad(Math.floor(s / 60))}:${pad(Math.floor(s % 60))}`;
musicButton.addEventListener('click', async () => {
  if (music.paused) {
    try { await music.play(); }
    catch (error) { musicButton.title = 'Impossible de lire la musique'; }
  } else { music.pause(); }
});
music.addEventListener('play', () => {
  musicButton.textContent = '❚❚';
  musicButton.setAttribute('aria-label', 'Mettre la musique en pause');
  musicButton.setAttribute('aria-pressed', 'true');
});
music.addEventListener('pause', () => {
  musicButton.textContent = '▶';
  musicButton.setAttribute('aria-label', 'Lancer la musique');
  musicButton.setAttribute('aria-pressed', 'false');
});
music.addEventListener('timeupdate', () => {
  const duration = music.duration || 0;
  musicProgress.style.width = duration ? `${music.currentTime / duration * 100}%` : '0%';
  musicTime.textContent = formatTime(music.currentTime);
});


// INTERIOR CINEMATIC ANIMATIONS
// All invitation content stays visible if JavaScript/IntersectionObserver is unavailable.
function startInteriorAnimations() {
  const sections = invitation.querySelectorAll(
    '.hero, .music-section, .invitation-panel, .countdown-section, .details-section, .note-section, footer'
  );
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
  sections.forEach(section => observer.observe(section));
}
