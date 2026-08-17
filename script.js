
const searchForm   = document.getElementById('searchForm');
const cityInput    = document.getElementById('cityInput');
const geoBtn       = document.getElementById('geoBtn');
const themeToggle  = document.getElementById('themeToggle');
const statusEl     = document.getElementById('status');
const topBtn       = document.getElementById('topBtn');

const hero         = document.getElementById('hero');
const placeName    = document.getElementById('placeName');
const mainTemp     = document.getElementById('mainTemp');
const mainDesc     = document.getElementById('mainDesc');
const mainMeta     = document.getElementById('mainMeta');
const feelsLike    = document.getElementById('feelsLike');
const humidity     = document.getElementById('humidity');
const wind         = document.getElementById('wind');
const pressure     = document.getElementById('pressure');

const hourlySection = document.getElementById('hourly');
const hourlyStrip   = document.getElementById('hourlyStrip');
const dailySection  = document.getElementById('daily');
const dailyList     = document.getElementById('dailyList');
const detailsSection = document.getElementById('details');
const detailsGrid    = document.getElementById('detailsGrid');
const astroSection   = document.getElementById('astro');
const astroGrid      = document.getElementById('astroGrid');

const skyEl        = document.getElementById('sky');
const celestialEl  = document.getElementById('celestial');
const particlesEl  = document.getElementById('particles');

// ---------- WMO ob-havo kodlari lug'ati ----------
const WMO = {
  0:  { text: "Ochiq osmon",              icon: "☀️",  group: "clear" },
  1:  { text: "Deyarli ochiq",            icon: "🌤️", group: "clear" },
  2:  { text: "Qisman bulutli",           icon: "⛅",  group: "cloud" },
  3:  { text: "Bulutli",                  icon: "☁️",  group: "cloud" },
  45: { text: "Tuman",                    icon: "🌫️", group: "cloud" },
  48: { text: "Muzli tuman",              icon: "🌫️", group: "cloud" },
  51: { text: "Mayda yomg'ir",            icon: "🌦️", group: "rain" },
  53: { text: "O'rtacha yomg'ir",         icon: "🌦️", group: "rain" },
  55: { text: "Kuchli mayda yomg'ir",     icon: "🌧️", group: "rain" },
  61: { text: "Yengil yomg'ir",           icon: "🌧️", group: "rain" },
  63: { text: "Yomg'ir",                  icon: "🌧️", group: "rain" },
  65: { text: "Kuchli yomg'ir",           icon: "🌧️", group: "rain" },
  71: { text: "Yengil qor",               icon: "🌨️", group: "snow" },
  73: { text: "Qor",                      icon: "❄️",  group: "snow" },
  75: { text: "Kuchli qor",               icon: "❄️",  group: "snow" },
  77: { text: "Qor donachalari",          icon: "❄️",  group: "snow" },
  80: { text: "Yomg'ir jala",             icon: "🌦️", group: "rain" },
  81: { text: "Kuchli jala",              icon: "🌧️", group: "rain" },
  82: { text: "Juda kuchli jala",         icon: "⛈️",  group: "rain" },
  85: { text: "Qor jalasi",               icon: "🌨️", group: "snow" },
  86: { text: "Kuchli qor jalasi",        icon: "❄️",  group: "snow" },
  95: { text: "Momaqaldiroq",             icon: "⛈️",  group: "rain" },
  96: { text: "Do'l bilan momaqaldiroq",  icon: "⛈️",  group: "rain" },
  99: { text: "Kuchli do'l",              icon: "⛈️",  group: "rain" },
};
function weatherInfo(code) { return WMO[code] || { text: "Noma'lum", icon: "🌡️", group: "cloud" }; }

const HAFTA = ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"];

// ---------- Fonni ob-havoga qarab yangilash ----------
let lastSky = null; // rejim almashganda fonni qayta chizish uchun oxirgi ob-havo

