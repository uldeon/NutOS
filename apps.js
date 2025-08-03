const apps = {
  notes: {
    title: 'Notes',
    content: `<textarea id="notesTextArea" style="width:100%; height: 100%; box-sizing: border-box;"></textarea>`
  },
  browser: {
    title: 'Navigateur',
    content: `
      <div style="display:flex; flex-direction: column; height: 100%;">
        <input type="text" id="browserUrl" placeholder="https://example.com" style="padding:5px; font-size:16px;"/>
        <iframe id="browserFrame" src="https://example.com" style="flex-grow:1; border:none;"></iframe>
      </div>`
  },
  clock: {
    title: 'Horloge',
    content: `
      <div style="font-size:48px; text-align:center; margin-top: 50px;" id="clockDisplay">--:--:--</div>
      <div style="margin-top:20px; text-align:center;">
        <input type="time" id="alarmTime"/>
        <button id="setAlarmBtn">Activer alarme</button>
        <div id="alarmStatus" style="margin-top:10px; font-weight:bold;"></div>
      </div>`
  },
  gallery: {
    title: 'Galerie',
    content: `
      <input type="file" id="imgUploader" accept="image/*" multiple>
      <div id="imgGallery" style="margin-top:10px; display:flex; flex-wrap: wrap;"></div>`
  },
  filemanager: {
    title: 'Fichiers',
    content: `<div id="fileList" style="padding:10px; overflow-y:auto; height: 100%;"></div>`
  },
  calendar: {
    title: 'Agenda',
    content: `
      <div style="padding:10px;">
        <input type="date" id="eventDate"/>
        <input type="text" id="eventDesc" placeholder="Description événement" style="width: 60%;"/>
        <button id="addEventBtn">Ajouter événement</button>
        <ul id="eventList" style="margin-top:10px;"></ul>
      </div>`
  },
  calculator: {
    title: 'Calculatrice',
    content: `
      <div style="width: 100%; height: 100%; display: flex; flex-direction: column;">
        <input type="text" id="calcDisplay" readonly style="font-size: 24px; padding: 10px;"/>
        <div id="calcButtons" style="flex-grow: 1; display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; padding: 10px;">
          <button>7</button><button>8</button><button>9</button><button>/</button>
          <button>4</button><button>5</button><button>6</button><button>*</button>
          <button>1</button><button>2</button><button>3</button><button>-</button>
          <button>0</button><button>.</button><button>=</button><button>+</button>
          <button id="clearBtn" style="grid-column: span 4;">C</button>
        </div>
      </div>`
  }
};

function launchApp(appName) {
  if (!apps[appName]) {
    alert('Application non trouvée : ' + appName);
    return;
  }

  createWindow(apps[appName].title, apps[appName].content);

  switch(appName) {
    case 'notes': initNotes(); break;
    case 'browser': initBrowser(); break;
    case 'clock': initClock(); break;
    case 'gallery': initGallery(); break;
    case 'filemanager': initFileManager(); break;
    case 'calendar': initCalendar(); break;
    case 'calculator': initCalculator(); break;
  }
}

// --- Notes ---
function initNotes() {
  const textarea = document.getElementById('notesTextArea');
  if (!textarea) return;
  const saved = localStorage.getItem('phoneos_notes') || '';
  textarea.value = saved;
  textarea.addEventListener('input', () => {
    localStorage.setItem('phoneos_notes', textarea.value);
  });
}

// --- Navigateur ---
function initBrowser() {
  const urlInput = document.getElementById('browserUrl');
  const iframe = document.getElementById('browserFrame');
  if (!urlInput || !iframe) return;
  urlInput.value = iframe.src;

  urlInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      let url = urlInput.value.trim();
      if (!/^https?:\/\//i.test(url)) {
        url = 'http://' + url;
      }
      iframe.src = url;
    }
  });
}

// --- Horloge et alarme ---
function initClock() {
  const clockDisplay = document.getElementById('clockDisplay');
  const alarmInput = document.getElementById('alarmTime');
  const setAlarmBtn = document.getElementById('setAlarmBtn');
  const alarmStatus = document.getElementById('alarmStatus');
  if (!clockDisplay || !alarmInput || !setAlarmBtn || !alarmStatus) return;

  let alarmTime = null;
  let alarmTimeout = null;

  function updateClock() {
    const now = new Date();
    clockDisplay.textContent = now.toLocaleTimeString();

    if (alarmTime) {
      const nowStr = now.toTimeString().slice(0,5);
      if (nowStr === alarmTime) {
        alert('🔔 ALARME !');
        alarmStatus.textContent = 'Alarme déclenchée !';
        alarmTime = null;
        alarmTimeout && clearTimeout(alarmTimeout);
      }
    }
  }

  setAlarmBtn.addEventListener('click', () => {
    if (alarmInput.value) {
      alarmTime = alarmInput.value;
      alarmStatus.textContent = 'Alarme réglée à ' + alarmTime;
    }
  });

  updateClock();
  setInterval(updateClock, 1000);
}

