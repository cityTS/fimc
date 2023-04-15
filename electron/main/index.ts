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
let uAccount;
ipcMain.handle('load-sqlite3', (event, userAccount) => {
    if (userAccount === "") {
        console.error('无效的用户账号')
    }
    uAccount = parseInt(userAccount)
    db = new sqlite3.Database(userAccount + '.db', err => {
        if (err != null) {
            console.log(err)
        }
        // 聊天列表
        db.run("create table if not exists chatList(" +
            "id integer primary key autoincrement, " + // 列表ID
            "userAccount integer, " + // 好友账号
            "avatarUrl varchar(255), " + // 头像  去好友列表查
            "friendNickname varchar(255), " + // 备注 去好友列表查
            "recentNews varchar(255), " + // 最新消息
            "unreadNumber integer, " + // 未读消息数
            "createTime integer)", // 最新的操作时间（排序规则）
            err => {
                if (err != null) {
                    console.log(err);
                }
                // 本地缓存的消息记录
                db.run("create table if not exists messageList(" +
                    "messageId integer, " + // 消息ID
                    "type integer, " + // 消息类型
                    "content varchar(255), " + // 文本内容
                    "imgUrl varchar(255), " + // 图片链接
                    "fileName varchar(255), " + // 文件名
                    "fileUrl varchar(255), " + // 文件链接
                    "fromUser integer, " + // 谁发的
                    "toUser integer, " + // 给谁的
                    "isGroupMessage integer default 0, " + // 是否是群消息
                    "fromGroup integer, " + // 来自哪个群
                    "readed integer default 0, " + // 是否已读
                    "createTime integer)", // 发送时间
                    err => {
                        if (err != null) {
                            console.log(err)
                        }
                        // 本地缓存的好友列表
                        db.run("create table if not exists friend(" +
                            "avatarUrl varchar(255), " + // 好友头像
                            "friendNickname varchar(255), " + // 备注
                            "userAccount integer," + // 账号
                            "username varchar(255)," + // 用户名
                            "sex char(2)," + // 性别
                            "birth integer" + // 生日
                            ")",
                            err => {
                                if (err != null) {
                                    console.log(err)
                                }
                            })
                    })
            })
    });
    return 1
});
const getNewsMessage = () => {
    db.get("select max(messageId) as messageId from messageList", (err, res) => {
        if (err) throw err
        else {
            if (res.messageId === null) res = '0';
            else res = res.messageId.toString()
            initMessages(res)
        }
    })
}
ipcMain.on('get-news-message', (event) => {
    getNewsMessage()
})

const getChatList = async () => {
    return new Promise(resolve => {
        db.all("select * from chatList", (err, res) => {
            if (err) throw err;
            else resolve(res);
        })
    })
}

const updateChatList = () => {
    let userId = uAccount
    // console.log("begin update chat list: ", userId)
    db.all("select * from messageList order by createTime ", async (err, res) => {
        if (err) throw err
        // console.log("query message list:", res)
        let map = {}
        for (const i in res) {
            let user;
            // console.log(res[i], userId)
            if (res[i].fromUser !== userId) {
                user = res[i].fromUser
            } else {
                user = res[i].toUser;
            }
            // console.log(typeof res[i].fromUser, typeof res[i].toUser, typeof userId, typeof user)
            if (map[user] === undefined) {
                map[user] = {
                    createTime: '',
                    type: '',
                    recentNews: '',
                    unreadNumber: 0,
                    avatarUrl: '',
                    friendNickname: ''
                }
                let u = await getAvatarAndNickname(user)
                // console.log("-----U-------")
                // console.log(u)
                // @ts-ignore
                map[user].avatarUrl = "'" + u.avatarUrl + "'"
                // @ts-ignore
                map[user].friendNickname = "'" + u.friendNickname + "'"
            }
            map[user].createTime = res[i].createTime
            if (!res[i].readed) {
                map[user].unreadNumber++
            }
            if (res[i].type === 1) map[user].recentNews = "'" + res[i].content + "'"
            else if (res[i].type === 2) map[user].recentNews = "'[图片]'"
            else map[user].recentNews = "'[文件]'"
        }
        for (const userAccount in map) {
            db.run("update chatList set " +
                "recentNews=" + map[userAccount].recentNews + "," +
                "unreadNumber=" + map[userAccount].unreadNumber + "," +
                "createTime=" + map[userAccount].createTime + "," +
                "avatarUrl=" + map[userAccount].avatarUrl + "," +
                "friendNickname=" + map[userAccount].friendNickname +
                " where userAccount=" + userAccount, err => {
                    if (err) throw err;

                    db.get("select count(*) as num from chatList where userAccount=" + userAccount, (err, res) => {
                        if (err) throw err
                        // console.log(res.num)
                        // console.log(typeof res.num)
                        if (res.num === 0) {
                            db.run("insert into chatList(userAccount, recentNews, unreadNumber, createTime, avatarUrl, friendNickname)" +
                                "values(" + userAccount + "," +
                                map[userAccount].recentNews + "," +
                                map[userAccount].unreadNumber + "," +
                                map[userAccount].createTime + "," +
                                map[userAccount].avatarUrl + "," +
                                map[userAccount].friendNickname +
                                ")", err => {
                                    if (err) throw err
                                }
                            )
                        }
                    })
                }
            )
        }
    })

}
/**
 * ipc:查询聊天目录
 */
