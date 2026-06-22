const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const introScreen = $('#introScreen');
const planner = $('#planner');
const openPlannerBtn = $('#openPlannerBtn');
const backIntroBtn = $('#backIntroBtn');
const soundToggle = $('#soundToggle');
const toast = $('#toast');
const syncStatus = $('#syncStatus');
const miniPlayer = $('#miniPlayer');
const miniPlayerBtn = $('#miniPlayerBtn');
const activeTrackName = $('#activeTrackName');
const playActiveBtn = $('#playActiveBtn');
const stopMusicBtn = $('#stopMusicBtn');
const audioPlayer = $('#audioPlayer');

const monthTitle = $('#monthTitle');
const todayLabel = $('#todayLabel');
const calendarGrid = $('#calendarGrid');
const prevMonthBtn = $('#prevMonthBtn');
const nextMonthBtn = $('#nextMonthBtn');
const selectedDateTitle = $('#selectedDateTitle');
const weekdayBadge = $('#weekdayBadge');
const scheduleSource = $('#scheduleSource');
const timeline = $('#timeline');
const eventForm = $('#eventForm');
const eventModal = $('#eventModal');
const eventModalTitle = $('#eventModalTitle');
const addEventBtn = $('#addEventBtn');
const closeEventModal = $('#closeEventModal');
const editingIndex = $('#editingIndex');
const eventTime = $('#eventTime');
const eventTitle = $('#eventTitle');
const eventNote = $('#eventNote');
const eventCategory = $('#eventCategory');
const clearFormBtn = $('#clearFormBtn');
const saveDateBtn = $('#saveDateBtn');
const saveDefaultBtn = $('#saveDefaultBtn');
const resetDateBtn = $('#resetDateBtn');

const uploadForm = $('#uploadForm');
const uploadTitle = $('#uploadTitle');
const audioFile = $('#audioFile');
const playlist = $('#playlist');
const refreshMusicBtn = $('#refreshMusicBtn');

const notesList = $('#notesList');
const reloadNotesBtn = $('#reloadNotesBtn');
const noteModal = $('#noteModal');
const noteModalTitle = $('#noteModalTitle');
const noteModalText = $('#noteModalText');
const saveNoteModalBtn = $('#saveNoteModalBtn');
const closeNoteModal = $('#closeNoteModal');
const cancelNoteModalBtn = $('#cancelNoteModalBtn');

const weekdayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const defaultNotes = {
  intro: 'Hai cantik. Hari ini kamu tetap manis, tetap kuat, dan tetap orang yang aku pilih buat pulang.',
  calendar: 'Satu tanggal kecil bisa jadi memori besar kalau isinya kita.',
  day: 'Apa pun jadwalnya, validasinya tetap sama: kamu cantik hari ini dan aku bangga sama kamu.',
  music: 'Pilih lagu yang paling kamu suka. Biar rutinitas kita punya soundtrack sendiri.',
  notes: 'Reminder kecil: kamu cukup, kamu dicintai, dan kamu nggak harus sempurna buat disayang.'
};

const defaultMusicTrack = {
  id: 'default-romantic',
  title: 'Default Romantic Music',
  source_type: 'default',
  url: '/assets/default-romantic.wav',
  original_filename: 'default-romantic.wav',
  is_active: 1
};

