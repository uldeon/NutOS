let zIndexCounter = 1;

function createWindow(title, content) {
  const dockHeight = 50; // hauteur dock

  const win = document.createElement('div');
  win.className = 'window';

  // Plein écran (moins dock)
  win.style.top = '0px';
  win.style.left = '0px';
  win.style.width = '100%';
  win.style.height = `calc(100% - ${dockHeight}px)`;
  win.style.zIndex = zIndexCounter++;

  // Header minimal (optionnel : tu peux cacher le header en mobile)
  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerText = title;
  win.appendChild(header);

  const body = document.createElement('div');
  body.className = 'window-content';
  body.innerHTML = content;
  win.appendChild(body);

  document.getElementById('desktop').appendChild(win);

  makeDraggable(win); // si tu veux garder le drag (sinon commenter pour mobile)

  return win;
}

// Fermer toutes les fenêtres
function closeAllWindows() {
  const desktop = document.getElementById('desktop');
  while (desktop.firstChild) {
    desktop.removeChild(desktop.firstChild);
  }
}

// Ajout gestion bouton fermer tout
document.addEventListener('DOMContentLoaded', () => {
  const closeBtn = document.getElementById('closeAllBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeAllWindows);
  }
});


function makeDraggable(win) {
  const header = win.querySelector('.window-header');
  let isDragging = false, offsetX = 0, offsetY = 0;

  header.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - win.offsetLeft;
    offsetY = e.clientY - win.offsetTop;
    win.style.zIndex = zIndexCounter++;
  });

  document.addEventListener('mousemove', e => {
    if (!isDragging) return;
    win.style.left = (e.clientX - offsetX) + 'px';
    win.style.top = (e.clientY - offsetY) + 'px';
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}
