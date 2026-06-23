// drive'n'meet

// live counters (startseite)
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

// aktiven nav-link markieren
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.navlink').forEach((link) => {
  if (link.getAttribute('href') === currentPage) {
    link.classList.add('active');
  }
});

// ===== LEAFLET MAPS =====

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

function createIcon(className) {
  return L.divIcon({ className: className, iconSize: [14, 14], iconAnchor: [7, 7] });
}

function createLargeIcon(className) {
  return L.divIcon({ className: className, iconSize: [16, 16], iconAnchor: [8, 8] });
}

// ----- BLITZER MAP -----
const blitzerMapEl = document.getElementById('blitzer-map');
if (blitzerMapEl && typeof L !== 'undefined') {
  const map = L.map('blitzer-map', { zoomControl: true, attributionControl: false }).setView([48.464, 8.411], 12);
  L.tileLayer(TILE_URL, { maxZoom: 18 }).addTo(map);

  const blitzers = [
    { pos: [48.4730, 8.3920], name: 'B294 · höhe freudenstadt', time: 'vor 4 min' },
    { pos: [48.4440, 8.6910], name: 'A81 · höhe horb', time: 'vor 11 min' },
    { pos: [48.4680, 8.4950], name: 'L370 · ortseingang dornstetten', time: 'vor 22 min' },
    { pos: [48.5050, 8.3670], name: 'B28 · richtung baiersbronn', time: 'vor 38 min' },
  ];

  blitzers.forEach((b) => {
    L.marker(b.pos, { icon: createIcon('marker-blitzer') })
      .addTo(map)
      .bindPopup('<b>' + b.name + '</b><br><span style="color:#8b9097;">' + b.time + '</span>');
  });

  L.marker([48.464, 8.411], { icon: createLargeIcon('marker-you') })
    .addTo(map)
    .bindPopup('<b>du</b> · dein standort');

  const spotIcons = [
    { pos: [48.4833, 8.3350], name: 'kniebis — aussichtspunkt' },
    { pos: [48.4500, 8.4200], name: 'parkplatz freibad · treffpunkt' },
  ];
  spotIcons.forEach((s) => {
    L.marker(s.pos, { icon: createIcon('marker-spot') })
      .addTo(map)
      .bindPopup(s.name);
  });
}

// ----- SPOTS MAP -----
const spotsMapEl = document.getElementById('spots-map');
if (spotsMapEl && typeof L !== 'undefined') {
  const map = L.map('spots-map', { zoomControl: true, attributionControl: false }).setView([48.470, 8.400], 12);
  L.tileLayer(TILE_URL, { maxZoom: 18 }).addTo(map);

  const spots = [
    { pos: [48.4833, 8.3350], name: 'kniebis — sonnenuntergang spot', type: 'AUSSICHTSPUNKT', votes: 142 },
    { pos: [48.4580, 8.4100], name: 'parkplatz freibad', type: 'TREFFPUNKT', votes: 89 },
    { pos: [48.5040, 8.3800], name: 'brücke b28 bei baiersbronn', type: 'FOTOSPOT', votes: 56 },
    { pos: [48.4350, 8.4600], name: 'waldparkplatz · nightmeet spot', type: 'TREFFPUNKT', votes: 34 },
    { pos: [48.4920, 8.3100], name: 'schwarzwaldhochstraße · panorama', type: 'AUSSICHTSPUNKT', votes: 201 },
  ];

  spots.forEach((s) => {
    const cls = s.type === 'TREFFPUNKT' ? 'marker-spot orange' : 'marker-spot';
    L.marker(s.pos, { icon: createIcon(cls) })
      .addTo(map)
      .bindPopup('<b>' + s.name + '</b><br><span style="color:#ff8a3d;font-size:11px;">' + s.type + '</span> · ▲ ' + s.votes);
  });

  L.marker([48.464, 8.411], { icon: createLargeIcon('marker-you') })
    .addTo(map)
    .bindPopup('<b>du</b> · dein standort');
}

// ----- CONVOY MAP + SIMULATION -----
const convoyMapEl = document.getElementById('convoy-map');
if (convoyMapEl && typeof L !== 'undefined') {
  const map = L.map('convoy-map', { zoomControl: true, attributionControl: false }).setView([48.468, 8.405], 13);
  L.tileLayer(TILE_URL, { maxZoom: 18 }).addTo(map);

  // Route entlang B294 Richtung Freudenstadt — simulierte Wegpunkte
  const route = [
    [48.4900, 8.3650],
    [48.4875, 8.3700],
    [48.4850, 8.3750],
    [48.4830, 8.3810],
    [48.4810, 8.3860],
    [48.4790, 8.3900],
    [48.4770, 8.3940],
    [48.4750, 8.3970],
    [48.4730, 8.4000],
    [48.4710, 8.4020],
    [48.4695, 8.4050],
    [48.4680, 8.4070],
    [48.4665, 8.4090],
    [48.4650, 8.4110],
    [48.4640, 8.4130],
    [48.4630, 8.4150],
    [48.4615, 8.4170],
    [48.4600, 8.4190],
    [48.4585, 8.4200],
    [48.4570, 8.4210],
  ];

  // Linie für die Route
  L.polyline(route, { color: '#ff8a3d', weight: 3, opacity: 0.4, dashArray: '8 6' }).addTo(map);

  const youMarker = L.marker(route[0], { icon: createLargeIcon('marker-you') }).addTo(map);
  const matchMarker = L.marker(route[0], { icon: createLargeIcon('marker-match') }).addTo(map);

  youMarker.bindPopup('<b>du</b> · VW Golf 7 GTI');
  matchMarker.bindPopup('<b>flo_94</b> · BMW 3er');

  const convoyDistEl = document.getElementById('convoyDist');
  const pingStatusEl = document.getElementById('pingStatus');

  let youIdx = 0;
  let matchIdx = 0;
  const matchDelay = 3;

  function calcDist(a, b) {
    const R = 6371000;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x)));
  }

  setInterval(() => {
    if (youIdx < route.length - 1) youIdx++;
    if (youIdx > matchDelay && matchIdx < route.length - 1) matchIdx++;

    youMarker.setLatLng(route[youIdx]);
    matchMarker.setLatLng(route[matchIdx]);

    const d = calcDist(route[youIdx], route[matchIdx]);
    if (convoyDistEl) convoyDistEl.textContent = d + 'm';
    if (pingStatusEl) {
      if (d < 100) {
        pingStatusEl.textContent = 'convoy gebildet — fahrt zusammen';
      } else if (d < 300) {
        pingStatusEl.textContent = 'match gefunden — ' + d + 'm entfernt, gleiche richtung';
      } else {
        pingStatusEl.textContent = 'fahrer erkannt — ' + d + 'm entfernt';
      }
    }

    map.panTo(route[youIdx], { animate: true, duration: 0.8 });

    if (youIdx >= route.length - 1 && matchIdx >= route.length - 1) {
      youIdx = 0;
      matchIdx = 0;
    }
  }, 1200);
}