const SKY_PALETTES = {
  dark: {
    clear_day:   ["#2e1a55", "#472583"],
    clear_night: ["#0f0720", "#1e0f38"],
    cloud_day:   ["#241241", "#3d2170"],
    cloud_night: ["#0b0518", "#1a0e33"],
    rain_day:    ["#1c0f38", "#33205c"],
    rain_night:  ["#080413", "#170c2b"],
    snow_day:    ["#241241", "#4a2f78"],
    snow_night:  ["#0d0720", "#221241"],
  },
  light: {
    clear_day:   ["#f3ecff", "#e0d2ff"],
    clear_night: ["#e9e2f7", "#d4c6ed"],
    cloud_day:   ["#eef0fb", "#dbdef2"],
    cloud_night: ["#e4e2f0", "#cfcbe4"],
    rain_day:    ["#e6ecff", "#c9d5f4"],
    rain_night:  ["#dbe0f0", "#c0c7e2"],
    snow_day:    ["#f6f2ff", "#e6dffb"],
    snow_night:  ["#eae6f5", "#dad3eb"],
  },
};

function updateSky(group, isDay) {
  lastSky = { group, isDay };
  const theme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const palettes = SKY_PALETTES[theme];
  const key = `${group}_${isDay ? "day" : "night"}`;
  const [top, bottom] = palettes[key] || palettes.cloud_day;

  document.documentElement.style.setProperty('--sky-top', top);
  document.documentElement.style.setProperty('--sky-bottom', bottom);
  celestialEl.classList.toggle('moon', !isDay);

  particlesEl.innerHTML = "";
  particlesEl.className = "particles";

  if (group === "rain") {
    particlesEl.classList.add("rain");
    spawnParticles(40, () => {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = (0.5 + Math.random() * 0.5) + "s";
      s.style.animationDelay = Math.random() * 2 + "s";
      return s;
    });
  } else if (group === "snow") {
    particlesEl.classList.add("snow");
    spawnParticles(30, () => {
      const s = document.createElement('span');
      s.style.left = Math.random() * 100 + "%";
      s.style.animationDuration = (4 + Math.random() * 4) + "s";
      s.style.animationDelay = Math.random() * 4 + "s";
      return s;
    });
  } else if (group === "cloud") {
    particlesEl.classList.add("cloud");
    spawnParticles(6, () => {
      const s = document.createElement('span');
      const size = 60 + Math.random() * 100;
      s.style.width = size + "px";
      s.style.height = size * 0.5 + "px";
      s.style.top = Math.random() * 60 + "%";
      s.style.animationDuration = (30 + Math.random() * 30) + "s";
      s.style.animationDelay = Math.random() * -30 + "s";
      return s;
    });
  }
}
function spawnParticles(n, makeSpan) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) frag.appendChild(makeSpan());
  particlesEl.appendChild(frag);
}

// ---------- Oddiy oy fazasi hisoblagichi (astronomik ma'lumotlar kerak emas) ----------
function moonPhase(date) {
  const synodicMonth = 29.53058867;
  const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14); // 2000-01-06 taniqli yangi oy
  const days = (date.getTime() - knownNewMoon) / 86400000;
  let phase = (days % synodicMonth) / synodicMonth;
  if (phase < 0) phase += 1;
  return phase; // 0 = yangi oy, 0.5 = to'lin oy
}
function moonLabel(phase) {
  if (phase < 0.03 || phase > 0.97) return { text: "Yangi oy", icon: "🌑" };
  if (phase < 0.22) return { text: "O'suvchi yarim oy", icon: "🌒" };
  if (phase < 0.28) return { text: "Birinchi chorak", icon: "🌓" };
  if (phase < 0.47) return { text: "O'suvchi to'lin oy", icon: "🌔" };
  if (phase < 0.53) return { text: "To'lin oy", icon: "🌕" };
  if (phase < 0.72) return { text: "Kamayuvchi to'lin oy", icon: "🌖" };
  if (phase < 0.78) return { text: "Oxirgi chorak", icon: "🌗" };
  return { text: "Kamayuvchi yarim oy", icon: "🌘" };
}

// ---------- Shahar nomi bo'yicha qidirish ----------
async function searchCity(name) {
  setStatus(`"${name}" qidirilmoqda…`);
  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=uz&format=json`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      setStatus(`"${name}" topilmadi. Boshqa nom bilan urinib ko'ring.`);
      return;
    }
    const place = geoData.results[0];
    const label = [place.name, place.admin1, place.country].filter(Boolean).join(", ");
    await loadWeather(place.latitude, place.longitude, label);
  } catch (err) {
    console.error(err);
    setStatus("Xatolik yuz berdi. Internet aloqasini tekshiring.");
  }
}

