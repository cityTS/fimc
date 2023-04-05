<template>
  <div class="friend-box" @click="openFriendBody(myFriend.userAccount)">
    <div class="friend-box-avatar">
      <el-avatar shape="square" :size="35" fit="cover" :src="myFriend.avatarUrl"/>
    </div>
    <div class="friend-box-name">
      <p class="friend-box-name-item">{{myFriend.friendNickname}}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>

import {useRouter} from "vue-router";

const props = defineProps(['friend']);
const myFriend = props.friend;
const router = useRouter();
const openFriendBody = (user_account: number) => {
  router.push({path: '/chat/friend/' + user_account});
};
</script>

<style>
.friend-box {
  width: 100%;
  height: 55px;
  display: flex;
}
.friend-box-avatar {
  padding: 10px 10px 10px 10px;
  width: 45px;
}
.friend-box-name {
  width: calc(100% - 65px);
  height: 65px;
  flex: 1;
}
.friend-box-name-item {
  font-size: 14px;
  color: #000000;
  margin: 18px 0 0 0;
  float: left;
}
</style>