const electron = require('electron')
const url = require('url')
const path = require('path')


const app = electron.app
const BrowserWindow = electron.BrowserWindow
let mainWindow

function createWindow(){
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file',
    slashes: true
  }))

  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  const Menu = electron.Menu
  const menuTemplate = [
        {
            label: 'Lama',
            subMenu: [
              {
                label: 'Reset',
                click: () => {
                  alert(1)
                }
              }
            ]
        }
    ];
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);

}



app.on('ready', createWindow)

app.on('window-all-closed', function() {
  if(process.platform !== 'darwin'){
    app.quit()
  }
})

app.on('activate', function() {
  if(mainWindow === null) {
    createWindow()
  }
})
