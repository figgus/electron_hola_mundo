const electron = require('electron')
const url  = require('url')
const path = require('path');
const { Menu } = require('electron');

const {app, BrowserWindow,ipcMain} = electron

let mainWindow ;
let addWindow

app.on('ready',()=>{
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainWindow.html'),
        protocol: 'file',
        slashes: true
    }))

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
})

function createAddWindow(){
    addWindow = new BrowserWindow({
        width: 200,
        height: 300,
        title: 'Add shopping list item',
        webPreferences: {
            nodeIntegration: true
        }
    })
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname,'addWindow.html'),
        protocol: 'file',
        slashes: true
    }))

    mainWindow.on('closed',()=>{
        app.quit()
    })

    ipcMain.on('item:add',function(e,item){
        console.log(item)
        mainWindow.send('item:add',item)

        addWindow.close()
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)
}

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'ADD ITEM',
                click(){
                    createAddWindow()
                }
            },
            {
                label: 'Clear Item',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label:'Quit',
                acceleraton: process.platform == 'darwin'?'Command+Q':'Ctrl+Q',
                click(){
                    app.quit()
                }
            },
            {
                label:'Developer tools',
                click(item,focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            }
            
        ]
    }
]