const defaultTemplates = {
  1: [
    { time: '07:15', title: 'Pergi kantor bersama', note: 'Start weekday dengan ketemu Green dulu.', category: 'work' },
    { time: '18:15', title: 'Pulang kantor bersama', note: 'Kalau hari berat, pulangnya tetap bareng.', category: 'work' },
    { time: '19:30', title: 'Dinner kalau pulang cepat', note: 'Makan malam santai, no pressure.', category: 'date' },
    { time: '21:00', title: 'Quality time kecil', note: 'Ngobrol, validasi, lalu istirahat.', category: 'love' }
  ],
  2: [
    { time: '07:15', title: 'Pergi kantor bersama', note: 'Rutinitas kecil yang bikin hari lebih ringan.', category: 'work' },
    { time: '18:15', title: 'Pulang kantor bersama', note: 'Cerita random di jalan pulang.', category: 'work' },
    { time: '19:30', title: 'Dinner kalau pulang cepat', note: 'Cari makan yang simple tapi happy.', category: 'date' },
    { time: '21:00', title: 'Slow night', note: 'Recharge bareng sebelum tidur.', category: 'love' }
  ],
  3: [
    { time: '07:15', title: 'Pergi kantor bersama', note: 'Midweek tapi tetap ada kita.', category: 'work' },
    { time: '18:15', title: 'Pulang kantor bersama', note: 'Pegang ritme pelan-pelan.', category: 'work' },
    { time: '19:30', title: 'Makan malam / snack', note: 'Kalau capek, beli yang gampang aja.', category: 'date' },
    { time: '21:00', title: 'Check-in perasaan', note: 'Tanya: hari ini kamu baik-baik aja?', category: 'love' }
  ],
  4: [
    { time: '07:15', title: 'Pergi kantor bersama', note: 'Kamis rasa hampir weekend.', category: 'work' },
    { time: '18:15', title: 'Pulang kantor bersama', note: 'Pulang sambil rencana Jumat.', category: 'work' },
    { time: '19:30', title: 'Dinner kalau pulang cepat', note: 'Makan dan ngobrol hal lucu.', category: 'date' },
    { time: '21:00', title: 'Quality time', note: 'Biar minggu kerja nggak terasa sendirian.', category: 'love' }
  ],
  5: [
    { time: '18:30', title: 'Friday reward start', note: 'Pulang kantor, mode fun on.', category: 'date' },
    { time: '19:30', title: 'Nonton / karaoke / BXC', note: 'Bebas pilih mood hari ini.', category: 'fun' },
    { time: '22:00', title: 'Late snack + cerita', note: 'Tutup minggu kerja dengan happy.', category: 'love' }
  ],
  6: [
    { time: '12:00', title: 'Date day mulai', note: 'Jalan dari siang sampai malam.', category: 'date' },
    { time: '14:00', title: 'Tempat viral / cafe hopping', note: 'Cari yang lucu buat difoto dan dikenang.', category: 'fun' },
    { time: '17:30', title: 'Dinner date', note: 'Makan enak tanpa buru-buru.', category: 'date' },
    { time: '20:00', title: 'Night walk', note: 'Jalan santai, foto, ngobrol.', category: 'love' }
  ],
  0: [
    { time: '08:00', title: 'Laundry', note: 'Cuci baju biar minggu depan ringan.', category: 'home' },
    { time: '10:00', title: 'Bersih-bersih rumah', note: 'Rumah rapi, pikiran ikut rapi.', category: 'home' },
    { time: '12:00', title: 'Meal prep', note: 'Siapin bekal dan makanan simple.', category: 'home' },
    { time: '14:00', title: 'Kamar mandi + room reset', note: 'Reset kecil buat hidup yang lebih nyaman.', category: 'home' },
    { time: '19:00', title: 'Jalan ke Centraland', note: 'Slow night sebelum Senin datang.', category: 'date' }
  ]
};

let currentDate = new Date();
let visibleYear = currentDate.getFullYear();
let visibleMonth = currentDate.getMonth();
let selectedDate = toDateKey(currentDate);
let selectedEvents = [];
let selectedSource = 'default';
let selectedWeekday = currentDate.getDay();
let notes = { ...defaultNotes };
let tracks = [];
let activeTrack = null;
let storageMode = 'api';
let noteKeyBeingEdited = '';
let audioCtx = null;
let sfxEnabled = true;
let musicWasStartedByUser = false;

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateKey(dateKey) {
  return new Date(`${dateKey}T00:00:00`);
}

function cloneEvents(events) {
  return (events || []).map((event) => ({
    time: String(event.time || event.time_value || '').slice(0, 5),
    title: event.title || '',
    note: event.note || '',
    category: event.category || 'love',
    sort_order: Number(event.sort_order || 0)
  })).sort((a, b) => a.time.localeCompare(b.time));
}

function localKey(key) {
  return `green-maroon-${key}`;
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: options.body instanceof FormData ? options.headers : {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || 'Request gagal.');
  return payload;
}

function showToast(message = 'Saved 💗') {
  toast.textContent = message;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 1500);
}

function setSyncStatus(text, isOk = true) {
  syncStatus.textContent = text;
  syncStatus.style.color = isOk ? 'rgba(53, 17, 36, 0.68)' : '#8d1038';
}

function initAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function tone(freq, delay = 0, duration = 0.15, type = 'sine', volume = 0.08) {
  if (!sfxEnabled) return;
  initAudioContext();
  const now = audioCtx.currentTime + delay;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.018);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.04);
}

