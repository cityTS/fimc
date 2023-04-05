import {app, BrowserWindow, shell, ipcMain, Menu} from 'electron'
import {release} from 'node:os'
import {join} from 'node:path'


// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? join(process.env.DIST_ELECTRON, '../public')
    : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

Menu.setApplicationMenu(null)

async function createWindow() {
    win = new BrowserWindow({
        title: 'Main window',
        icon: join(process.env.PUBLIC, 'favicon.ico'),
        // 登录后
        // width: 900,
        // height: 650,
        // resizable: true,
        // 登陆前
        width: 350,
        height: 405,
        resizable: false,
        webPreferences: {
            // 关闭跨域
            webSecurity: false,
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) { // electron-vite-vue#298
        win.loadURL(url)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.on('will-navigate', (event, url) => {
        event.preventDefault()
        shell.openExternal(url)
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false
        },
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${url}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, {hash: arg})
    }
})

// sqlite3

import sq3 from "sqlite3";

const sqlite3 = sq3.verbose();

let db;

ipcMain.on('load-sqlite3', (event, userAccount) => {
    db = new sqlite3.Database(userAccount + '.db', err => {
        if (err != null) {
            console.log(err)
        }
        // 聊天列表
        db.run("create table if not exists chatList(" +
            "id integer primary key autoincrement, " + // 列表ID
            "userAccount integer, " + // 好友账号
            "avatarUrl varchar(255), " +
            "friendNickname varchar(255), " +
            "recentNews varchar(255), " +
            "unreadNumber integer, " +
            "createTime integer)",
                err => {
            if(err != null) {
                console.log(err);
            }
            // 本地缓存的消息记录
            db.run("create table if not exists messageList(messageId integer, type varchar(5), content varchar(255), imgUrl varchar(255), fileName varchar(255), fileUrl varchar(255), fromUser integer, toUser integer, toUserType varchar(1), isGroupMessage integer, fromGroup integer, ip varchar(15), readed integer, createTime integer)", err => {
                if(err != null) {
                    console.log(err)
                }
                // 本地缓存的好友列表
                db.run("create table if not exists friend(friendId integer, avatarUrl varchar(255), friendNickname varchar(255), userAccount integer)", err => {
                    if(err != null) {
                        console.log(err)
                    }
                })
            })
        })
    });
});

const getChatList = async () => {
    return new Promise(resolve => {
        db.all("select * from chatList", (err, res) => {
            if(err) throw err;
            else resolve(res);
        })
    })
}

ipcMain.handle('query-chat-list', async (event) => {
    return await getChatList();
})

const getUser = async (userAccount) => {
    return new Promise(resolve => {
        db.get("select * from friend where friendId=" + userAccount, (err, res) => {
            if(err) throw err;
            else resolve(res);
        })
    })
}

ipcMain.handle('query-user', async (event, userAccount) => {
    return await getUser(userAccount);
})

const getUserMessage = async (userAccount) => {
    return new Promise(resolve => {
        db.all("select * from messageList where fromUser = " + userAccount + " or toUser = " + userAccount, (err, res) => {
            if(err != null) throw err;
            else resolve(res);
        })
    })
}

ipcMain.handle('query-friend-message', async (event, userAccount) => {
    return await getUserMessage(userAccount);
})

const getUserList = async () => {
    return new Promise(resolve => {
        db.all("select * from friend", (err, res) => {
            if(err != null) throw err;
            else resolve(res);
        })
    })
}

ipcMain.handle('query-friend-list', async (event) => {
    return await getUserList();
})


/**
 * 修改窗口大小
 */
ipcMain.on('change-window-size', (event, width, height) => {
    if(width === 900) win.resizable = true
    else win.resizable = false
    win.setSize(width, height)
})

/**
 * Websocket
 */

const WebSocket = require('ws')

ipcMain.on('create-ws-con', (event, userId) => {
    createWSCon(userId)
})

let ws
const createWSCon = (userId) => {
    let device = ''
    switch (process.platform) {
        case "darwin":
            device = '2'
            break
        case "linux":
            device = '3'
            break
        case "win32":
            device = '1'
            break
    }
    ws = new WebSocket('ws://localhost:4399/api/addWSConn?device=' + device + '&userId=' + userId)
    ws.on('message', e => {
        console.log('服务端返回的信息:', e)
    })
    ws.on('error', e => {
        console.log(e)
    })
}