// drive'n'meet — alle daten hier sind simuliert, keine echten apis/tracking

// fake live counters auf der startseite
const statUsers = document.getElementById('statUsers');
const statPings = document.getElementById('statPings');
const radarDist = document.getElementById('radarDist');

if (statUsers) {
  setInterval(() => {
    let u = parseInt(statUsers.textContent.replace('.', '')) + Math.floor(Math.random() * 3);
    statUsers.textContent = u.toLocaleString('de-DE');
  }, 2400);
}

if (statPings) {
  setInterval(() => {
    let p = parseInt(statPings.textContent) + 1;
    statPings.textContent = p;
  }, 5000);
}

if (radarDist) {
  let dist = 480;
  setInterval(() => {
    dist -= Math.floor(Math.random() * 15);
    if (dist < 60) dist = 480;
    radarDist.textContent = dist + 'm';
  }, 1800);
}

// scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// aktiven nav-link markieren je nach aktueller seite
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navlink').forEach((link) => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});
