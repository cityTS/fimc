<template>
  <div class="chat-list-com-search">
    <el-input
        v-model="searchInfo"
        placeholder="搜索"
        :prefix-icon="Search"
    />
  </div>
  <div class="chat-list-com-list" v-if="shudder">
      <chat-message-box v-for="(item, idx) in showChatList" :key="item.createTime" :message="item"/>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, ref, watch} from "vue";
import {Search} from "@element-plus/icons";
import {useStore} from "vuex"
import ChatMessageBox from "./ChatMessageBox.vue";
const searchInfo = ref('');
const store = useStore();
const shudder = ref(true);
let allChatList: any[];
let showChatList: any[];
const shudderDom = async () => {
  shudder.value = false;
  await nextTick();
  showChatList.sort((a, b) => {
    return a.createTime - b.createTime;
  })
  shudder.value = true;
}
watch(() => store.state.chatList, (val, old) => {
  allChatList = val;
  showChatList = allChatList.filter((item: { friendNickname: string; }) => (searchInfo.value === '' || item.friendNickname.includes(searchInfo.value)))
  showChatList.sort((a, b) => {
    return a.createTime - b.createTime;
  })
  shudderDom()
  console.log(showChatList)
},{deep: true, immediate: true})
watch(() => searchInfo.value, (val, old) => {
  showChatList = allChatList.filter((item: {friendNickname: string;}) => (val === '' || item.friendNickname.includes(val)))
  shudderDom();
})

</script>

<style>
.chat-list-com-search {
  padding: 20px 10px 15px 10px;
  background-color: #f7f7f7;
}
.chat-list-com-list {
  height: calc(100% - 67px);
  background-color: #e5e5e5;
}
</style>