// --- Galerie ---
function initGallery() {
  const uploader = document.getElementById('imgUploader');
  const gallery = document.getElementById('imgGallery');
  if (!uploader || !gallery) return;

  uploader.addEventListener('change', e => {
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      const img = document.createElement('img');
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.margin = '5px';

      const reader = new FileReader();
      reader.onload = (function(aImg) {
        return function(e) {
          aImg.src = e.target.result;
          saveImageToStorage(e.target.result, file.name);
        };
      })(img);
      reader.readAsDataURL(file);

      gallery.appendChild(img);
    }
  });

  loadImagesFromStorage();
}

// Stockage basique en localStorage (limité)
function saveImageToStorage(dataUrl, name) {
  let images = JSON.parse(localStorage.getItem('phoneos_images') || '[]');
  images.push({name: name, data: dataUrl});
  localStorage.setItem('phoneos_images', JSON.stringify(images));
}

function loadImagesFromStorage() {
  const gallery = document.getElementById('imgGallery');
  if (!gallery) return;
  let images = JSON.parse(localStorage.getItem('phoneos_images') || '[]');
  images.forEach(imgObj => {
    const img = document.createElement('img');
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    img.style.margin = '5px';
    img.src = imgObj.data;
    gallery.appendChild(img);
  });
}

// --- Gestionnaire de fichiers simple ---
function initFileManager() {
  const fileList = document.getElementById('fileList');
  if (!fileList) return;

  fileList.innerHTML = '<h3>Notes enregistrées :</h3>';
  const note = localStorage.getItem('phoneos_notes');
  const noteElem = document.createElement('pre');
  noteElem.style.whiteSpace = 'pre-wrap';
  noteElem.style.background = '#eee';
  noteElem.style.padding = '10px';
  noteElem.textContent = note || '(aucune note)';
  fileList.appendChild(noteElem);

  fileList.appendChild(document.createElement('hr'));

  fileList.appendChild(document.createElement('h3')).textContent = 'Images enregistrées :';
  let images = JSON.parse(localStorage.getItem('phoneos_images') || '[]');
  images.forEach(imgObj => {
    const img = document.createElement('img');
    img.style.width = '100px';
    img.style.height = '100px';
    img.style.objectFit = 'cover';
    img.style.margin = '5px';
    img.src = imgObj.data;
    fileList.appendChild(img);
  });
}

// --- Agenda simple ---
function initCalendar() {
  const eventDate = document.getElementById('eventDate');
  const eventDesc = document.getElementById('eventDesc');
  const addEventBtn = document.getElementById('addEventBtn');
  const eventList = document.getElementById('eventList');
  if (!eventDate || !eventDesc || !addEventBtn || !eventList) return;

  let events = JSON.parse(localStorage.getItem('phoneos_events') || '[]');

  function renderEvents() {
    eventList.innerHTML = '';
    events.forEach((ev, i) => {
      const li = document.createElement('li');
      li.textContent = `${ev.date} : ${ev.desc}`;
      eventList.appendChild(li);
    });
  }

  addEventBtn.addEventListener('click', () => {
    if (!eventDate.value || !eventDesc.value.trim()) return alert('Date et description requises');
    events.push({date: eventDate.value, desc: eventDesc.value.trim()});
    localStorage.setItem('phoneos_events', JSON.stringify(events));
    eventDesc.value = '';
    renderEvents();
  });

  renderEvents();
}

// --- Calculatrice basique ---
function initCalculator() {
  const display = document.getElementById('calcDisplay');
  const buttons = document.querySelectorAll('#calcButtons button');
  if (!display || buttons.length === 0) return;

  let current = '';

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.textContent;
      if (val === 'C') {
        current = '';
        display.value = '';
      } else if (val === '=') {
        try {
          // Eval basique, à améliorer (attention aux injections)
          current = eval(current).toString();
          display.value = current;
        } catch {
          display.value = 'Erreur';
          current = '';
        }
      } else {
        current += val;
        display.value = current;
      }
    });
  });
}
