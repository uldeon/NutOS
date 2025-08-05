/* core.js - Gestion du Phone OS mobile */

let openApps = []; // Liste des apps ouvertes {name, title, content}
let appHistory = []; // Historique pour le bouton retour

/**
 * Lance une application en plein écran
 * @param {string} appName - Nom de l'application
 */
function launchApp(appName) {
  if (!apps[appName]) return alert("App inconnue : " + appName);

  // Ajout dans la liste des apps ouvertes si pas déjà
  if (!openApps.find(a => a.name === appName)) {
    openApps.push({
      name: appName,
      title: apps[appName].title,
      content: apps[appName].content
    });
  }

  // Afficher l'écran app et cacher le home
  document.getElementById('homeScreen').style.display = 'none';
  document.getElementById('appScreen').style.display = 'flex';

  // Charger le contenu
  document.getElementById('appContent').innerHTML = apps[appName].content;

  // Initialisation spécifique selon l'app
  if (appName === 'notes') initNotes();
  if (appName === 'browser') initBrowser();
  if (appName === 'clock') initClock();
  if (appName === 'gallery') initGallery();
  if (appName === 'filemanager') initFileManager();
  if (appName === 'calendar') initCalendar();
  if (appName === 'calculator') initCalculator();

  // Ajouter à l'historique
  appHistory.push(appName);
}

/**
 * Retourne à l'écran d'accueil
 */
function goHome() {
  document.getElementById('appScreen').style.display = 'none';
  document.getElementById('homeScreen').style.display = 'flex';
}

/**
 * Bouton retour
 */
function goBack() {
  if (appHistory.length > 1) {
    // Supprimer l'app actuelle
    appHistory.pop();
    const lastApp = appHistory.pop();
    if (lastApp) launchApp(lastApp);
  } else {
    goHome();
  }
}

/**
 * Ouvre le multitâche
 */
function openTaskSwitcher() {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = '';

  openApps.forEach((app, i) => {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = `<strong>${app.title}</strong>`;

    const btnOpen = document.createElement('button');
    btnOpen.textContent = "Ouvrir";
    btnOpen.onclick = () => { closeTaskSwitcher(); launchApp(app.name); };

    const btnClose = document.createElement('button');
    btnClose.textContent = "Fermer";
    btnClose.onclick = () => { openApps.splice(i, 1); div.remove(); };

    div.appendChild(btnOpen);
    div.appendChild(btnClose);
    taskList.appendChild(div);
  });

  document.getElementById('taskSwitcher').style.display = 'block';
}

/**
 * Ferme le multitâche
 */
function closeTaskSwitcher() {
  document.getElementById('taskSwitcher').style.display = 'none';
}
