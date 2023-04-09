<template>
  <div class="message" v-if="refresh">
    <div class="message-body" v-for="(item, idx) in recordContent">
      <!--  好友发送的  -->
      <div class="friendMessage" v-if="item.toUser.toString() === myAccount">
        <el-avatar class="message-avatar" shape="square" :size="40" :src="map[item.fromUser]"/>
        <span class="real-message">{{ item.content }}</span>
      </div>
      <div class="myMessage" v-else>
        <span class="real-message">{{ item.content }}</span>
        <el-avatar class="message-avatar" shape="square" :size="40" :src="map[item.fromUser]"></el-avatar>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ipcRenderer} from "electron";
import {nextTick, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {queryUserAvatarUrl} from "../api/apis.js";

const router = useRouter();
const myAccount = sessionStorage.getItem('userAccount');
const refresh = ref(true);
let recordContent: any[];
let map = {}
const getAvatarUrl = async (account: String) => {
  const data = await queryUserAvatarUrl({userId: account})
  return data.data;
}
const queryFriendMessage = async (val: string) => {
  recordContent = await ipcRenderer.invoke('query-friend-message', val);
  recordContent.reverse()
  refresh.value = false;
  for (let i = 0; i < recordContent.length; i++) {
    if(map[recordContent[i].fromUser] == undefined) {
      map[recordContent[i].fromUser] = await getAvatarUrl(recordContent[i].fromUser)
    }
    if(map[recordContent[i].toUser] == undefined) {
      map[recordContent[i].toUser] = await getAvatarUrl(recordContent[i].toUser)
    }
  }
  await nextTick();
  refresh.value = true;
}
let ack = -1
const getAck = async () => {
  let d = await ipcRenderer.invoke('get-chat-list-ack')
  if (ack != d) {
    ack = d
    queryFriendMessage(router.currentRoute.value.params.userAccount)
  }
}
let id = -1
watch(() => router.currentRoute.value.params.userAccount, (val, old) => {
  if(id != -1) clearInterval(id)
  if (val !== 'undefined' && val !== undefined) {
    queryFriendMessage(val);
    id = setInterval(getAck, 500)
  }
}, {immediate: true})

// ipcRenderer.on('date-has-update', (event) => {
//   if (router.currentRoute.value.params.userAccount !== 'undefined')
//     queryFriendMessage(router.currentRoute.value.params.userAccount)
// })


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