function noiseBurst(delay = 0, duration = 0.28, volume = 0.22) {
  if (!sfxEnabled) return;
  initAudioContext();
  const now = audioCtx.currentTime + delay;
  const bufferSize = Math.max(1, Math.floor(audioCtx.sampleRate * duration));
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const fade = 1 - i / bufferSize;
    data[i] = (Math.random() * 2 - 1) * fade;
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(950, now);
  filter.frequency.exponentialRampToValueAtTime(140, now + duration);
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  source.start(now);
  source.stop(now + duration + 0.05);
}

function clickSound() {
  tone(820, 0, 0.07, 'triangle', 0.075);
  tone(1260, 0.055, 0.12, 'triangle', 0.055);
}

function softMagicSound() {
  tone(659, 0, 0.15, 'triangle', 0.055);
  tone(987, 0.10, 0.17, 'triangle', 0.048);
  tone(1318, 0.22, 0.22, 'triangle', 0.04);
}

function saveSound() {
  tone(523, 0, 0.12, 'triangle', 0.06);
  tone(659, 0.09, 0.14, 'triangle', 0.06);
  tone(1046, 0.18, 0.18, 'triangle', 0.055);
}

function boomSound() {
  tone(98, 0, 0.45, 'sine', 0.22);
  tone(196, 0.035, 0.35, 'sine', 0.12);
  noiseBurst(0.02, 0.34, 0.25);
  tone(784, 0.24, 0.12, 'triangle', 0.05);
  tone(1175, 0.34, 0.16, 'triangle', 0.045);
  tone(1568, 0.46, 0.19, 'triangle', 0.04);
}

function wrongSound() {
  tone(240, 0, 0.14, 'sawtooth', 0.04);
  tone(180, 0.10, 0.16, 'sawtooth', 0.035);
}

