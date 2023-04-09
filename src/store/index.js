import {createStore} from 'vuex'

export default createStore({
    state() {
        return {
            // id: 1,
            // type: 'text',
            // content: '你好',
            // imgUrl: null,
            // fileType: null,
            // fileName: null,
            // fileUrl: null,
            // fromUser: '20031',
            // toUser: '20032',
            // toUserType: 'user',
            // isGroupMessage: false,
            // fromGroup: null,
            // ip: '127.0.0.1',
            // readed: 0,
            // createTime: '2023-12-1 12:30:22'
            // message: {},
            // messageList: {userId: message[]}
            messageList: [],
            chatList: [],
            friendList: [],
            backUrl: "http://43.139.136.169:10027/api",
            wsUrl: "ws://43.139.136.169:10026/api/addWSConn"
        }
    },
    getters: {},
    mutations: {},
    actions: {},
    modules: {}
})
