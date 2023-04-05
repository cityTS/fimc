<template>
  <div class="chat-page-dialog-editor-name-show-text">
    <div class="chat-page-dialog-editor-name">
      <p>{{ userName }}</p>
    </div>
    <div class="chat-page-dialog-editor-show">
      <chat-page-dialog-show :userAccount="account"/>
    </div>
    <div class="chat-page-dialog-editor-text">
      <text-editor-com/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ipcRenderer} from "electron";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";
import TextEditorCom from "./TextEditorCom.vue";
import ChatPageDialogShow from "./ChatPageDialogShow.vue";
// emoji css (全局注册被存在样式混乱、覆盖)
import 'vue3-emoji/dist/style.css'

const router = useRouter();
const userName = ref('');
const account = ref(0);
const getUserInfo = async (userAccount: String) => {
  const user = await ipcRenderer.invoke('query-user', userAccount);
  userName.value = user.friendNickname;
  account.value = user.userAccount;
}
watch(() => router.currentRoute.value.params.userAccount, (val, old) => {
  if (typeof val === "string") {
    getUserInfo(val);
  }
}, {immediate: true})
</script>

<style>
.chat-page-dialog-editor-name p {
  color: #000000;
  font-size: 19px;
  padding: 20px 0 0 10px;
  margin: 0;
}

.chat-page-dialog-editor-name {
  background-color: #f5f5f5;
  height: 67px;
}

.chat-page-dialog-editor-text {
  width: 100%;
  height: 230px;
}
.chat-page-dialog-editor-name-show-text {
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;
}
.chat-page-dialog-editor-show {
  height: calc(100% - 230px - 67px);
  width: 100%;
}
</style>