function sparkleConfetti(amount = 90) {
  const colors = ['#ff2e63', '#ff8fc7', '#ff4d5e', '#0ea869', '#b8ffd9', '#fff7ed', '#ffd3e9'];
  const emojis = ['💗', '💚', '✨', '♡', '🌷', '💌'];

  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti';
    const size = 7 + Math.random() * 12;
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.35}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.animationDuration = `${2.5 + Math.random() * 2.1}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5600);
  }

  for (let i = 0; i < 24; i++) {
    const emoji = document.createElement('span');
    emoji.className = 'emoji-confetti';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    emoji.style.left = `${Math.random() * 100}vw`;
    emoji.style.fontSize = `${18 + Math.random() * 15}px`;
    emoji.style.animationDelay = `${Math.random() * 0.8}s`;
    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 5600);
  }
}

function sidePoppers() {
  const colors = ['#ff2e63', '#ff8fc7', '#ff4d5e', '#0ea869', '#b8ffd9', '#fff7ed'];
  ['left', 'right'].forEach((side) => {
    for (let i = 0; i < 36; i++) {
      const piece = document.createElement('span');
      piece.className = `side-confetti ${side}`;
      piece.style.top = `${55 + Math.random() * 24}vh`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      const x = side === 'left' ? 160 + Math.random() * 300 : -(160 + Math.random() * 300);
      const y = -(90 + Math.random() * 260);
      piece.style.setProperty('--x', `${x}px`);
      piece.style.setProperty('--y', `${y}px`);
      piece.style.setProperty('--r', `${Math.random() * 900}deg`);
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2400);
    }
  });
}

function fireworks() {
  const flash = document.createElement('span');
  flash.className = 'screen-flash';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 520);

  const colors = ['#ff2e63', '#ff8fc7', '#fff7ed', '#0ea869', '#b8ffd9'];
  const centers = [
    [24 + Math.random() * 18, 22 + Math.random() * 20],
    [58 + Math.random() * 22, 20 + Math.random() * 24],
    [42 + Math.random() * 22, 48 + Math.random() * 20]
  ];

  centers.forEach(([cx, cy]) => {
    for (let i = 0; i < 30; i++) {
      const dot = document.createElement('span');
      dot.className = 'firework-dot';
      dot.style.background = colors[Math.floor(Math.random() * colors.length)];
      dot.style.setProperty('--cx', `${cx}vw`);
      dot.style.setProperty('--cy', `${cy}vh`);
      const angle = (Math.PI * 2 * i) / 30;
      const radius = 55 + Math.random() * 80;
      dot.style.setProperty('--x', `${Math.cos(angle) * radius}px`);
      dot.style.setProperty('--y', `${Math.sin(angle) * radius}px`);
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 1100);
    }
  });
}

function fullCelebration() {
  boomSound();
  sparkleConfetti(140);
  sidePoppers();
  fireworks();
}

function buttonSpark(button) {
  if (!button) return;
  const rect = button.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  for (let i = 0; i < 10; i++) {
    const dot = document.createElement('span');
    dot.className = 'firework-dot';
    dot.style.background = i % 2 ? '#ff2e63' : '#0ea869';
    dot.style.setProperty('--cx', `${x}px`);
    dot.style.setProperty('--cy', `${y}px`);
    const angle = Math.random() * Math.PI * 2;
    const radius = 22 + Math.random() * 35;
    dot.style.setProperty('--x', `${Math.cos(angle) * radius}px`);
    dot.style.setProperty('--y', `${Math.sin(angle) * radius}px`);
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 900);
  }
}

function renderCalendar() {
  monthTitle.textContent = `${monthNames[visibleMonth]} ${visibleYear}`;
  const today = new Date();
  todayLabel.textContent = `Hari ini: ${weekdayNames[today.getDay()]}, ${today.getDate()} ${monthNames[today.getMonth()]}`;

  calendarGrid.innerHTML = '';
  const firstDay = new Date(visibleYear, visibleMonth, 1);
  const startDate = new Date(visibleYear, visibleMonth, 1 - firstDay.getDay());

  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateKey = toDateKey(date);
    const weekday = date.getDay();
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'date-cell';
    if (date.getMonth() !== visibleMonth) button.classList.add('outside');
    if (dateKey === toDateKey(today)) button.classList.add('today');
    if (dateKey === selectedDate) button.classList.add('selected');
    button.innerHTML = `
      <span class="date-number">${date.getDate()}</span>
      <span class="date-mini">${weekdayNames[weekday]}</span>
    `;
    button.addEventListener('click', async () => {
      clickSound();
      buttonSpark(button);
      selectedDate = dateKey;
      visibleYear = date.getFullYear();
      visibleMonth = date.getMonth();
      renderCalendar();
      await loadSchedule(dateKey);
    });
    calendarGrid.appendChild(button);
  }
}

function renderTimeline() {
  const date = parseDateKey(selectedDate);
  selectedDateTitle.textContent = `${weekdayNames[date.getDay()]}, ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  weekdayBadge.textContent = weekdayNames[date.getDay()].slice(0, 3);
  scheduleSource.textContent = selectedSource === 'custom'
    ? 'Jadwal ini sudah custom khusus tanggal ini.'
    : 'Ini jadwal default. Edit lalu simpan kalau mau custom.';

  timeline.innerHTML = '';

  if (!selectedEvents.length) {
    timeline.innerHTML = '<p class="muted-text">Belum ada jadwal. Tambahin item pertama yuk.</p>';
    return;
  }

  selectedEvents.forEach((event, index) => {
    const item = document.createElement('article');
    item.className = 'event-item';
    item.innerHTML = `
      <div class="event-time">${event.time || '--:--'}</div>
      <div>
        <p class="event-title">${escapeHtml(event.title)}</p>
        <p class="event-note">${escapeHtml(event.note || 'No note, tapi tetap sweet.')}</p>
        <span class="category-pill">${escapeHtml(event.category || 'love')}</span>
      </div>
      <div class="event-actions">
        <button class="event-action-btn" type="button" title="Edit" data-edit-event="${index}">✎</button>
        <button class="event-action-btn delete" type="button" title="Hapus" data-delete-event="${index}">×</button>
      </div>
    `;
    timeline.appendChild(item);
  });

  $$('[data-edit-event]').forEach((button) => {
    button.addEventListener('click', () => {
      clickSound();
      editEvent(Number(button.dataset.editEvent));
    });
  });

  $$('[data-delete-event]').forEach((button) => {
    button.addEventListener('click', () => {
      wrongSound();
      const index = Number(button.dataset.deleteEvent);
      selectedEvents.splice(index, 1);
      renderTimeline();
      autoSaveDateSchedule('Item dihapus dan jadwal tersimpan 💚');
    });
  });
}

