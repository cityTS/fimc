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
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive} from "vue";
import {useRouter} from "vue-router";
const router = useRouter();
// TODO 服务器请求，不通过本地缓存
const info = reactive({
  avatarUrl: "https://picx.zhimg.com/80/v2-2e1641a8fb38884c8b185ee293d5ae12_720w.webp?source=1940ef5c",
  friendNickname: "金珉瑞",
  userAccount: 100001,
  username: "我是胡桃的狗"
})
const sendMessage = () => {
  router.push({path: "/chat/" + info.userAccount})
}
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