<template>
  <div class="friend-page-info-body">
    <div class="friend-page-info-body-first">
      <div class="first-avatar">
        <el-avatar shape="square" :size="65" fit="cover" :src="info.avatarUrl"/>
      </div>
      <div class="first-message">
        <p class="first-message-friendNickname">{{info.friendNickname}}</p>
        <p class="first-message-username">昵称: {{ info.username }}</p>
        <p class="first-message-userAccount">FIM号: {{ info.userAccount }}</p>

      </div>
    </div>
    <div class="friend-page-info-body-second">
      <el-button type="success" @click="sendMessage">发消息</el-button>
      <el-button type="danger" @click="removeFriend">删除好友</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, watch} from "vue";
import {useRouter} from "vue-router";
import {ipcRenderer} from "electron";
import {deleteFriend} from "../api/apis";

const router = useRouter();
const info = reactive({
  avatarUrl: '',
  friendNickname: '',
  username: '',
  userAccount: 0
})
const sendMessage = () => {
  router.push({path: "/chat/" + info.userAccount})
}

const removeFriend = () => {
  ipcRenderer.send('remove-friend', info.userAccount)
  deleteFriend({friendId: info.userAccount, userId: sessionStorage.getItem('userAccount')})
  router.push({path: "/chat/friend"})
}

const getUserInfo = async () => {

  let userInfo = await ipcRenderer.invoke('query-user', router.currentRoute.value.params.userAccount)
  info.avatarUrl = userInfo.avatarUrl
  info.friendNickname = userInfo.friendNickname
  info.username = userInfo.username
  info.userAccount = userInfo.userAccount
  console.log('----info------')
  console.log(info)
}

watch(() => router.currentRoute.value.params.userAccount, (val, old) => {
  console.log("------watch.Friend.userAccount------")
  console.log(val)
  console.log(old)
  console.log(router.currentRoute.value.fullPath)
  console.log(val !== 'undefined' && router.currentRoute.value.fullPath.includes('friend'))
  if(val !== 'undefined' && val !== undefined && router.currentRoute.value.fullPath.includes('friend')) {
    getUserInfo()
  }
}, {immediate: true})

</script>

<style>
.friend-page-info-body {
  height: 100%;
  width: 100%;
}
.friend-page-info-body-first {
  display: flex;
  width: 300px;
  height: 100px;
  margin: 0 auto;
  margin-top: 130px;
}
.first-avatar {
  padding: 10px 10px 10px 10px;
  width: 75px;
}
.first-message {
  flex: 1;
  margin-top: 20px;
}
.first-message-username {
  font-size: 12px;
}
.first-message-userAccount {
  font-size: 12px;
}
.friend-page-info-body-second {
  margin: 0 auto;
  text-align: center;
}
</style>