ipcMain.handle('query-chat-list', async (event) => {
    return await getChatList();
})

ipcMain.handle('get-chat-list-ack', (event) => {
    return chatListAck
})

ipcMain.on('update-chat-list', (event) => {
    updateChatList()
})

const getUser = async (userAccount) => {
    return new Promise(resolve => {
        db.get("select * from friend where userAccount=" + userAccount, (err, res) => {
            if (err) throw err;
            // console.log(res)
            resolve(res);
        })
    })
}

/**
 * ipc:查询用户信息
 */
ipcMain.handle('query-user', async (event, userAccount) => {
    return await getUser(userAccount);
})

const getUserMessage = async (userAccount) => {
    return new Promise(resolve => {
        db.all("select * from messageList where fromUser = " + userAccount + " or toUser = " + userAccount, (err, res) => {
            if (err != null) throw err;
            else resolve(res);
        })
    })
}

/**
 * ipc:查询消息记录
 */
ipcMain.handle('query-friend-message', async (event, userAccount) => {
    return await getUserMessage(userAccount);
})

const getUserList = async () => {
    return new Promise(resolve => {
        db.all("select * from friend", (err, res) => {
            if (err != null) throw err;
            else resolve(res);
        })
    })
}

/**
 * ipc:查询好友列表
 */
ipcMain.handle('query-friend-list', async (event) => {
    return await getUserList();
})


/**
 * ipc:修改窗口大小
 */
ipcMain.on('change-window-size', (event, width, height) => {
    if (width === 900) win.resizable = true
    else win.resizable = false
    win.setSize(width, height)
    win.center()
})

/**
 * ipc:建立WS连接
 */
ipcMain.on('create-ws-con', (event, userId) => {
    createWSCon(userId)
})

/**
 * ipc:发送消息
 */
ipcMain.on('send-message', (event, message) => {
    sendMessage(message)
})

/**
 * Websocket模块
 */

const WebSocket = require('ws')


let ws
/**
 * ws: 建立ws连接
 * @param userId
 */
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
    ws = new WebSocket('ws://43.139.136.169:10026/api/addWSConn?device=' + device + '&userId=' + userId)
    ws.on('message', e => {
        let message = eval('(' + e + ')')
        // console.log('------get a new news-----')
        // console.log(message)
        switch (message.type) {
            case 4:
                handleNoticeMessage(message)
                break
            case 1:
            case 2:
            case 3:
                handleTIFMessage(message)
                break
        }
    })
    ws.on('error', e => {
        console.log(e)
    })
}
let chatListAck = 0
const handleTIFMessage = (c) => {
    for (const cKey in c) {
        if (!c[cKey]) {
            if (cKey === 'isGroupMessage') c[cKey] = 0
            else if (cKey === 'readed') c[cKey] = 0
            else c[cKey] = 'NULL'
        } else if (typeof c[cKey] === "string") {
            c[cKey] = "'" + c[cKey] + "'"
        }
    }
    db.run("insert into messageList(messageId, type, content, fromUser, toUser, isGroupMessage, readed, createTime)" +
        "values(" + c.id + "," + c.type + "," + c.content + ","  + c.fromUser + "," + c.toUser + "," + c.isGroupMessage + "," + c.readed + "," + c.createTime + ")", err => {
        // console.log("add a new news:", c.toString(), "err:", err)
        chatListAck++
    })
}

const handleNoticeMessage = (message) => {
    switch (message.notice) {
        case 4:
            handlePullUnloadMessageNotice(message.content)
            break
    }
}

