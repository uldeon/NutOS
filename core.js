let zIndexCounter = 1;

function createWindow(title, content) {
  const win = document.createElement('div');
  win.className = 'window';
  win.style.top = '60px';
  win.style.left = '60px';
  win.style.zIndex = zIndexCounter++;

  const header = document.createElement('div');
  header.className = 'window-header';
  header.innerText = title;
  win.appendChild(header);

  const body = document.createElement('div');
  body.className = 'window-content';
  body.innerHTML = content;
  win.appendChild(body);

  document.getElementById('desktop').appendChild(win);
  makeDraggable(win);
}

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
