const { app, BrowserWindow, dialog, shell } = require('electron');
const path = require('path');

// Repositorio "madre" en GitHub: se consulta al iniciar para detectar versiones nuevas
const GITHUB_REPO = 'RXDG2908/rivalsito';

function isNewerVersion(latest, current) {
  const a = latest.split('.').map(n => parseInt(n, 10) || 0);
  const b = current.split('.').map(n => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    if ((a[i] || 0) > (b[i] || 0)) return true;
    if ((a[i] || 0) < (b[i] || 0)) return false;
  }
  return false;
}

async function checkForUpdates(win) {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: { 'User-Agent': 'Rivalsito-Updater', 'Accept': 'application/vnd.github+json' },
    });
    if (!res.ok) return;
    const release = await res.json();
    const latest = String(release.tag_name || '').replace(/^v/i, '');
    const current = app.getVersion();
    if (!latest || !isNewerVersion(latest, current)) return;

    // Enlace directo al .exe del release si existe; si no, a la página del release
    const exeAsset = (release.assets || []).find(a => a.name && a.name.toLowerCase().endsWith('.exe'));
    const downloadUrl = exeAsset ? exeAsset.browser_download_url : release.html_url;

    const { response } = await dialog.showMessageBox(win, {
      type: 'info',
      title: 'Actualización disponible',
      message: `¡Hay una nueva versión de Rivalsito! (v${latest})`,
      detail: `Tienes la versión v${current}. Descarga el nuevo Rivalsito.exe y reemplaza el actual.`,
      buttons: ['Descargar ahora', 'Después'],
      defaultId: 0,
      cancelId: 1,
      noLink: true,
    });
    if (response === 0) {
      shell.openExternal(downloadUrl);
    }
  } catch {
    // Sin conexión o límite de API: la app funciona normal sin actualizar
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, '..', 'build', 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  win.webContents.once('did-finish-load', () => checkForUpdates(win));
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