// const updateChatList = () => {
//     let userId = uAccount
//     console.log("begin update chat list: ", userId)
//     db.all("select * from messageList order by createTime", async (err, res) => {
//         if (err) throw err
//         console.log("query message list:", res)
//         let map = {}
//         for (const i in res) {
//             let user;
//             if (res[i].fromUser !== userId) {
//                 user = res[i].fromUser
//             } else {
//                 user = res[i].toUser;
//             }
//             if (map[user] === undefined) {
//                 map[user] = {
//                     createTime: '',
//                     type: '',
//                     recentNews: '',
//                     unreadNumber: 0,
//                     avatarUrl: '',
//                     friendNickname: ''
//                 }
//                 let u = await getAvatarAndNickname(user)
//                 // @ts-ignore
//                 map[user].avatarUrl = u.avatarUrl
//                 // @ts-ignore
//                 map[user].friendNickname = u.friendNickname
//             }
//             map[user].createTime = res[i].createTime
//             if (res[i].readed === 0) {
//                 map[user].unreadNumber++
//             }
//             if (res[i].type === 1) map[user].recentNews = "'" + res[i].content + "'"
//             else if (res[i].type === 2) map[user].recentNews = "'[图片]'"
//             else map[user].recentNews = "'[文件]'"
//         }
//         for (const userAccount in map) {
//             db.run("update chatList set " +
//                 "recentNews=" + map[userAccount].recentNews + "," +
//                 "unreadNumber=" + map[userAccount].unreadNumber + "," +
//                 "createTime=" + map[userAccount].createTime +
//                 " where userAccount=" + userAccount, err => {
//                     if (err) throw err;
//
//                     db.get("select count(*) as num from chatList where userAccount=" + userAccount, (err, res) => {
//                         if (err) throw err
//                         if (res.num === 0) {
//                             db.run("insert into chatList(userAccount, recentNews, unreadNumber, createTime)" +
//                                 "values(" + userAccount + "," +
//                                 map[userAccount].recentNews + "," +
//                                 map[userAccount].unreadNumber + "," +
//                                 map[userAccount].createTime + ")", err => {
//                                     if (err) throw err
//                                 }
//                             )
//                         }
//                     })
//                 }
//             )
//         }
//     })
// }


const getAvatarAndNickname = async (userid) => {
    return new Promise(resolve => {
        // console.log("select * from friend where userAccount=" + userid)
        db.get("select * from friend where userAccount=" + userid, (err, res) => {
            if (err) throw err
            // console.log("-----res------")
            // console.log(res)
            resolve(res)
        })
    })

}

const handlePullUnloadMessageNotice = (content) => {
    // console.log('----pull message yuan----')
    // console.log(content)
    content = eval("(" + content + ")")
    // console.log(content)
    for (const i in content) {
        let c = content[i]
        // console.log("-----new message------")
        // console.log(c)
        for (const cKey in c) {
            if (!c[cKey]) {
                if (cKey === 'isGroupMessage') c[cKey] = 0
                else if (cKey === 'readed') c[cKey] = 0
                else c[cKey] = 'NULL'
            } else if (typeof c[cKey] === "string") {
                c[cKey] = "'" + c[cKey] + "'"
            }
        }
        db.run("insert into messageList(messageId, type, content, fromUser, toUser, isGroupMessage, readed, createTime)" +
            "values(" + c.id + "," + c.type + "," + c.content + "," +  c.fromUser + "," + c.toUser + "," + c.isGroupMessage + "," +  c.readed + "," + c.createTime + ")", err => {
            console.log("添加了新消息记录:", c.toString(), "err:", err)
            chatListAck++
        })
    }
}



const initMessages = (messageId: string) => {
    // console.log(messageId)
    let Message = {
        type: 4,
        notice: 4,
        content: messageId
    }
    // console.log(JSON.stringify(Message))
    // console.log(new Date().toLocaleString())
    ws.send(JSON.stringify(Message))
}


const sendMessage = (message) => {
    ws.send(message)
}


ipcMain.on('load-friends', (event, data) => {
    getUserFriend(data)
})

const getUserFriend = data => {
    if (data.code === 0) {
        for (const i in data.data) {
            let friend = data.data[i]
            if (friend.friendNickname === null) {
                friend.friendNickname = friend.user.username
            }
            db.run("delete from friend", err => {
                if (err) throw err
                db.run("insert into friend(avatarUrl, friendNickname, userAccount, username, sex, birth) values(" +
                    "'" + friend.user.avatarUrl + "'," +
                    "'" + friend.friendNickname + "'," +
                    friend.user.userAccount + "," +
                    "'" + friend.user.username + "'," +
                    "'" + friend.user.userSex + "'," +
                    friend.user.userBirth +
                    ")", err => {
                    if (err) throw err
                })
            })
        }
    }
}


ipcMain.on('remove-friend', (event, friendId) => {
    sendMessage(JSON.stringify({type: 4, notice: 5, content: friendId.toString(), isGroupMessage: 0}))
    db.run('delete from friend where userAccount=' + friendId, (err) => {
        if(err) throw err
        db.run('delete from messageList where fromUser=' + friendId + " or toUser=" + friendId, (err) => {
            if(err) throw err
            db.run('delete from chatList where userAccount=' + friendId, (err) => {
                if(err) throw err
            })
        })
    })
})

