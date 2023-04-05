<template>
  <div class="message-box" :style="bc" @mouseover="mouseover" @mouseleave="mouseleave" @click="openChatBody(message.userAccount)">
    <div class="message-box-avatar">
      <el-avatar shape="square" :size="45" fit="cover" :src="message.avatarUrl"/>
    </div>
    <div class="message-box-name-message-time">
      <div class="message-box-name-time">
        <p class="message-box-name">{{ message.friendNickname }}</p>
        <p class="message-box-time">{{ showTime(message.createTime) }}</p>
      </div>
      <p class="message-box-message">{{ message.recentNews }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {ref, watch} from "vue";
import {useRouter} from "vue-router";

// defineProps<{ message: Object }>()
const props = defineProps(['message']);
const message = props.message;
const router = useRouter();

const bc = ref('background-color:#e5e5e5')
const mouseover = () => {
  bc.value = 'background-color: #c4c4c4';
}
const mouseleave = () => {
  if(router.currentRoute.value.params.userAccount === message.userAccount.toString()) return;
  bc.value = 'background-color:#e5e5e5';
}
const openChatBody = (user_account: number) => {
  bc.value = 'background-color: #c4c4c4';
  router.push({path: '/chat/' + user_account});
}
watch(() => router.currentRoute.value.params.userAccount, (val, old) => {
  if(val === message.userAccount.toString()) {
    bc.value = 'background-color: #c4c4c4';
  } else {
    bc.value = 'background-color:#e5e5e5';
  }
}, {immediate: true})
const showTime = (timestamp: number) => {
  let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  let Y = date.getFullYear() + '-';
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  let timestampNow = Date.now();
  date = new Date(timestampNow);
  let YY = date.getFullYear() + '-';
  let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let DD = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  if (Y === YY && M === MM && D === DD) {
    return h + m;
  } else {
    return Y + M + D;
  }
}
</script>

<style>
.message-box {
  width: 100%;
  height: 65px;
  display: flex;
}

.message-box-avatar {
  padding: 10px 10px 10px 10px;
  width: 45px;
}

.message-box-name-message-time {
  width: calc(100% - 65px);
  height: 65px;
  flex: 1;
}

.message-box-name-message-time p {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.message-box-name {
  font-size: 14px;
  color: #000000;
  margin: 10px 0 0 0;
  float: left;
}

.message-box-message {
  font-size: 12px;
  color: #999999;
  margin: 10px 0 0 0;
}

.message-box-time {
  font-size: 12px;
  color: #999999;
  margin-right: 5px;
  float: right;
}
.message-box-name-time {
  height: 30px;
}
</style>