// ---------- Koordinata bo'yicha ob-havoni yuklash ----------
async function loadWeather(lat, lon, label) {
  setStatus("Ob-havo yuklanmoqda…");
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,is_day` +
      `&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,surface_pressure,apparent_temperature` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,daylight_duration` +
      `&timezone=auto&forecast_days=7`;

    const res = await fetch(url);
    const data = await res.json();

    renderCurrent(data, label);
    renderHourly(data);
    renderDaily(data);
    renderDetails(data);
    renderAstro(data);

    setStatus("");
    hero.hidden = false;
    hourlySection.hidden = false;
    dailySection.hidden = false;
    detailsSection.hidden = false;
    astroSection.hidden = false;
  } catch (err) {
    console.error(err);
    setStatus("Ob-havo ma'lumotini olishda xatolik yuz berdi.");
  }
}

function renderCurrent(data, label) {
  const c = data.current;
  const info = weatherInfo(c.weather_code);
  const isDay = c.is_day === 1;

  placeName.textContent = label;
  mainTemp.textContent = Math.round(c.temperature_2m) + "°";
  mainDesc.textContent = info.text;
  mainMeta.textContent = new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long' });

  feelsLike.textContent = Math.round(c.apparent_temperature) + "°";
  humidity.textContent = c.relative_humidity_2m + "%";
  wind.textContent = Math.round(c.wind_speed_10m) + " km/soat";
  pressure.textContent = Math.round(c.surface_pressure) + " hPa";

  updateSky(info.group, isDay);
}

function renderHourly(data) {
  hourlyStrip.innerHTML = "";
  const now = new Date();
  const { time, temperature_2m, weather_code } = data.hourly;
  let startIdx = time.findIndex(t => new Date(t) >= now);
  if (startIdx === -1) startIdx = 0;

  const frag = document.createDocumentFragment();
  for (let i = startIdx; i < startIdx + 24 && i < time.length; i++) {
    const info = weatherInfo(weather_code[i]);
    const hour = new Date(time[i]).getHours();
    const card = document.createElement('div');
    card.className = 'hour-card';
    card.innerHTML = `
      <div class="h-time">${i === startIdx ? "Hozir" : hour + ":00"}</div>
      <div class="h-icon">${info.icon}</div>
      <div class="h-temp">${Math.round(temperature_2m[i])}°</div>
    `;
    frag.appendChild(card);
  }
  hourlyStrip.appendChild(frag);
}

function renderDaily(data) {
  dailyList.innerHTML = "";
  const { time, weather_code, temperature_2m_max, temperature_2m_min } = data.daily;
  const frag = document.createDocumentFragment();
  time.forEach((d, i) => {
    const info = weatherInfo(weather_code[i]);
    const dayName = i === 0 ? "Bugun" : HAFTA[new Date(d).getDay()];
    const row = document.createElement('div');
    row.className = 'day-row';
    row.innerHTML = `
      <span class="d-name">${dayName}</span>
      <span class="d-icon">${info.icon} ${info.text}</span>
      <span></span>
      <span class="d-range">${Math.round(temperature_2m_max[i])}° <span class="d-low">${Math.round(temperature_2m_min[i])}°</span></span>
    `;
    frag.appendChild(row);
  });
  dailyList.appendChild(frag);
}

// Bugungi kunni ertalab/kunduz/kechqurun/tun bo'laklariga ajratib ko'rsatish
function renderDetails(data) {
  detailsGrid.innerHTML = "";
  const { time, temperature_2m, weather_code, apparent_temperature, wind_speed_10m, relative_humidity_2m } = data.hourly;

  const today = new Date().toISOString().slice(0, 10);
  const slots = [
    { label: "Ertalab", hour: 9 },
    { label: "Kunduzi", hour: 15 },
    { label: "Kechqurun", hour: 21 },
    { label: "Tunda", hour: 3, nextDay: true },
  ];

  const frag = document.createDocumentFragment();
  slots.forEach(slot => {
    const idx = time.findIndex(t => {
      const dt = new Date(t);
      const dateStr = dt.toISOString().slice(0, 10);
      const targetDate = slot.nextDay
        ? new Date(new Date(today).getTime() + 86400000).toISOString().slice(0, 10)
        : today;
      return dateStr === targetDate && dt.getHours() === slot.hour;
    });
    if (idx === -1) return;
    const info = weatherInfo(weather_code[idx]);
    const card = document.createElement('div');
    card.className = 'detail-card';
    card.innerHTML = `
      <div class="dc-title">${slot.label}</div>
      <div class="dc-temp">${info.icon} ${Math.round(temperature_2m[idx])}°</div>
      <div class="dc-desc">${info.text}, his qilinadi ${Math.round(apparent_temperature[idx])}°</div>
      <div class="dc-row"><span>Shamol</span><span>${Math.round(wind_speed_10m[idx])} km/soat</span></div>
      <div class="dc-row"><span>Namlik</span><span>${relative_humidity_2m[idx]}%</span></div>
    `;
    frag.appendChild(card);
  });
  detailsGrid.appendChild(frag);
}

