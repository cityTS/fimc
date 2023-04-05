<template>
  <div class="message" v-if="refresh">
    <div class="message-body" v-for="(item, idx) in recordContent">
      <!--  好友发送的  -->
      <div class="friendMessage" v-if="item.toUser.toString() === myAccount">
        <el-avatar class="message-avatar" shape="square" :size="40" :src="getAvatarUrl(item.fromUser)"/>
        <span class="real-message">{{item.content}}</span>
      </div>
      <div class="myMessage" v-else>
        <span class="real-message">{{item.content}}</span>
        <el-avatar class="message-avatar" shape="square" :size="40" :src="getAvatarUrl(item.fromUser)"></el-avatar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ipcRenderer} from "electron";
import {nextTick, ref, watch} from "vue";
import {useRouter} from "vue-router";

const router = useRouter();
const myAccount = sessionStorage.getItem('userAccount');
const refresh = ref(true);
let recordContent: any[];
const queryFriendMessage = async (val: string) => {
  recordContent = await ipcRenderer.invoke('query-friend-message', val);
  refresh.value = false;
  await nextTick();
  refresh.value = true;
}
watch(() => router.currentRoute.value.params.userAccount, (val, old) => {
  if(typeof val === "string") queryFriendMessage(val);
}, {immediate: true})


const getAvatarUrl = (account: String) => {
  // TODO 请求获取头像信息
  return "https://picx.zhimg.com/80/v2-2e1641a8fb38884c8b185ee293d5ae12_720w.webp?source=1940ef5c";
}
</script>


<style>
.myMessage {
  text-align: right;
}
.message {
  height: 100%;
  width: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
}
.real-message {
  background-color: #07c160;
  max-width: 70%;
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  list-style: none;
  text-align: left;
  font-size: 14px;
  margin: 5px 0 0 0;
  display: inline-block;
  padding: 8px 10px;
  margin-top: 0;
  word-break: break-all;
  /*margin-left: 15px;*/
}

.message-avatar {
  margin-left: 15px;
  margin-right: 15px;
  background-color: #f5f5f5;
}
</style>

