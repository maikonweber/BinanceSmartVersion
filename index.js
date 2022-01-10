const {app, BrowserWindow} = require('electron');

let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            devTools: true 
        }
        // Dev Tools: true

     
    });

    mainWindow.loadURL( `file://${__dirname}/index.html` );
    
});