function renderAstro(data) {
  astroGrid.innerHTML = "";
  const d = data.daily;
  const sunrise = new Date(d.sunrise[0]);
  const sunset = new Date(d.sunset[0]);
  const uv = Math.round(d.uv_index_max[0]);
  const daylightH = Math.floor(d.daylight_duration[0] / 3600);
  const daylightM = Math.round((d.daylight_duration[0] % 3600) / 60);

  const phase = moonPhase(new Date());
  const moon = moonLabel(phase);

  const uvLevel = uv <= 2 ? "past" : uv <= 5 ? "o'rtacha" : uv <= 7 ? "yuqori" : uv <= 10 ? "juda yuqori" : "ekstremal";

  const cards = [
    { icon: "🌅", label: "Quyosh chiqishi", value: sunrise.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) },
    { icon: "🌇", label: "Quyosh botishi", value: sunset.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }) },
    { icon: "☀️", label: "Yorug' kun", value: `${daylightH} soat ${daylightM} daqiqa` },
    { icon: moon.icon, label: "Oy fazasi", value: moon.text },
    { icon: "🔆", label: "UF-indeks", value: `${uv}, ${uvLevel}` },
  ];

  const frag = document.createDocumentFragment();
  cards.forEach(c => {
    const el = document.createElement('div');
    el.className = 'astro-card';
    el.innerHTML = `
      <div class="ac-icon">${c.icon}</div>
      <div class="ac-label">${c.label}</div>
      <div class="ac-value">${c.value}</div>
    `;
    frag.appendChild(el);
  });
  astroGrid.appendChild(frag);
}

