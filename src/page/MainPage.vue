<template>
  <div class="chat-all-body">
    <el-container style="height:100%;">
      <el-aside width="55px">
        <button-com></button-com>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import ButtonCom from "../components/ButtonCom.vue";
import {ipcRenderer} from "electron";
import {useStore} from "vuex";
import {queryUserFriends} from "../api/apis.js";

const store = useStore();

/**
 * 加载SQLite3
 */
const loadSQLite3 = async () => {
  return await ipcRenderer.invoke("load-sqlite3", sessionStorage.getItem('userAccount'));
};
/**
 * 查询聊天记录列表
 */
const queryChatList = async () => {
  store.state.chatList = await ipcRenderer.invoke('query-chat-list')
  setInterval(() => {
    ipcRenderer.send('get-news-message')
  }, 10000)
};

/**
 * 查找好友列表
 */
const queryFriendList = async () => {
  store.state.friendList = await ipcRenderer.invoke('query-friend-list');
}

const Sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 建立ws通话连接
 */
const createWSCon = () => {
  let userId = sessionStorage.getItem('userAccount')
  ipcRenderer.send('create-ws-con', userId)
}

/**
 * 加载本地缓存的数据
 */
const init = () => {
  createWSCon()
  Sleep(1000)
  loadSQLite3().then(async status => {
    if (status === 1) {
      // 给数据库加载一定的时间
      await Sleep(1000)
      queryChatList()
      queryFriendList()
    }
  })
}
init();

let chatListAck = -1;

setInterval(async () => {
  let d = await ipcRenderer.invoke('get-chat-list-ack')
  if(d != chatListAck) {
    chatListAck = d
    ipcRenderer.send('update-chat-list')
    await Sleep(1000)
    queryChatList()
  }
}, 500)

</script>

<style>
.el-main {
  padding: 0;
}

/*#app {*/
/*  position : absolute;*/
/*  height: 100%;*/
/*  width: 100%;*/
/*  padding: 0;*/
/*  text-align: left;*/
/*}*/

.chat-all-body {
  position: absolute;
  height: 100%;
  width: 100%;
  padding: 0;
  text-align: left;
  left: 0;
  top: 0;
}
</style>