function escapeHtml(text) {
  return String(text || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function checkHealth() {
  try {
    await api('/api/health');
    storageMode = 'api';
    setSyncStatus('Online');
  } catch (error) {
    storageMode = 'local';
    setSyncStatus('Offline', false);
  }
}

async function loadSchedule(dateKey) {
  const date = parseDateKey(dateKey);
  selectedWeekday = date.getDay();

  if (storageMode === 'api') {
    try {
      const result = await api(`/api/schedule/${dateKey}`);
      selectedSource = result.source || 'default';
      selectedWeekday = Number(result.weekday ?? selectedWeekday);
      selectedEvents = cloneEvents(result.events);
      renderTimeline();
      return;
    } catch (error) {
      storageMode = 'local';
      setSyncStatus('API error, sementara pindah ke mode local browser.', false);
    }
  }

  const custom = JSON.parse(localStorage.getItem(localKey(`schedule-${dateKey}`)) || 'null');
  if (custom) {
    selectedSource = 'custom';
    selectedEvents = cloneEvents(custom);
  } else {
    selectedSource = 'default';
    const localDefault = JSON.parse(localStorage.getItem(localKey(`default-${selectedWeekday}`)) || 'null');
    selectedEvents = cloneEvents(localDefault || defaultTemplates[selectedWeekday] || []);
  }
  renderTimeline();
}

function openEventModal(mode = 'add', index = '') {
  if (mode === 'edit') {
    eventModalTitle.textContent = 'Edit jadwal';
    editingIndex.value = String(index);
  } else {
    eventModalTitle.textContent = 'Tambah jadwal';
    clearEventForm();
  }
  eventModal.classList.remove('hidden');
  setTimeout(() => eventTime.focus(), 50);
}

function closeEventEditor() {
  eventModal.classList.add('hidden');
  clearEventForm();
}

function editEvent(index) {
  const event = selectedEvents[index];
  if (!event) return;
  eventTime.value = event.time;
  eventTitle.value = event.title;
  eventNote.value = event.note || '';
  eventCategory.value = event.category || 'love';
  openEventModal('edit', index);
}

function clearEventForm() {
  editingIndex.value = '';
  eventForm.reset();
  eventCategory.value = 'love';
}

function upsertEventFromForm() {
  const nextEvent = {
    time: eventTime.value,
    title: eventTitle.value.trim(),
    note: eventNote.value.trim(),
    category: eventCategory.value
  };

  if (!nextEvent.time || !nextEvent.title) return;

  const index = editingIndex.value === '' ? -1 : Number(editingIndex.value);
  if (index >= 0) {
    selectedEvents[index] = nextEvent;
  } else {
    selectedEvents.push(nextEvent);
  }
  selectedEvents = cloneEvents(selectedEvents);
  closeEventEditor();
  renderTimeline();
  softMagicSound();
  autoSaveDateSchedule(index >= 0 ? 'Item jadwal diubah dan tersimpan 💗' : 'Item jadwal masuk dan tersimpan 💗');
}

async function saveDateSchedule() {
  const payload = { events: cloneEvents(selectedEvents) };
  if (storageMode === 'api') {
    try {
      const result = await api(`/api/schedule/${selectedDate}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      selectedSource = result.source || 'custom';
      selectedEvents = cloneEvents(result.events);
      renderTimeline();
      saveSound();
      showToast('Jadwal tanggal ini tersimpan 💗');
      return;
    } catch (error) {
      showToast(error.message);
      wrongSound();
      return;
    }
  }

  localStorage.setItem(localKey(`schedule-${selectedDate}`), JSON.stringify(payload.events));
  selectedSource = 'custom';
  renderTimeline();
  saveSound();
  showToast('Jadwal tanggal ini tersimpan local 💗');
}

async function saveDefaultSchedule() {
  const payload = { events: cloneEvents(selectedEvents) };
  if (storageMode === 'api') {
    try {
      await api(`/api/defaults/${selectedWeekday}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      saveSound();
      showToast(`Default ${weekdayNames[selectedWeekday]} tersimpan 💚`);
      return;
    } catch (error) {
      showToast(error.message);
      wrongSound();
      return;
    }
  }

  localStorage.setItem(localKey(`default-${selectedWeekday}`), JSON.stringify(payload.events));
  saveSound();
  showToast(`Default ${weekdayNames[selectedWeekday]} tersimpan local 💚`);
}

async function resetDateSchedule() {
  if (storageMode === 'api') {
    try {
      const result = await api(`/api/schedule/${selectedDate}`, { method: 'DELETE' });
      selectedSource = result.source || 'default';
      selectedEvents = cloneEvents(result.events);
      renderTimeline();
      wrongSound();
      showToast('Tanggal ini balik ke default.');
      return;
    } catch (error) {
      showToast(error.message);
      return;
    }
  }

  localStorage.removeItem(localKey(`schedule-${selectedDate}`));
  await loadSchedule(selectedDate);
  wrongSound();
  showToast('Tanggal ini balik ke default local.');
}

async function autoSaveDateSchedule(message = 'Jadwal otomatis tersimpan 💗') {
  const payload = { events: cloneEvents(selectedEvents) };

  if (storageMode === 'api') {
    try {
      const result = await api(`/api/schedule/${selectedDate}`, {
        method: 'PUT',
        body: JSON.stringify(payload)
      });
      selectedSource = result.source || 'custom';
      selectedEvents = cloneEvents(result.events);
      renderTimeline();
      saveSound();
      showToast(message);
      return true;
    } catch (error) {
      showToast(error.message || 'Gagal menyimpan jadwal');
      wrongSound();
      return false;
    }
  }

  localStorage.setItem(localKey(`schedule-${selectedDate}`), JSON.stringify(payload.events));
  selectedSource = 'custom';
  renderTimeline();
  saveSound();
  showToast(message.replace('MariaDB', 'local'));
  return true;
}

async function loadNotes() {
  if (storageMode === 'api') {
    try {
      const result = await api('/api/notes');
      notes = { ...defaultNotes };
      (result.notes || []).forEach((note) => {
        notes[note.page_key] = note.body;
      });
      renderNotes();
      return;
    } catch (error) {
      storageMode = 'local';
      setSyncStatus('API notes error, sementara mode local browser.', false);
    }
  }

  notes = { ...defaultNotes, ...(JSON.parse(localStorage.getItem(localKey('notes')) || '{}')) };
  renderNotes();
}

function renderNotes() {
  Object.entries(notes).forEach(([key, body]) => {
    $$(`[data-note-slot="${key}"]`).forEach((slot) => {
      slot.textContent = body;
    });
  });

  if (!notesList) return;
  notesList.innerHTML = '';
  Object.keys(defaultNotes).forEach((key) => {
    const row = document.createElement('article');
    row.className = 'note-row';
    row.innerHTML = `
      <div class="note-meta">
        <p class="note-title">${noteLabel(key)}</p>
        <p class="note-body-preview">${escapeHtml(notes[key] || '')}</p>
      </div>
      <button class="small-btn" type="button" data-edit-note="${key}">Edit</button>
    `;
    notesList.appendChild(row);
  });

  $$('[data-edit-note]').forEach((button) => {
    button.addEventListener('click', () => openNoteEditor(button.dataset.editNote));
  });
}

function noteLabel(key) {
  const labels = {
    intro: 'Intro page',
    calendar: 'Calendar page',
    day: 'Detail tanggal',
    music: 'Music settings',
    notes: 'Love notes page'
  };
  return labels[key] || key;
}

function openNoteEditor(key) {
  clickSound();
  noteKeyBeingEdited = key;
  noteModalTitle.textContent = `Ubah note: ${noteLabel(key)}`;
  noteModalText.value = notes[key] || '';
  noteModal.classList.remove('hidden');
  noteModalText.focus();
}

function closeNoteEditor() {
  noteModal.classList.add('hidden');
  noteKeyBeingEdited = '';
}

async function saveCurrentNote() {
  const body = noteModalText.value.trim();
  if (!noteKeyBeingEdited || !body) return;

  if (storageMode === 'api') {
    try {
      await api(`/api/notes/${noteKeyBeingEdited}`, {
        method: 'PUT',
        body: JSON.stringify({ body })
      });
      notes[noteKeyBeingEdited] = body;
      renderNotes();
      closeNoteEditor();
      saveSound();
      showToast('Note tersimpan 💌');
      return;
    } catch (error) {
      showToast(error.message);
      wrongSound();
      return;
    }
  }

  notes[noteKeyBeingEdited] = body;
  localStorage.setItem(localKey('notes'), JSON.stringify(notes));
  renderNotes();
  closeNoteEditor();
  saveSound();
  showToast('Note tersimpan local 💌');
}

function ensureDefaultTrack(list = []) {
  const hasDefault = list.some((track) => track.source_type === 'default' || track.url === defaultMusicTrack.url);
  const normalized = hasDefault ? [...list] : [defaultMusicTrack, ...list];
  if (!normalized.some((track) => Number(track.is_active) === 1 || track.is_active === true)) {
    normalized[0] = { ...normalized[0], is_active: 1 };
  }
  return normalized;
}

async function loadMusic() {
  if (storageMode === 'api') {
    try {
      const result = await api('/api/music');
      tracks = ensureDefaultTrack(result.tracks || []);
      activeTrack = tracks.find((track) => Number(track.is_active) === 1) || tracks[0] || null;
      renderPlaylist();
      renderActiveTrack();
      return;
    } catch (error) {
      storageMode = 'local';
      setSyncStatus('API music error, sementara mode local browser.', false);
    }
  }

  tracks = ensureDefaultTrack(JSON.parse(localStorage.getItem(localKey('tracks')) || '[]'));
  activeTrack = tracks.find((track) => track.is_active) || tracks[0] || null;
  renderPlaylist();
  renderActiveTrack();
}

function renderActiveTrack() {
  activeTrackName.textContent = activeTrack ? activeTrack.title : 'Belum ada lagu dipilih';
}

function renderPlaylist() {
  playlist.innerHTML = '';
  if (!tracks.length) {
    playlist.innerHTML = '<p class="muted-text">Belum ada lagu. Default romantic music akan dipakai dulu ya.</p>';
    return;
  }

  tracks.forEach((track) => {
    const row = document.createElement('article');
    row.className = 'track-row';
    const isDefault = track.source_type === 'default' || String(track.id) === 'default-romantic';
    const source = isDefault ? 'Default romantic music' : 'Uploaded local audio';
    const deleteButton = isDefault ? '' : `<button class="danger-btn" type="button" data-delete-track="${track.id}">Hapus</button>`;
    row.innerHTML = `
      <div class="track-meta">
        <p class="track-title">${Number(track.is_active) === 1 || track.is_active === true ? '♪ ' : ''}${escapeHtml(track.title)}</p>
        <p class="track-subtitle">${source}${Number(track.is_active) === 1 || track.is_active === true ? ' • active background music' : ''}</p>
      </div>
      <div class="track-actions">
        <button class="small-btn" type="button" data-play-track="${track.id}">Play</button>
        <button class="small-btn" type="button" data-active-track="${track.id}">Pilih</button>
        ${deleteButton}
      </div>
    `;
    playlist.appendChild(row);
  });

  $$('[data-play-track]').forEach((button) => {
    button.addEventListener('click', () => {
      const track = tracks.find((item) => String(item.id) === String(button.dataset.playTrack));
      if (track) playTrack(track);
    });
  });

  $$('[data-active-track]').forEach((button) => {
    button.addEventListener('click', () => setActiveTrack(button.dataset.activeTrack));
  });

  $$('[data-delete-track]').forEach((button) => {
    button.addEventListener('click', () => deleteTrack(button.dataset.deleteTrack));
  });
}

async function uploadAudioTrack(event) {
  event.preventDefault();
  const file = audioFile.files[0];
  if (!file) return;

  if (storageMode === 'api') {
    try {
      const formData = new FormData();
      formData.append('title', uploadTitle.value.trim() || file.name);
      formData.append('audio', file);
      await api('/api/music/upload', {
        method: 'POST',
        body: formData
      });
      uploadForm.reset();
      await loadMusic();
      saveSound();
      showToast('Audio berhasil diupload 💚');
      return;
    } catch (error) {
      showToast(error.message);
      wrongSound();
      return;
    }
  }

  showToast('Upload audio butuh backend aktif supaya file tersimpan.');
  wrongSound();
}

async function setActiveTrack(id) {
  if (storageMode === 'api' && String(id) !== 'default-romantic') {
    try {
      await api(`/api/music/${id}/active`, { method: 'POST' });
      await loadMusic();
      saveSound();
      showToast('Background music dipilih ♪');
      return;
    } catch (error) {
      showToast(error.message);
      wrongSound();
      return;
    }
  }

  tracks = tracks.map((track) => ({ ...track, is_active: String(track.id) === String(id) }));
  activeTrack = tracks.find((track) => track.is_active) || null;
  if (storageMode !== 'api') {
    localStorage.setItem(localKey('tracks'), JSON.stringify(tracks.filter((track) => String(track.id) !== 'default-romantic')));
  }
  renderPlaylist();
  renderActiveTrack();
  saveSound();
  showToast('Background music dipilih ♪');
}

async function deleteTrack(id) {
  if (String(id) === 'default-romantic') {
    showToast('Default romantic music nggak bisa dihapus.');
    wrongSound();
    return;
  }

  if (storageMode === 'api') {
    try {
      await api(`/api/music/${id}`, { method: 'DELETE' });
      await loadMusic();
      wrongSound();
      showToast('Lagu dihapus.');
      return;
    } catch (error) {
      showToast(error.message);
      return;
    }
  }

  tracks = tracks.filter((track) => String(track.id) !== String(id));
  activeTrack = tracks.find((track) => track.is_active) || null;
  localStorage.setItem(localKey('tracks'), JSON.stringify(tracks));
  renderPlaylist();
  renderActiveTrack();
  wrongSound();
  showToast('Lagu dihapus local.');
}

function playTrack(track) {
  if (!track) return;
  clickSound();
  musicWasStartedByUser = true;
  audioPlayer.pause();
  audioPlayer.removeAttribute('src');

  if (track.url) {
    audioPlayer.src = track.url;
    audioPlayer.volume = 0.45;
    audioPlayer.play().catch(() => {
      showToast('Browser butuh klik sekali lagi untuk play audio.');
    });
    showToast(`Playing: ${track.title}`);
  }
}

function stopMusic() {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;
  clickSound();
}

function switchPage(pageId) {
  $$('.tab-btn').forEach((button) => button.classList.toggle('active', button.dataset.page === pageId));
  $$('.page').forEach((page) => page.classList.toggle('active-page', page.id === pageId));
  softMagicSound();
  if (pageId === 'musicPage') loadMusic();
  if (pageId === 'notesPage') renderNotes();
}

function wireEvents() {
  document.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button || button.id === 'soundToggle') return;
    clickSound();
    buttonSpark(button);
  }, { capture: true });

  soundToggle.addEventListener('click', () => {
    sfxEnabled = !sfxEnabled;
    soundToggle.textContent = sfxEnabled ? '🔊' : '🔇';
    if (sfxEnabled) softMagicSound();
  });

  openPlannerBtn.addEventListener('click', async () => {
    fullCelebration();
    introScreen.classList.add('hidden');
    planner.classList.remove('hidden');
    renderCalendar();
    await loadSchedule(selectedDate);
    if (activeTrack) setTimeout(() => playTrack(activeTrack), 350);
  });

  backIntroBtn.addEventListener('click', () => {
    softMagicSound();
    planner.classList.add('hidden');
    introScreen.classList.remove('hidden');
  });

  $$('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => switchPage(button.dataset.page));
  });

  miniPlayerBtn.addEventListener('click', () => {
    miniPlayer.classList.toggle('hidden');
  });

  playActiveBtn.addEventListener('click', () => {
    if (!activeTrack) {
      showToast('Pilih lagu dulu di Music Settings.');
      wrongSound();
      return;
    }
    playTrack(activeTrack);
  });

  stopMusicBtn.addEventListener('click', stopMusic);

  prevMonthBtn.addEventListener('click', () => {
    visibleMonth -= 1;
    if (visibleMonth < 0) {
      visibleMonth = 11;
      visibleYear -= 1;
    }
    renderCalendar();
  });

  nextMonthBtn.addEventListener('click', () => {
    visibleMonth += 1;
    if (visibleMonth > 11) {
      visibleMonth = 0;
      visibleYear += 1;
    }
    renderCalendar();
  });

  eventForm.addEventListener('submit', (event) => {
    event.preventDefault();
    upsertEventFromForm();
  });

  addEventBtn.addEventListener('click', () => openEventModal('add'));
  clearFormBtn.addEventListener('click', closeEventEditor);
  closeEventModal.addEventListener('click', closeEventEditor);
  eventModal.addEventListener('click', (event) => {
    if (event.target === eventModal) closeEventEditor();
  });
  if (saveDateBtn) saveDateBtn.addEventListener('click', saveDateSchedule);
  if (saveDefaultBtn) saveDefaultBtn.addEventListener('click', saveDefaultSchedule);
  if (resetDateBtn) resetDateBtn.addEventListener('click', resetDateSchedule);

  uploadForm.addEventListener('submit', uploadAudioTrack);
  refreshMusicBtn.addEventListener('click', loadMusic);

  reloadNotesBtn.addEventListener('click', loadNotes);
  saveNoteModalBtn.addEventListener('click', saveCurrentNote);
  closeNoteModal.addEventListener('click', closeNoteEditor);
  cancelNoteModalBtn.addEventListener('click', closeNoteEditor);
  noteModal.addEventListener('click', (event) => {
    if (event.target === noteModal) closeNoteEditor();
  });
}

async function init() {
  wireEvents();
  renderNotes();
  renderCalendar();
  renderTimeline();
  await checkHealth();
  await loadNotes();
  await loadMusic();
  await loadSchedule(selectedDate);
}

init();