// ---------- Joriy joylashuvni aniqlash (GPS) ----------
function useMyLocation() {
  if (!navigator.geolocation) {
    setStatus("Brauzeringiz joylashuvni aniqlay olmaydi.");
    return;
  }
  setStatus("Joylashuvingiz aniqlanmoqda…");
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      let label = "Mening joylashuvim";
      try {
        const revRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=uz`
        );
        const revData = await revRes.json();
        label = [revData.city || revData.locality, revData.countryName].filter(Boolean).join(", ") || label;
      } catch (_) { /* standart nom qoladi */ }
      await loadWeather(latitude, longitude, label);
    },
    () => setStatus("Joylashuvga ruxsat berilmadi.")
  );
}

function setStatus(text) { statusEl.textContent = text; }

// ---------- Pastki dock: bead harakati, bosish va sudrash ----------
const dockBar  = document.getElementById('dockBar');
const dockBead = document.getElementById('dockBead');
const dockTabs = Array.from(document.querySelectorAll('.dock__tab'));

let activeTabIndex = 0;
let isDraggingBead = false;
let isProgrammaticScroll = false;
let programmaticScrollTimer = null;

function tabCenterX(tab) { return tab.offsetLeft + tab.offsetWidth / 2; }

function moveBeadToTab(index, animate = true) {
  const tab = dockTabs[index];
  if (!tab) return;
  const x = tabCenterX(tab) - dockBead.offsetWidth / 2;
  dockBead.style.transition = animate ? '' : 'none';
  dockBead.style.transform = `translateX(${x}px)`;
  if (!animate) dockBead.offsetHeight; // reflow, keyingi harakatlar animatsiyali bo'lishi uchun
}

function setActiveTab(index, { scroll = false, animate = true } = {}) {
  if (index === activeTabIndex && !scroll) return;
  activeTabIndex = index;
  dockTabs.forEach((tab, i) => {
    if (i === index) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });
  moveBeadToTab(index, animate);
  if (scroll) {
    const target = document.querySelector(dockTabs[index].dataset.target);
    if (target) {
      isProgrammaticScroll = true;
      clearTimeout(programmaticScrollTimer);
      // scroll tugaguncha kuzatuvchi boshqa bo'limlarga "sirg'anib" ketmasin
      programmaticScrollTimer = setTimeout(() => { isProgrammaticScroll = false; }, 900);
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

dockTabs.forEach((tab, i) => {
  tab.addEventListener('click', () => setActiveTab(i, { scroll: true }));
});

// Zamonaviy brauzerlarda scroll to'xtashini aniq bilish uchun (uzun sahifalarda 900ms yetmasligi mumkin)
window.addEventListener('scrollend', () => {
  clearTimeout(programmaticScrollTimer);
  isProgrammaticScroll = false;
});

window.addEventListener('load', () => moveBeadToTab(activeTabIndex, false));
window.addEventListener('resize', () => moveBeadToTab(activeTabIndex, false));

// Bo'lim scroll bilan ko'rinishga kirganda mos tabni faollashtirish
const dockSections = dockTabs
  .map(tab => document.querySelector(tab.dataset.target))
  .filter(Boolean);

const dockObserver = new IntersectionObserver((entries) => {
  if (isDraggingBead || isProgrammaticScroll) return;
  const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
  if (!visible.length) return;
  const idx = dockSections.indexOf(visible[0].target);
  if (idx !== -1) setActiveTab(idx);
}, { rootMargin: '-40% 0px -40% 0px', threshold: [0.1, 0.25, 0.5, 0.75] });

dockSections.forEach(section => dockObserver.observe(section));

// Bead ni sudrab, eng yaqin tabga "yopishtirish"
function beadPointerDown(e) {
  isDraggingBead = true;
  dockBead.setPointerCapture(e.pointerId);
  dockBead.style.transition = 'none';
}

function beadPointerMove(e) {
  if (!isDraggingBead) return;
  const barRect = dockBar.getBoundingClientRect();
  const min = 0;
  const max = dockBar.clientWidth - dockBead.offsetWidth;
  let x = e.clientX - barRect.left - dockBead.offsetWidth / 2;
  x = Math.max(min, Math.min(max, x));
  dockBead.style.transform = `translateX(${x}px)`;

  const beadCenter = x + dockBead.offsetWidth / 2;
  let nearest = 0, nearestDist = Infinity;
  dockTabs.forEach((tab, i) => {
    const dist = Math.abs(tabCenterX(tab) - beadCenter);
    if (dist < nearestDist) { nearestDist = dist; nearest = i; }
  });
  dockTabs.forEach((tab, i) => {
    if (i === nearest) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  });
  activeTabIndex = nearest;
}

function beadPointerUp(e) {
  if (!isDraggingBead) return;
  isDraggingBead = false;
  dockBead.style.transition = '';
  setActiveTab(activeTabIndex, { scroll: true, animate: true });
}

dockBead.addEventListener('pointerdown', beadPointerDown);
dockBead.addEventListener('pointermove', beadPointerMove);
dockBead.addEventListener('pointerup', beadPointerUp);
dockBead.addEventListener('pointercancel', beadPointerUp);

// ---------- Voqea tinglovchilar (barcha tugmalar shu yerda ishga tushadi) ----------
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const value = cityInput.value.trim();
  if (value) searchCity(value);
});

geoBtn.addEventListener('click', useMyLocation);
topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Yorug' / qorong'u rejim ----------
function applyThemeIcon(theme) {
  themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
  themeToggle.title = theme === 'light' ? 'Tungi rejimga o\'tish' : 'Kunduzgi rejimga o\'tish';
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('osmon-theme', theme);
  applyThemeIcon(theme);
  if (lastSky) updateSky(lastSky.group, lastSky.isDay);
}

applyThemeIcon(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

themeToggle.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  setTheme(current === 'light' ? 'dark' : 'light');
});

// ---------- Boshlang'ich holat: Toshkent ob-havosi bilan ochiladi ----------
loadWeather(41.3111, 69.2797, "Toshkent, O'zbekiston");
