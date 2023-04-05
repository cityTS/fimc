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

const store = useStore();

/**
 * 加载SQLite3
 */
const loadSQLite3 = () => {
  ipcRenderer.send("load-sqlite3", "100000");
};
loadSQLite3();

/**
 * 查询聊天记录列表
 */
const queryChatList = async () => {
  store.state.chatList = await ipcRenderer.invoke('query-chat-list');
};
queryChatList();


/**
 * 查找好友列表
 */
const queryFriendList = async () => {
  store.state.friendList = await ipcRenderer.invoke('query-friend-list');
}
queryFriendList();

const createWSCon = () => {
  let userId = sessionStorage.getItem('userAccount')
  ipcRenderer.send('create-ws-con', userId)
}
createWSCon()
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